<?php

namespace Drupal\sjvn_audit_trail\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Url;

/**
 * Filter form for Audit Trail Reports dashboard.
 */
class AuditTrailFilterForm extends FormBase {

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'sjvn_audit_trail_filter_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
    $request = \Drupal::request();

    $form['#method'] = 'get';
    $form['#attributes'] = ['class' => ['form-inline', 'audit-trail-filter-form']];

    $form['date_from'] = [
      '#type' => 'date',
      '#title' => $this->t('From Date'),
      '#default_value' => $request->query->get('date_from', ''),
    ];

    $form['date_to'] = [
      '#type' => 'date',
      '#title' => $this->t('To Date'),
      '#default_value' => $request->query->get('date_to', ''),
    ];

    $form['user_name'] = [
      '#type' => 'textfield',
      '#title' => $this->t('User'),
      '#placeholder' => $this->t('Enter Username / Email'),
      '#size' => 20,
      '#default_value' => $request->query->get('user_name', ''),
    ];

    $form['module'] = [
      '#type' => 'select',
      '#title' => $this->t('Module / Area'),
      '#options' => [
        '' => $this->t('- All Modules -'),
        'Content' => $this->t('Content / Node'),
        'User & Security' => $this->t('User & Security'),
        'Taxonomy' => $this->t('Taxonomy'),
        'Webform' => $this->t('Webform / Feedback'),
        'System' => $this->t('System Config'),
      ],
      '#default_value' => $request->query->get('module', ''),
    ];

    $form['action_type'] = [
      '#type' => 'select',
      '#title' => $this->t('Action Type'),
      '#options' => [
        '' => $this->t('- All Actions -'),
        'Create' => $this->t('Create'),
        'Update' => $this->t('Update'),
        'Delete' => $this->t('Delete'),
        'Archive' => $this->t('Archive'),
        'Unarchive' => $this->t('Unarchive'),
        'Login' => $this->t('Login'),
        'Logout' => $this->t('Logout'),
        'Error / Warning' => $this->t('Error / Warning'),
      ],
      '#default_value' => $request->query->get('action_type', ''),
    ];

    $form['status'] = [
      '#type' => 'select',
      '#title' => $this->t('Status'),
      '#options' => [
        '' => $this->t('- All Statuses -'),
        'Success' => $this->t('Success'),
        'Warning' => $this->t('Warning'),
        'Failure' => $this->t('Failure'),
      ],
      '#default_value' => $request->query->get('status', ''),
    ];

    $form['actions'] = [
      '#type' => 'actions',
    ];

    $form['actions']['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Filter Reports'),
      '#attributes' => ['class' => ['button', 'button--primary']],
    ];

    $reset_url = Url::fromRoute('sjvn_audit_trail.dashboard')->toString();
    $form['actions']['reset'] = [
      '#type' => 'markup',
      '#markup' => '<a href="' . $reset_url . '" class="button" style="margin-left: 10px;">' . $this->t('Reset') . '</a>',
    ];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    // Form submits via GET method directly.
  }

}
