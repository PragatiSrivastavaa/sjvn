<?php

namespace Drupal\sjvn_custom\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\node\NodeInterface;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Drupal\Core\Url;

/**
 * Provides a controller to serve LOA files with access control and login redirect.
 */
class TenderAwardLoaController extends ControllerBase {

  /**
   * Downloads the LOA file or redirects to login.
   *
   * @param \Drupal\node\NodeInterface $node
   *   The tender award node.
   *
   * @return \Symfony\Component\HttpFoundation\Response
   *   The response.
   */
  public function download(NodeInterface $node) {
    if ($node->getType() !== 'tender_award') {
      throw new NotFoundHttpException();
    }

    $account = $this->currentUser();

    // 1. If anonymous, redirect to login with destination.
    if ($account->isAnonymous()) {
      $loa_url = Url::fromRoute('sjvn_custom.tender_award_loa', ['node' => $node->id()])->toString();
      $login_url = Url::fromRoute('user.login', [], ['query' => ['destination' => $loa_url]])->toString();
      
      \Drupal::messenger()->addMessage($this->t('Please login to view the LOA document.'));
      return new RedirectResponse($login_url);
    }

    // 2. Check Permissions (matching back-end logic).
    $has_access = FALSE;

    // Staff check (Admins and Content Editors).
    if ($account->hasPermission('bypass node access') || 
        in_array('administrator', $account->getRoles()) || 
        in_array('content_editor', $account->getRoles())) {
      $has_access = TRUE;
    }

    // Specific role check.
    if (!$has_access && in_array('loa', $account->getRoles())) {
      $has_access = TRUE;
    }

    // Individual Vendor check.
    if (!$has_access && $node->hasField('field_tender_title') && !$node->get('field_tender_title')->isEmpty()) {
      $tender = $node->get('field_tender_title')->entity;
      if ($tender && $tender->hasField('field_vender_list')) {
        foreach ($tender->get('field_vender_list') as $item) {
          if ($item->target_id == $account->id()) {
            $has_access = TRUE;
            break;
          }
        }
      }
    }

    if (!$has_access) {
      throw new AccessDeniedHttpException($this->t('You do not have permission to view this LOA document.'));
    }

    // 3. Serve the file.
    if ($node->hasField('field_loa') && !$node->get('field_loa')->isEmpty()) {
      $file = $node->get('field_loa')->entity;
      if ($file) {
        $uri = $file->getFileUri();
        if (file_exists($uri)) {
          $response = new BinaryFileResponse($uri);
          $response->setContentDisposition(
            ResponseHeaderBag::DISPOSITION_INLINE,
            $file->getFilename()
          );
          // Set content type to PDF explicitly if it is one.
          if (str_ends_with(strtolower($file->getFilename()), '.pdf')) {
            $response->headers->set('Content-Type', 'application/pdf');
          }
          return $response;
        }
      }
    }

    throw new NotFoundHttpException($this->t('LOA document file not found on server.'));
  }

}
