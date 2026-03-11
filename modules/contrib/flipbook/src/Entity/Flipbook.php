<?php

declare(strict_types=1);

namespace Drupal\flipbook\Entity;

use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\StringTranslation\TranslatableMarkup;
use Drupal\flipbook\FlipbookInterface;
use Drupal\user\UserInterface;
use Drupal\Component\Utility\Environment;

/**
 * Defines the Flipbook entity.
 *
 * @ingroup flipbook
 *
 * @ContentEntityType(
 *   id = "flipbook",
 *   label = @Translation("Flipbook entity"),
 *   handlers = {
 *     "view_builder" = "Drupal\Core\Entity\EntityViewBuilder",
 *     "list_builder" = "Drupal\flipbook\Entity\Controller\FlipbookListBuilder",
 *     "views_data" = "Drupal\views\EntityViewsData",
 *     "form" = {
 *       "add" = "Drupal\flipbook\Form\FlipbookForm",
 *       "edit" = "Drupal\flipbook\Form\FlipbookForm",
 *       "delete" = "Drupal\flipbook\Form\FlipbookDeleteForm",
 *     },
 *     "access" = "Drupal\flipbook\FlipbookAccessControlHandler",
 *   },
 *   base_table = "flipbook",
 *   admin_permission = "administer flipbook entity",
 *   fieldable = TRUE,
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "name",
 *     "uuid" = "uuid",
 *     "flipbook_cover" = "flipbook_cover",
 *     "flipbook" = "flipbook"
 *   },
 *   links = {
 *     "canonical" = "/flipbook/{flipbook}",
 *     "edit-form" = "/flipbook/{flipbook}/edit",
 *     "delete-form" = "/contact/{flipbook}/delete",
 *     "collection" = "/flipbook/list"
 *   },
 *   field_ui_base_route = "flipbook.settings",
 * )
 */
class Flipbook extends ContentEntityBase implements FlipbookInterface {

  /**
   * {@inheritdoc}
   */
  public static function preCreate(EntityStorageInterface $storage_controller, array &$values): void {
    parent::preCreate($storage_controller, $values);
    $values += [
      'user_id' => \Drupal::currentUser()->id(),
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getCreatedTime(): int {
    return (int) $this->get('created')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function getChangedTime(): int {
    return (int) $this->get('changed')->value;
  }

  /**
   * {@inheritdoc}
   */
  public function setChangedTime($timestamp): static {
    $this->set('changed', $timestamp);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function getChangedTimeAcrossTranslations(): int {
    $changed = $this->getUntranslated()->getChangedTime();
    foreach ($this->getTranslationLanguages(FALSE) as $language) {
      $translation_changed = $this->getTranslation($language->getId())->getChangedTime();
      $changed = max($translation_changed, $changed);
    }
    return $changed;
  }

  /**
   * {@inheritdoc}
   */
  public function getOwner(): ?UserInterface {
    return $this->get('user_id')->entity;
  }

  /**
   * {@inheritdoc}
   */
  public function getOwnerId(): ?int {
    return $this->get('user_id')->target_id;
  }

  /**
   * {@inheritdoc}
   */
  public function setOwnerId($uid): static {
    $this->set('user_id', $uid);
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public function setOwner(UserInterface $account): static {
    $this->set('user_id', $account->id());
    return $this;
  }

  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type): array {

    $fields['id'] = BaseFieldDefinition::create('integer')
      ->setLabel(new TranslatableMarkup('ID'))
      ->setDescription(new TranslatableMarkup('The ID of the Flipbook entity.'))
      ->setReadOnly(TRUE);

    $fields['uuid'] = BaseFieldDefinition::create('uuid')
      ->setLabel(new TranslatableMarkup('UUID'))
      ->setDescription(new TranslatableMarkup('The UUID of the Flipbook entity.'))
      ->setReadOnly(TRUE);

    $fields['name'] = BaseFieldDefinition::create('string')
      ->setLabel(new TranslatableMarkup('Name'))
      ->setDescription(new TranslatableMarkup('Name of the Flipbook entity.'))
      ->setRequired(TRUE)
      ->setSettings([
        'default_value' => '',
        'max_length' => 255,
        'text_processing' => 0,
      ])
      ->setDisplayOptions('view', [
        'label' => 'above',
        'type' => 'string',
        'weight' => -6,
      ])
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => -6,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE);

    $fields['flipbook_cover'] = BaseFieldDefinition::create('image')
      ->setLabel(new TranslatableMarkup('Flipbook Cover Image'))
      ->setDescription(new TranslatableMarkup('Upload Flipbook Cover Image'))
      ->setRequired(TRUE)
      ->setSettings([
        'file_directory' => 'flipbook',
        'alt_field_required' => FALSE,
        'file_extensions' => 'png jpg jpeg',
      ])
      ->setDisplayOptions('view', [
        'label' => 'hidden',
        'type' => 'image',
        'weight' => 0,
      ])
      ->setDisplayOptions('form', [
        'type' => 'image_image',
        'weight' => 0,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE);

    $validators = [
      'file_validate_extensions' => ['pdf'],
      'file_validate_size' => [Environment::getUploadMaxSize()],
    ];

    $fields['flipbook'] = BaseFieldDefinition::create('file')
      ->setLabel(new TranslatableMarkup('Flipbook PDF'))
      ->setDescription(new TranslatableMarkup('Upload Flipbook PDF file.'))
      ->setRequired(TRUE)
      ->setSetting('upload_validators', $validators)
      ->setSetting('file_extensions', 'pdf')
      ->setDisplayOptions('view', [
        'label' => 'above',
        'type' => 'file_default',
        'weight' => -3,
      ])
      ->setDisplayOptions('form', [
        'type' => 'file_generic',
        'settings' => [
          'upload_validators' => $validators,
        ],
        'weight' => -3,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE);

    $fields['user_id'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(new TranslatableMarkup('User ID'))
      ->setDescription(new TranslatableMarkup('The user ID of the Flipbook author.'))
      ->setSetting('target_type', 'user')
      ->setDefaultValueCallback(static::class . '::getDefaultEntityOwner');

    $fields['langcode'] = BaseFieldDefinition::create('language')
      ->setLabel(new TranslatableMarkup('Language code'))
      ->setDescription(new TranslatableMarkup('The language code of Flipbook entity.'));

    $fields['created'] = BaseFieldDefinition::create('created')
      ->setLabel(new TranslatableMarkup('Created'))
      ->setDescription(new TranslatableMarkup('The time that the entity was created.'));

    $fields['changed'] = BaseFieldDefinition::create('changed')
      ->setLabel(new TranslatableMarkup('Changed'))
      ->setDescription(new TranslatableMarkup('The time that the entity was last edited.'));

    return $fields;
  }

  /**
   * Returns the default value for the entity owner.
   *
   * @return int
   *   The current user ID.
   */
  public static function getDefaultEntityOwner(): int {
    return (int) \Drupal::currentUser()->id();
  }

}
