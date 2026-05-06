<?php

namespace Drupal\sjvn_orgchart_access\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Routing\RouteMatchInterface;

/**
 * Restricts Edit/Configuration access to the Organization Chart.
 */
class OrgChartAccessSubscriber implements EventSubscriberInterface {

  /**
   * The current user.
   *
   * @var \Drupal\Core\Session\AccountInterface
   */
  protected $currentUser;

  /**
   * The current route match.
   *
   * @var \Drupal\Core\Routing\RouteMatchInterface
   */
  protected $routeMatch;

  /**
   * Constructs a new OrgChartAccessSubscriber.
   */
  public function __construct(AccountInterface $current_user, RouteMatchInterface $route_match) {
    $this->currentUser = $current_user;
    $this->routeMatch = $route_match;
  }

  /**
   * {@inheritdoc}
   */
  public static function getSubscribedEvents() {
    $events[KernelEvents::REQUEST][] = ['onKernelRequest', 30];
    return $events;
  }

  /**
   * Restricts access on kernel request.
   */
  public function onKernelRequest(RequestEvent $event) {
    if (!$event->isMainRequest()) {
      return;
    }

    $route_name = $this->routeMatch->getRouteName();
    if (!$route_name) {
      return;
    }

    // We ONLY block the explicit backend path provided by the user.
    $path = $event->getRequest()->getPathInfo();
    
    if (strpos($path, '/admin/config/orgchart') !== false) {
      
      // Allow administrators or users with the custom 'edit org chart' permission.
      if (in_array('administrator', $this->currentUser->getRoles()) || $this->currentUser->hasPermission('edit org chart')) {
        return;
      }

      // If neither, access is denied.
      throw new AccessDeniedHttpException('Access Restricted: You do not have permission to edit the Organization Chart.');
    }
  }

}
