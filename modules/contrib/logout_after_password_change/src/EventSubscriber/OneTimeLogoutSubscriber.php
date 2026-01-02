<?php
namespace Drupal\logout_after_password_change\EventSubscriber;

use Drupal\user\UserDataInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\RequestEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class OneTimeLogoutSubscriber implements EventSubscriberInterface
{
  /**
   * If the user is logged in by password reset, the user can visit just entity.user.edit_form
   */
  public function checkAccess(): void
  {
    $current_route = \Drupal::routeMatch();
    $route_name = $current_route->getRouteName();
    if($route_name === 'entity.user.edit_form') {
      return;
    }
    $uid = \Drupal::currentUser()->id();
    if($uid === 0) {
      return;
    }
    /** @var UserDataInterface $userData */
    $userData = \Drupal::service('user.data');
    if ($userData->get('logout_after_password_change', $uid,'is_password_reset')) {
      user_logout();
    }
  }

  /**
   * If the user is logged out by changing the password, the message is displayed
   */
  public function checkMessage(RequestEvent $event): void
  {
    $current_route = \Drupal::routeMatch();
    $route_name = $current_route->getRouteName();
    if($route_name == 'user.login') {
      \Drupal::service('page_cache_kill_switch')->trigger();
      if($event->getRequest()->query->get('logout') == 1 and $event->getRequest()->getMethod() == "GET") {
        \Drupal::messenger()->addMessage(t('Password was changed. Please login again.'));
      }
    }
  }

  public function checkAccessAndMessage(RequestEvent $event): void
  {
    $this->checkAccess();
    $this->checkMessage($event);
  }

  public static function getSubscribedEvents(): array
  {
    return [
      KernelEvents::REQUEST => ['checkAccessAndMessage', 28], // Must be higher than cache priority (27)
    ];
  }
}
