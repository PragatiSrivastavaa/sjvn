<?php
use Drupal\Core\DrupalKernel;
use Symfony\Component\HttpFoundation\Request;
$autoloader = require_once 'autoload.php';
$kernel = new DrupalKernel('prod', $autoloader);
$request = Request::createFromGlobals();
$kernel->boot();
$kernel->preHandle($request);

$fields = \Drupal::service('entity_field.manager')->getFieldDefinitions('node', 'dop');
$output = [];
foreach ($fields as $name => $field) {
  if (!$field->getFieldStorageDefinition()->isBaseField()) {
    $output[$name] = $field->getType();
  }
}
file_put_contents('dop_fields.txt', print_r($output, TRUE));
