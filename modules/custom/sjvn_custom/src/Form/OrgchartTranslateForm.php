<?php

namespace Drupal\sjvn_custom\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Language\LanguageManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Form to translate Orgchart titles and subtitles into Hindi.
 */
class OrgchartTranslateForm extends FormBase {

  /**
   * The config factory.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;

  /**
   * The language manager.
   *
   * @var \Drupal\Core\Language\LanguageManagerInterface
   */
  protected $languageManager;

  /**
   * Constructs a new OrgchartTranslateForm.
   */
  public function __construct(ConfigFactoryInterface $config_factory, LanguageManagerInterface $language_manager) {
    $this->configFactory = $config_factory;
    $this->languageManager = $language_manager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory'),
      $container->get('language_manager')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'sjvn_custom_orgchart_translate_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state, $id = NULL) {
    $config_name = 'orgchart.charts.' . $id;
    $config = $this->configFactory->get($config_name);

    if ($config->isNew()) {
      $this->messenger()->addError($this->t('Orgchart configuration not found.'));
      return $form;
    }

    // Store the config name and chart ID for the submit handler.
    $form['config_name'] = [
      '#type' => 'value',
      '#value' => $config_name,
    ];
    $form['chart_id'] = [
      '#type' => 'value',
      '#value' => $id,
    ];

    // Get existing Hindi overrides.
    $hi_override = $this->languageManager->getLanguageConfigOverride('hi', $config_name);
    $hi_data = $hi_override->get();

    $build = $config->get('build');
    $layouts = ['desktop', 'tablet', 'phone'];

    $form['description'] = [
      '#markup' => '<p>' . $this->t('Enter Hindi translations for the Orgchart boxes below. Leave blank to keep the English text.') . '</p>',
    ];

    foreach ($layouts as $layout) {
      if (!isset($build[$layout]['values']['cells'])) {
        continue;
      }

      $cells = $build[$layout]['values']['cells'];

      $form[$layout] = [
        '#type' => 'details',
        '#title' => $this->t('@layout Layout', ['@layout' => ucfirst($layout)]),
        '#open' => ($layout === 'desktop'),
      ];

      foreach ($cells as $index => $cell) {
        $cell_id = $cell['id'] ?? $index;
        $english_title = $cell['title'] ?? '';
        $english_subtitle = $cell['subtitle'] ?? '';

        if (empty($english_title)) {
          continue;
        }

        $form[$layout]['cell_' . $layout . '_' . $index] = [
          '#type' => 'fieldset',
          '#title' => $this->t('Box @id: @title', ['@id' => $cell_id, '@title' => $english_title]),
        ];

        // Title field - always shown.
        $hi_title = $hi_data['build'][$layout]['values']['cells'][$index]['title'] ?? '';

        $form[$layout]['cell_' . $layout . '_' . $index]['title_en_' . $layout . '_' . $index] = [
          '#type' => 'item',
          '#title' => $this->t('English Title'),
          '#markup' => '<strong>' . htmlspecialchars($english_title) . '</strong>',
        ];

        $form[$layout]['cell_' . $layout . '_' . $index]['title_hi_' . $layout . '_' . $index] = [
          '#type' => 'textfield',
          '#title' => $this->t('Hindi Title'),
          '#default_value' => $hi_title,
          '#maxlength' => 512,
        ];

        // Subtitle / Description field - always shown.
        $hi_subtitle = $hi_data['build'][$layout]['values']['cells'][$index]['subtitle'] ?? '';

        $form[$layout]['cell_' . $layout . '_' . $index]['subtitle_en_' . $layout . '_' . $index] = [
          '#type' => 'item',
          '#title' => $this->t('English Description'),
          '#markup' => '<em>' . (!empty($english_subtitle) ? htmlspecialchars($english_subtitle) : $this->t('(empty)')) . '</em>',
        ];

        $form[$layout]['cell_' . $layout . '_' . $index]['subtitle_hi_' . $layout . '_' . $index] = [
          '#type' => 'textfield',
          '#title' => $this->t('Hindi Description'),
          '#default_value' => $hi_subtitle,
          '#maxlength' => 512,
        ];
      }
    }

    $form['actions'] = [
      '#type' => 'actions',
    ];
    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Save Hindi Translation'),
      '#button_type' => 'primary',
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    $config_name = $form_state->getValue('config_name');
    $chart_id = $form_state->getValue('chart_id');
    $config = $this->configFactory->get($config_name);
    $build = $config->get('build');
    $layouts = ['desktop', 'tablet', 'phone'];

    // Load or create the Hindi override.
    $hi_override = $this->languageManager->getLanguageConfigOverride('hi', $config_name);

    $override_data = [];

    foreach ($layouts as $layout) {
      if (!isset($build[$layout]['values']['cells'])) {
        continue;
      }

      $cells = $build[$layout]['values']['cells'];
      foreach ($cells as $index => $cell) {
        $title_value = $form_state->getValue('title_hi_' . $layout . '_' . $index, '');
        $subtitle_value = $form_state->getValue('subtitle_hi_' . $layout . '_' . $index, '');

        if (!empty($title_value)) {
          $override_data['build'][$layout]['values']['cells'][$index]['title'] = $title_value;
        }
        if (!empty($subtitle_value)) {
          $override_data['build'][$layout]['values']['cells'][$index]['subtitle'] = $subtitle_value;
        }
      }
    }

    // Save all overrides at once.
    if (!empty($override_data)) {
      foreach ($override_data as $key => $value) {
        $hi_override->set($key, $value);
      }
      $hi_override->save();
      $this->messenger()->addStatus($this->t('Hindi translations for the Orgchart have been saved successfully.'));
    }
    else {
      $this->messenger()->addWarning($this->t('No Hindi translations were provided.'));
    }

    // Redirect back to the orgchart edit page.
    $form_state->setRedirectUrl(\Drupal\Core\Url::fromRoute('orgchart.configuration.chart.edit', ['id' => $chart_id]));
  }

}
