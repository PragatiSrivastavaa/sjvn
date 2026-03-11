<?php

declare(strict_types=1);

namespace Drupal\flipbook\Entity\Controller;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityListBuilder;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\File\FileUrlGeneratorInterface;
use Drupal\Core\Render\Markup;
use Drupal\Core\Url;
use Drupal\file\Entity\File;
use Drupal\image\Entity\ImageStyle;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a list controller for the Flipbook entity.
 *
 * @ingroup flipbook
 */
class FlipbookListBuilder extends EntityListBuilder {

  /**
   * The file URL generator service.
   *
   * @var \Drupal\Core\File\FileUrlGeneratorInterface
   */
  protected FileUrlGeneratorInterface $fileUrlGenerator;

  /**
   * {@inheritdoc}
   */
  public static function createInstance(ContainerInterface $container, EntityTypeInterface $entity_type): static {
    return new static(
      $entity_type,
      $container->get('entity_type.manager')->getStorage($entity_type->id()),
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
   * @param \Drupal\Core\File\FileUrlGeneratorInterface $file_url_generator
   *   The file URL generator service.
   */
  public function __construct(EntityTypeInterface $entity_type, EntityStorageInterface $storage, FileUrlGeneratorInterface $file_url_generator) {
    parent::__construct($entity_type, $storage);
    $this->fileUrlGenerator = $file_url_generator;
  }

  /**
   * {@inheritdoc}
   */
  public function render(): array {
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
   */
  public function buildHeader(): array {
    $header['id'] = $this->t('FlipbookID');
    $header['name'] = $this->t('Name');
    $header['flipbook_cover'] = $this->t('FlipBook Cover');
    $header['flipbook'] = $this->t('Flipbook Pdf');
    return $header + parent::buildHeader();
  }

  /**
   * {@inheritdoc}
   */
  public function buildRow(EntityInterface $entity): array {
    /** @var \Drupal\flipbook\Entity\Flipbook $entity */
    $row['id'] = $entity->id();
    $row['name'] = $entity->toLink()->toString();

    $fid = $entity->get('flipbook_cover')->target_id;
    $pid = $entity->get('flipbook')->target_id;

    $row['flipbook_cover'] = '';
    if ($fid) {
      $file = File::load($fid);
      if ($file) {
        $image_style = ImageStyle::load('large');
        if ($image_style) {
          $url = $image_style->buildUrl($file->getFileUri());
          $row['flipbook_cover'] = Markup::create('<a href="' . $url . '" target="_blank">' . $file->getFilename() . '</a>');
        }
      }
    }

    $row['flipbook'] = '';
    if ($pid) {
      $pfile = File::load($pid);
      if ($pfile) {
        $pdfpath = $this->fileUrlGenerator->generateAbsoluteString($pfile->getFileUri());
        $row['flipbook'] = Markup::create('<a href="' . $pdfpath . '" target="_blank">' . $pfile->getFilename() . '</a>');
      }
    }

    return $row + parent::buildRow($entity);
  }

}
