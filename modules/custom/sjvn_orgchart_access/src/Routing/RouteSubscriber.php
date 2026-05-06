<?php

namespace Drupal\sjvn_orgchart_access\Routing;

use Drupal\Core\Routing\RouteSubscriberBase;
use Symfony\Component\Routing\RouteCollection;

/**
 * Listens to the dynamic route events.
 */
class RouteSubscriber extends RouteSubscriberBase {

  /**
   * {@inheritdoc}
   */
  protected function alterRoutes(RouteCollection $collection) {
    // The routes provided by the 'orgchart' module.
    $orgchart_routes = [
      'orgchart.configuration',
      'orgchart.configuration.add',
      'orgchart.configuration.chart.build',
      'orgchart.configuration.chart.yaml',
      'orgchart.configuration.chart.edit',
      'orgchart.configuration.chart.delete',
    ];

    foreach ($orgchart_routes as $route_name) {
      if ($route = $collection->get($route_name)) {
        // Set the requirement to our custom permission.
        // We ensure administrators have this permission, so they won't lose access.
        $route->setRequirement('_permission', 'edit org chart');
      }
    }
  }

}
