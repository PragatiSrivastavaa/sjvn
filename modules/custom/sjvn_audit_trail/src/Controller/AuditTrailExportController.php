<?php

namespace Drupal\sjvn_audit_trail\Controller;

use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Controller for exporting Audit Trail Reports to Excel and PDF formats.
 */
class AuditTrailExportController extends ControllerBase {

  /**
   * Helper function to build filtered database query.
   */
  protected function getFilteredQuery(Request $request) {
    $query = \Drupal::database()->select('sjvn_audit_trail', 'a')
      ->fields('a');

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

    $query->orderBy('a.timestamp', 'DESC');
    return $query;
  }

  /**
   * Export audit trail report to Excel (CSV format).
   */
  public function exportExcel(Request $request) {
    $results = $this->getFilteredQuery($request)->execute()->fetchAll();

    $filename = 'sjvn_audit_trail_' . date('Y-m-d_H-i-s') . '.csv';

    $handle = fopen('php://temp', 'w+');
    // Write UTF-8 BOM for Excel compatibility
    fputs($handle, "\xEF\xBB\xBF");

    // CSV Header
    fputcsv($handle, ['Date & Time', 'User', 'IP Address', 'Module / Area', 'Action Type', 'Status', 'Description']);

    foreach ($results as $row) {
      fputcsv($handle, [
        date('d/m/Y H:i:s', $row->timestamp),
        $row->user_name,
        $row->user_ip,
        $row->module,
        $row->action_type,
        $row->status,
        $row->description,
      ]);
    }

    rewind($handle);
    $csv_content = stream_get_contents($handle);
    fclose($handle);

    $response = new Response($csv_content);
    $response->headers->set('Content-Type', 'text/csv; charset=utf-8');
    $response->headers->set('Content-Disposition', 'attachment; filename="' . $filename . '"');

    return $response;
  }

  /**
   * Export audit trail report to printable PDF / Compliance View.
   */
  public function exportPdf(Request $request) {
    $results = $this->getFilteredQuery($request)->execute()->fetchAll();

    $date_from = $request->query->get('date_from', 'All');
    $date_to = $request->query->get('date_to', 'All');
    $user_name = $request->query->get('user_name', 'All');
    $module = $request->query->get('module', 'All');
    $action_type = $request->query->get('action_type', 'All');

    $html = '<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SJVN Audit Trail Report</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; color: #333; margin: 20px; }
    .header { text-align: center; border-bottom: 2px solid #003366; padding-bottom: 10px; margin-bottom: 20px; }
    .header h1 { margin: 0; color: #003366; font-size: 20px; }
    .header p { margin: 5px 0 0 0; color: #666; font-size: 13px; }
    .filters-summary { background: #f5f5f5; padding: 10px; border-radius: 5px; margin-bottom: 20px; font-size: 11px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { background: #003366; color: #fff; text-align: left; padding: 8px; font-size: 11px; }
    td { border-bottom: 1px solid #ddd; padding: 8px; font-size: 11px; word-break: break-word; }
    tr:nth-child(even) { background-color: #f9f9f9; }
    .footer { text-align: center; font-size: 10px; color: #777; margin-top: 30px; border-top: 1px solid #ccc; padding-top: 10px; }
    @media print {
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 15px; text-align: right;">
    <button onclick="window.print();" style="padding: 8px 16px; background: #003366; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">🖨️ Print / Save as PDF</button>
  </div>
  
  <div class="header">
    <h1>SJVN LIMITED - AUDIT TRAIL REPORT</h1>
    <p>Official Compliance & Administrative Event Tracking Log</p>
  </div>

  <div class="filters-summary">
    <strong>Report Generated On:</strong> ' . date('d/m/Y H:i:s') . ' | 
    <strong>Date Range:</strong> ' . htmlspecialchars($date_from) . ' to ' . htmlspecialchars($date_to) . ' | 
    <strong>User:</strong> ' . htmlspecialchars($user_name) . ' | 
    <strong>Module:</strong> ' . htmlspecialchars($module) . ' | 
    <strong>Action:</strong> ' . htmlspecialchars($action_type) . '
  </div>

  <table>
    <thead>
      <tr>
        <th>Date & Time</th>
        <th>User</th>
        <th>IP Address</th>
        <th>Module</th>
        <th>Action Type</th>
        <th>Status</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>';

    if (empty($results)) {
      $html .= '<tr><td colspan="7" style="text-align:center;">No audit records found matching the active filter criteria.</td></tr>';
    }
    else {
      foreach ($results as $row) {
        $html .= '<tr>
          <td>' . date('d/m/Y H:i:s', $row->timestamp) . '</td>
          <td>' . htmlspecialchars($row->user_name) . '</td>
          <td>' . htmlspecialchars($row->user_ip) . '</td>
          <td>' . htmlspecialchars($row->module) . '</td>
          <td>' . htmlspecialchars($row->action_type) . '</td>
          <td>' . htmlspecialchars($row->status) . '</td>
          <td>' . htmlspecialchars($row->description) . '</td>
        </tr>';
      }
    }

    $html .= '</tbody>
  </table>

  <div class="footer">
    SJVN Limited Internal Audit & Compliance System | Confidentially Generated Document
  </div>
</body>
</html>';

    return new Response($html, 200, ['Content-Type' => 'text/html; charset=utf-8']);
  }

}
