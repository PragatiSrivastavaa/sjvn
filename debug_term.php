<?php
$t = \Drupal\taxonomy\Entity\Term::load(414);
if ($t) {
  echo "VID: " . $t->bundle() . "\n";
  echo "Name: " . $t->label() . "\n";
} else {
  echo "Term not found\n";
}
