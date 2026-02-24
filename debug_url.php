<?php
use Drupal\Core\Url;
try {
  $url = Url::fromRoute('sjvn_custom.tender_award_loa', ['node' => 1]);
  echo "String: " . $url->toString() . "\n";
  echo "Internal: " . $url->getInternalPath() . "\n";
} catch (\Exception $e) {
  echo "Error: " . $e->getMessage() . "\n";
}
