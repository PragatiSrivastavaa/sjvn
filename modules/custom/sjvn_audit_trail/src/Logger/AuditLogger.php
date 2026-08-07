<?php

namespace Drupal\sjvn_audit_trail\Logger;

use Psr\Log\AbstractLogger;
use Drupal\Core\Logger\RfcLogLevel;

/**
 * Logger service to capture system Warnings, Errors, and Security Failures.
 */
class AuditLogger extends AbstractLogger {

  /**
   * {@inheritdoc}
   */
  public function log($level, $message, array $context = []): void {
    // Convert string level if needed
    if (is_string($level)) {
      $map = [
        'emergency' => RfcLogLevel::EMERGENCY,
        'alert' => RfcLogLevel::ALERT,
        'critical' => RfcLogLevel::CRITICAL,
        'error' => RfcLogLevel::ERROR,
        'warning' => RfcLogLevel::WARNING,
        'notice' => RfcLogLevel::NOTICE,
        'info' => RfcLogLevel::INFO,
        'debug' => RfcLogLevel::DEBUG,
      ];
      $rfc_level = $map[$level] ?? RfcLogLevel::INFO;
    }
    else {
      $rfc_level = $level;
    }

    // Only capture Warnings, Errors, Critical, Alert, Emergency
    if (!in_array($rfc_level, [
      RfcLogLevel::WARNING,
      RfcLogLevel::ERROR,
      RfcLogLevel::CRITICAL,
      RfcLogLevel::ALERT,
      RfcLogLevel::EMERGENCY,
    ])) {
      return;
    }

    // Prevent recursive logging
    static $logging_in_progress = FALSE;
    if ($logging_in_progress) {
      return;
    }
    $logging_in_progress = TRUE;

    $channel = $context['channel'] ?? 'System';
    $status = ($rfc_level == RfcLogLevel::WARNING) ? 'Warning' : 'Failure';

    // Format log message
    $formatted_message = is_string($message) ? $message : print_r($message, TRUE);
    if (!empty($context)) {
      $variables = [];
      foreach ($context as $key => $val) {
        if (strpos($key, '%') === 0 || strpos($key, '@') === 0 || strpos($key, '!') === 0) {
          $variables[$key] = is_scalar($val) ? $val : print_r($val, TRUE);
        }
      }
      if (!empty($variables)) {
        $formatted_message = strtr($formatted_message, $variables);
      }
    }

    // Determine module/area
    $module_area = 'System';
    if (in_array($channel, ['user', 'security'])) {
      $module_area = 'User & Security';
    }
    elseif (in_array($channel, ['content', 'node'])) {
      $module_area = 'Content';
    }
    elseif (in_array($channel, ['webform', 'mail'])) {
      $module_area = 'Webform';
    }
    elseif (in_array($channel, ['php'])) {
      $module_area = 'PHP';
    }

    $action_type = ($status === 'Warning') ? 'Warning' : 'Error';
    if (stripos($formatted_message, 'Login') !== FALSE) {
      $action_type = 'Login';
      $module_area = 'User & Security';
    }

    // Call logging API
    if (function_exists('sjvn_audit_trail_log')) {
      sjvn_audit_trail_log($module_area, $action_type, $status, strip_tags($formatted_message));
    }

    $logging_in_progress = FALSE;
  }

}
