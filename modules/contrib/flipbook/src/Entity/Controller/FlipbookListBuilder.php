<?php

namespace Drupal\flipbook\Entity\Controller;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityListBuilder;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Render\Markup;
use Drupal\Core\Routing\UrlGeneratorInterface;
use Drupal\Core\File\FileUrlGeneratorInterface;
use Drupal\file\Entity\File;
use Drupal\image\Entity\ImageStyle;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Url;

/**
 * Provides a list controller for content_entity_example_contact entity.
 *
 * @ingroup content_entity_example
 */
class FlipbookListBuilder extends EntityListBuilder {

  /**
   * The URL generator service.
   *
   * @var \Drupal\Core\Routing\UrlGeneratorInterface
   */
  protected $urlGenerator;

  /**
   * The file URL generator service.
   *
   * @var \Drupal\Core\File\FileUrlGeneratorInterface
   */
  protected $fileUrlGenerator;


  /**
   * The redirect destination.
   *
   * @var \Drupal\Core\Routing\RedirectDestinationInterface
   */
  protected $redirectDestination;

  /**
   * {@inheritdoc}
   */
  public static function createInstance(ContainerInterface $container, EntityTypeInterface $entity_type) {
    return new static(
      $entity_type,
      $container->get('entity_type.manager')->getStorage($entity_type->id()),
      $container->get('url_generator'),
      $container->get('file_url_generator')
    );
  }

  /**
   * Constructs a new FlipbookListBuilder object.
   *
   * @param \Drupal\Core\Entity\EntityTypeInterface $entity_type
   *   The entity type definition.
   * @param \Drupal\Core\Entity\EntityStorageInterface $storage
   *   The entity storage class.
   * @param \Drupal\Core\Routing\UrlGeneratorInterface $url_generator
   *   The URL generator service.
   * @param \Drupal\Core\File\FileUrlGeneratorInterface $file_url_generator
   *   The file URL generator service.
   */
  public function __construct(EntityTypeInterface $entity_type, EntityStorageInterface $storage, UrlGeneratorInterface $url_generator, FileUrlGeneratorInterface $file_url_generator) {
    parent::__construct($entity_type, $storage);
    $this->urlGenerator = $url_generator;
    $this->fileUrlGenerator = $file_url_generator;
  }

    /**
     * {@inheritdoc}
     *
     * We override ::render() so that we can add our own content above the table.
     * parent::render() is where EntityListBuilder creates the table using our
     * buildHeader() and buildRow() implementations.
     */
    public function render() {
        $build['description'] = [
          '#markup' => $this->t('Flipbook Entity Example implements a Flipbooks model. These flipbooks are fieldable entities. You can manage the fields on the <a href=":adminlink">Flipbook admin page</a>.', [
            ':adminlink' => Url::fromRoute('flipbook.settings')->toString(),
          ]),
        ];
    
        $build += parent::render();
        return $build;
    }

    /**
     * {@inheritdoc}
     *
     * Building the header and content lines for the flipbook list.
     *
     * Calling the parent::buildHeader() adds a column for the possible actions
     * and inserts the 'edit' and 'delete' links as defined for the entity type.
     */
    public function buildHeader() {
        $header['id'] = $this->t('FlipbookID');
        $header['name'] = $this->t('Name');
        $header['flipbook_cover'] = $this->t('FlipBook Cover');
        $header['flipbook'] = $this->t('Flipbook Pdf');
        return $header + parent::buildHeader();
    }

  /**
   * {@inheritdoc}
   */
  public function buildRow(EntityInterface $entity) {
    $row['id'] = $entity->id();
    $row['name'] = $entity->toLink()->toString();

    $fid = $entity->get('flipbook_cover')->target_id;
    $pid = $entity->get('flipbook')->target_id;

    if ($fid) {
      $file = File::load($fid);
      if ($file) {
        $url = ImageStyle::load('large')->buildUrl($file->getFileUri());
        $row['flipbook_cover'] = Markup::create('<a href="' . $url . '" target="_blank">' . $file->getFilename() . '</a>');
      }
    }

    if ($pid) {
      $pfile = File::load($pid);
      if ($pfile) {
        $pdfpath = (\Drupal::hasService('file_url_generator')) ? $this->fileUrlGenerator->generateAbsoluteString($pfile->getFileUri()) : file_url_transform_relative(($pfile->getFileUri()));
        $row['flipbook'] = Markup::create('<a href="' . $pdfpath . '" target="_blank">' . $pfile->getFilename() . '</a>');
      }
    }

    return $row + parent::buildRow($entity);
  }

}