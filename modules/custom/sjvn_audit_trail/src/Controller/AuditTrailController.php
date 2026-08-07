<?php

namespace Drupal\sjvn_audit_trail\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Url;
use Symfony\Component\HttpFoundation\Request;

/**
 * Controller for rendering the Audit Trail Reports dashboard.
 */
class AuditTrailController extends ControllerBase {

  /**
   * Render the audit trail dashboard.
   */
  public function dashboard(Request $request) {
    $build = [];

    // Export Buttons Bar
    $query_params = $request->query->all();
    $excel_url = Url::fromRoute('sjvn_audit_trail.export_excel', [], ['query' => $query_params])->toString();
    $pdf_url = Url::fromRoute('sjvn_audit_trail.export_pdf', [], ['query' => $query_params])->toString();

    $build['export_bar'] = [
      '#type' => 'markup',
      '#markup' => '<div style="margin-bottom: 20px; text-align: right;">
        <a href="' . $excel_url . '" class="button button--action button--primary" style="background-color: #1d6f42; color: #fff; border: none; font-weight: bold; margin-right: 10px;">📊 Export to Excel (CSV)</a>
        <a href="' . $pdf_url . '" target="_blank" class="button button--action" style="background-color: #d32f2f; color: #fff; border: none; font-weight: bold;">📄 Export to PDF</a>
      </div>',
    ];

    // Build Filter Form
    $build['filter_form'] = \Drupal::formBuilder()->getForm('\Drupal\sjvn_audit_trail\Form\AuditTrailFilterForm');

    // Build Query with Filters
    $query = \Drupal::database()->select('sjvn_audit_trail', 'a')
      ->fields('a');

    // Apply Filters
    if ($date_from = $request->query->get('date_from')) {
      $query->condition('a.timestamp', strtotime($date_from . ' 00:00:00'), '>=');
    }
    if ($date_to = $request->query->get('date_to')) {
      $query->condition('a.timestamp', strtotime($date_to . ' 23:59:59'), '<=');
    }
    if ($user_name = $request->query->get('user_name')) {
      $query->condition('a.user_name', '%' . $request->query->get('user_name') . '%', 'LIKE');
    }
    if ($module = $request->query->get('module')) {
      $query->condition('a.module', $module);
    }
    if ($action_type = $request->query->get('action_type')) {
      $query->condition('a.action_type', $action_type);
    }
    if ($status = $request->query->get('status')) {
      $query->condition('a.status', $status);
    }

    // Add Pagination & Sorting
    $pager = $query->extend('Drupal\Core\Database\Query\PagerSelectExtender')->limit(25);
    $pager->orderBy('a.timestamp', 'DESC');
    $results = $pager->execute()->fetchAll();

    // Build Results Table
    $header = [
      'id' => $this->t('ID'),
      'timestamp' => $this->t('Date & Time'),
      'user_name' => $this->t('User'),
      'user_ip' => $this->t('IP Address'),
      'module' => $this->t('Module / Area'),
      'action_type' => $this->t('Action Type'),
      'status' => $this->t('Status'),
      'description' => $this->t('Description / Details'),
    ];

    $rows = [];
    foreach ($results as $row) {
      // Style Action Badge
      $action_color = '#0288d1';
      if (in_array($row->action_type, ['Create', 'Login'])) {
        $action_color = '#2e7d32';
      }
      elseif (in_array($row->action_type, ['Delete', 'Logout'])) {
        $action_color = '#c62828';
      }
      elseif ($row->action_type === 'Archive') {
        $action_color = '#ed6c02';
      }

      $action_badge = '<span style="background-color: ' . $action_color . '; color: #fff; padding: 3px 8px; border-radius: 4px; font-weight: bold; font-size: 11px;">' . htmlspecialchars($row->action_type) . '</span>';

      // Style Status Badge
      $status_color = ($row->status === 'Success') ? '#2e7d32' : (($row->status === 'Warning') ? '#ed6c02' : '#c62828');
      $status_badge = '<span style="color: ' . $status_color . '; font-weight: bold;">' . htmlspecialchars($row->status) . '</span>';

      $rows[] = [
        'id' => $row->id,
        'timestamp' => date('d/m/Y H:i:s', $row->timestamp),
        'user_name' => htmlspecialchars($row->user_name),
        'user_ip' => htmlspecialchars($row->user_ip),
        'module' => htmlspecialchars($row->module),
        'action_type' => ['data' => ['#markup' => $action_badge]],
        'status' => ['data' => ['#markup' => $status_badge]],
        'description' => htmlspecialchars($row->description),
      ];
    }

    $build['table'] = [
      '#type' => 'table',
      '#header' => $header,
      '#rows' => $rows,
      '#empty' => $this->t('No audit trail entries found matching your filter criteria.'),
      '#attributes' => ['class' => ['audit-trail-table', 'responsive-enabled']],
    ];

    $build['pager'] = [
      '#type' => 'pager',
    ];

    return $build;
  }

}
