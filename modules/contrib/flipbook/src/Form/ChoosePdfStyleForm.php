<?php

declare(strict_types=1);

namespace Drupal\flipbook\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Configure custom settings for this site.
 */
class ChoosePdfStyleForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId(): string {
    return 'choose_pdf_style_form';
  }

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames(): array {
    return ['config.flipbook_chooseconfig'];
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state): array {
    $config = $this->config('config.flipbook_chooseconfig');

    $form['choice'] = [
      '#type' => 'radios',
      '#title' => $this->t('Popup Pdf'),
      '#options' => [0 => $this->t('No'), 1 => $this->t('Yes')],
      '#default_value' => $config->get('pdf.choice') ?? 0,
      '#description' => $this->t('Choose if you want pop-up pdf'),
    ];

    return parent::buildForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state): void {
    $this->config('config.flipbook_chooseconfig')
      ->set('pdf.choice', $form_state->getValue('choice'))
      ->save();

    parent::submitForm($form, $form_state);
  }

}
