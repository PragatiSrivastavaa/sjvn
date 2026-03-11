<?php

declare(strict_types=1);

namespace Drupal\flipbook;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityChangedInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface defining a Flipbook entity.
 *
 * @ingroup flipbook
 */
interface FlipbookInterface extends ContentEntityInterface, EntityOwnerInterface, EntityChangedInterface {

}
