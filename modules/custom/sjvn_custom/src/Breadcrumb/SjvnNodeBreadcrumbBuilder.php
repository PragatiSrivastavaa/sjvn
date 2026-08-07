<?php

namespace Drupal\sjvn_custom\Breadcrumb;

use Drupal\Core\Breadcrumb\Breadcrumb;
use Drupal\Core\Breadcrumb\BreadcrumbBuilderInterface;
use Drupal\Core\Link;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Url;
use Drupal\node\NodeInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\Core\Menu\MenuLinkManagerInterface;
use Drupal\path_alias\AliasManagerInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;

/**
 * Fully dynamic Breadcrumb Builder for Node pages in SJVN site.
 */
class SjvnNodeBreadcrumbBuilder implements BreadcrumbBuilderInterface {
  use StringTranslationTrait;

  /**
   * The menu link manager.
   *
   * @var \Drupal\Core\Menu\MenuLinkManagerInterface
   */
  protected $menuLinkManager;

  /**
   * The path alias manager.
   *
   * @var \Drupal\path_alias\AliasManagerInterface
   */
  protected $pathAliasManager;

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * Constructs a SjvnNodeBreadcrumbBuilder object.
   */
  public function __construct(MenuLinkManagerInterface $menu_link_manager, AliasManagerInterface $path_alias_manager, EntityTypeManagerInterface $entity_type_manager = NULL) {
    $this->menuLinkManager = $menu_link_manager;
    $this->pathAliasManager = $path_alias_manager;
    $this->entityTypeManager = $entity_type_manager ?: \Drupal::entityTypeManager();
  }

  /**
   * {@inheritdoc}
   */
  public function applies(RouteMatchInterface $route_match) {
    if ($route_match->getRouteName() === 'entity.node.canonical') {
      $node = $route_match->getParameter('node');
      if ($node instanceof NodeInterface) {
        if (\Drupal::service('path.matcher')->isFrontPage()) {
          return FALSE;
        }
        return TRUE;
      }
    }
    return FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function build(RouteMatchInterface $route_match) {
    $breadcrumb = new Breadcrumb();
    $breadcrumb->addCacheContexts(['url.path', 'route', 'languages']);

    $node = $route_match->getParameter('node');
    if (!$node instanceof NodeInterface) {
      return $breadcrumb;
    }
    $breadcrumb->addCacheableDependency($node);

    $links = [];
    // Start with Home link
    $links[] = Link::fromTextAndUrl($this->t('Home'), Url::fromRoute('<front>'));

    // Check if node is directly in main menu
    $menu_links = $this->menuLinkManager->loadLinksByRoute('entity.node.canonical', ['node' => $node->id()], 'main');
    $parent_trail_links = [];

    if (!empty($menu_links)) {
      $menu_link = reset($menu_links);
      $parent_id = $menu_link->getParent();
      while ($parent_id) {
        $parent_link = $this->menuLinkManager->createInstance($parent_id);
        array_unshift($parent_trail_links, Link::fromTextAndUrl($parent_link->getTitle(), $parent_link->getUrlObject()));
        $parent_id = $parent_link->getParent();
      }
    }
    else {
      // Find parent URL dynamically (via path hierarchy, menu parent, pattern, or bundle mapping)
      $parent_url = $this->getParentUrlForNode($node);
      if ($parent_url) {
        try {
          $langcode = $node->language()->getId();
          $internal_path = $this->pathAliasManager->getPathByAlias($parent_url, $langcode);
          $url_obj = Url::fromUserInput($internal_path);
          if ($url_obj->isRouted()) {
            $r_name = $url_obj->getRouteName();
            $r_params = $url_obj->getRouteParameters();
            $p_menu_links = $this->menuLinkManager->loadLinksByRoute($r_name, $r_params, 'main');
            if (!empty($p_menu_links)) {
              $p_link = reset($p_menu_links);
              $curr = $p_link;
              while ($curr) {
                array_unshift($parent_trail_links, Link::fromTextAndUrl($curr->getTitle(), $curr->getUrlObject()));
                $p_id = $curr->getParent();
                $curr = $p_id ? $this->menuLinkManager->createInstance($p_id) : NULL;
              }
            }
            else {
              // If parent route is valid node/page, get its title & url
              $parent_title = $this->getTitleForUrlObject($url_obj);
              if ($parent_title) {
                $parent_trail_links[] = Link::fromTextAndUrl($parent_title, $url_obj);
              }
            }
          }
        }
        catch (\Exception $e) {
          // Ignore invalid URL lookup
        }
      }
    }

    foreach ($parent_trail_links as $l) {
      $links[] = $l;
    }

    // Append current page title as active
    $links[] = Link::createFromRoute($node->label(), '<none>');

    $breadcrumb->setLinks($links);
    return $breadcrumb;
  }

  /**
   * Helper to determine parent section URL for a node dynamically.
   */
  protected function getParentUrlForNode(NodeInterface $node) {
    $nid = $node->id();
    $langcode = $node->language()->getId();
    $alias = $this->pathAliasManager->getAliasByPath('/node/' . $nid, $langcode);

    // 1. Try nested path alias segments (e.g. /rr-plan-projects/monitoring-rr-activities-rhps)
    if ($alias && $alias !== '/node/' . $nid) {
      $parts = array_values(array_filter(explode('/', $alias)));
      if (count($parts) > 1) {
        $parent_path = '/' . implode('/', array_slice($parts, 0, count($parts) - 1));
        try {
          $url_obj = Url::fromUserInput($parent_path);
          if ($url_obj->isRouted()) {
            return $parent_path;
          }
        }
        catch (\Exception $e) {
        }
      }
    }

    // 2. Keyword & Alias pattern matching for dynamic child pages (like R&R, CSR, etc.)
    if ($alias && $alias !== '/node/' . $nid) {
      $clean_alias = strtolower($alias);
      if (strpos($clean_alias, 'rr-') !== FALSE || strpos($clean_alias, 'r-and-r') !== FALSE || strpos($clean_alias, 'rhps') !== FALSE || strpos($clean_alias, 'hep') !== FALSE) {
        return '/rr-plan-projects';
      }
    }

    // 3. Dynamic Category lookup for Our Business nodes
    if ($node->hasField('field_business_cat') && !$node->get('field_business_cat')->isEmpty()) {
      $term = $node->get('field_business_cat')->entity;
      if ($term) {
        $term_name = strtolower(trim($term->getName()));
        $term_map = [
          'hydro power' => '/hydropower',
          'power trading' => '/paavara-taraedainga',
          'thermal power' => '/thermalpower',
          'wind power' => '/windpower',
          'solar power' => '/solarpower',
          'power transmission' => '/powertransmission',
          'consulting' => '/paraamarasa-kaaraya',
        ];
        if (isset($term_map[$term_name])) {
          return $term_map[$term_name];
        }
      }
    }

    // 4. Bundle mapping fallback for structured content types
    $bundle_map = [
      'career' => '/current-job',
      'board_of_directors' => '/board-of-directors',
      'our_business' => '/hydropower',
      'our_power_stations' => '/hydropower',
      'photo_gallery' => '/photo_gallery',
      'video_gallery' => '/video-gallery',
      'news_announcement' => '/press-release',
      'investor_relations' => '/Corporate-Governance',
      'key_executive' => '/key-executive',
      'tariff_petition' => '/tariff-petition',
      'energy_bill' => '/energy-bill',
      'tender' => '/archive-testing',
      'tender_award' => '/archive-testing',
      'empanelled_hospital' => '/list-empaneled-hospitals',
    ];

    $bundle = $node->bundle();
    return isset($bundle_map[$bundle]) ? $bundle_map[$bundle] : NULL;
  }

  /**
   * Get title for a URL object if it resolves to a node or route.
   */
  protected function getTitleForUrlObject(Url $url_obj) {
    if ($url_obj->getRouteName() === 'entity.node.canonical') {
      $params = $url_obj->getRouteParameters();
      if (!empty($params['node'])) {
        $parent_node = $this->entityTypeManager->getStorage('node')->load($params['node']);
        if ($parent_node) {
          return $parent_node->label();
        }
      }
    }
    return NULL;
  }
}
