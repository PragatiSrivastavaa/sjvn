<?php

namespace Drupal\sjvn_custom\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Url;
use Drupal\Core\Link;

/**
 * Controller for DOP Typo tracking folder.
 */
class DopTyposController extends ControllerBase {

  /**
   * Displays a list of all DOP revisions marked as "Minor Typo Correction".
   */
  public function listTypos() {
    $database = \Drupal::database();
    
    // Query the node_revision table to find all revisions where the log matches our typo message
    // and the bundle is DOP. Since bundle isn't in node_revision, we join with node_field_data.
    $query = $database->select('node_revision', 'nr');
    $query->join('node_field_data', 'n', 'nr.nid = n.nid');
    $query->join('users_field_data', 'u', 'nr.revision_uid = u.uid');
    
    $query->fields('nr', ['nid', 'vid', 'revision_timestamp', 'revision_log']);
    $query->fields('n', ['title']);
    $query->fields('u', ['name']);
    
    $query->condition('n.type', 'dop');
    $query->condition('nr.revision_log', 'Minor Typo Correction', '=');
    $query->orderBy('nr.revision_timestamp', 'DESC');
    
    $results = $query->execute()->fetchAll();
    
    $header = [
      $this->t('DOP Clause'),
      $this->t('Corrected By'),
      $this->t('Date of Correction'),
      $this->t('Action'),
    ];
    
    $rows = [];
    foreach ($results as $row) {
      // Create a link to view the specific revision.
      $url = Url::fromRoute('entity.node.revision', ['node' => $row->nid, 'node_revision' => $row->vid]);
      
      $rows[] = [
        $row->title,
        $row->name,
        \Drupal::service('date.formatter')->format($row->revision_timestamp, 'short'),
        Link::fromTextAndUrl($this->t('View Correction'), $url)->toString(),
      ];
    }
    
    if (empty($rows)) {
      return [
        '#markup' => $this->t('No typo corrections have been logged yet.'),
      ];
    }
    
    $build['table'] = [
      '#type' => 'table',
      '#header' => $header,
      '#rows' => $rows,
      '#empty' => $this->t('No typo corrections found.'),
    ];
    
    return $build;
  }

}
