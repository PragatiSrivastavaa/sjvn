<?php

namespace Drupal\sjvn_custom\Service;

use Drupal\permissions_by_term\Service\AccessCheck;
use Drupal\Core\Session\AccountInterface;
use Drupal\user\Entity\User;

class CustomAccessCheck extends AccessCheck {

  /**
   * Overrides isAccessAllowedByDatabase to grant blanket access for viewing.
   */
  public function isAccessAllowedByDatabase($tid, $uid = FALSE, $langcode = '') {
    // Blanket allow access at the database level for the PbT service.
    // This ensures that 'Permissions by Term' does not restrict viewing content
    // on the frontend. The category-wise editorial restrictions are enforced
    // separately in sjvn_term_access_node_access.
    return TRUE;
  }
  
}
