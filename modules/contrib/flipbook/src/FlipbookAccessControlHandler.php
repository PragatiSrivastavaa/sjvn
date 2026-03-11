<?php

declare(strict_types=1);

namespace Drupal\flipbook;

use Drupal\Core\Access\AccessResult;
use Drupal\Core\Access\AccessResultInterface;
use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;

/**
 * Access controller for the Flipbook entity.
 *
 * @see \Drupal\flipbook\Entity\Flipbook.
 */
class FlipbookAccessControlHandler extends EntityAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account): AccessResultInterface {
    return match ($operation) {
      'view' => AccessResult::allowedIfHasPermission($account, 'view flipbook entity'),
      'edit', 'update' => AccessResult::allowedIfHasPermission($account, 'edit flipbook entity'),
      'delete' => AccessResult::allowedIfHasPermission($account, 'delete flipbook entity'),
      default => AccessResult::allowed(),
    };
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL): AccessResultInterface {
    return AccessResult::allowedIfHasPermission($account, 'add flipbook entity');
  }

}
