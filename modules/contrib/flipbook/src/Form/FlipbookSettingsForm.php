<?php

declare(strict_types=1);

namespace Drupal\flipbook\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Settings form for Flipbook entity.
 *
 * @ingroup flipbook
 */
class FlipbookSettingsForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId(): string {
    return 'flipbook_settings';
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state): void {
    // Empty implementation of the abstract submit class.
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state): array {
    $form['flipbook_settings']['#markup'] = $this->t('Settings form for FlipbookEntity. Manage field settings here.');
    return $form;
  }

}
