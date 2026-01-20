<?php

namespace Drupal\session_invalidator\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\Core\Database\Connection;
use Drupal\Core\Messenger\MessengerInterface;
use Drupal\core_event_dispatcher\Event\Form\FormAlterEvent;
use Drupal\core_event_dispatcher\CoreEventDispatcherEvents;

class PasswordChangeListener implements EventSubscriberInterface {

  protected $currentUser;
  protected $database;
  protected $messenger;

  public function __construct(AccountProxyInterface $current_user, Connection $database, MessengerInterface $messenger) {
    $this->currentUser = $current_user;
    $this->database = $database;
    $this->messenger = $messenger;
  }

public static function getSubscribedEvents() {
    // Replace 'hook_event_dispatcher.form_alter' with the actual event name pattern provided by the contrib module you're using.
    $events['hook_event_dispatcher.form_alter'][] = ['onPasswordChange', 800];
    return $events;
}


  public function onPasswordChange(FormAlterEvent $event) {
    $form = $event->getForm();
    $form_state = $event->getFormState();

    if ($form['#form_id'] == 'user_form' && $form_state->isValueEmpty('pass') === FALSE) {
      // Invalidate all sessions for the user.
      $uid = $this->currentUser->id();
      $this->database->delete('sessions')
        ->condition('uid', $uid)
        ->execute();

      // Log out the current user session.
      user_logout();

      // Redirect to login page.
      $form_state->setRedirect('user.login');
      $this->messenger->addMessage('Your password has been changed. Please log in again.');
    }
  }
}
