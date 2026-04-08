<?php

namespace Drupal\sjvn_custom;

use Drupal\Core\DependencyInjection\ContainerBuilder;
use Drupal\Core\DependencyInjection\ServiceProviderBase;

/**
 * Modifies the permissions_by_term.access_check service to use our custom class.
 */
class SjvnCustomServiceProvider extends ServiceProviderBase {

  /**
   * {@inheritdoc}
   */
  public function alter(ContainerBuilder $container) {
    if ($container->hasDefinition('permissions_by_term.access_check')) {
      $definition = $container->getDefinition('permissions_by_term.access_check');
      $definition->setClass('Drupal\sjvn_custom\Service\CustomAccessCheck');
    }
  }

}
