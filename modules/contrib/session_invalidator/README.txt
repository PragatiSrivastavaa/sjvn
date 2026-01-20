# Session Invalidator

The Session Invalidator module for Drupal enhances site security by invalidating all active sessions for users upon password change. This step ensures that any potentially compromised sessions are terminated, requiring re-authentication with the new password.

## Features

- **Automatic Session Invalidity**: Immediately upon password update, all active sessions for the user are invalidated.
- **Forced Re-authentication**: Users must re-login with new credentials, ensuring session integrity.
- **User-Friendly Notifications**: Users are notified of session invalidation and prompted to log in again.

## Installation

To install the Session Invalidator module:

1. Download the module from the Drupal project page.
2. Place it under your `modules` directory for your Drupal installation (`/modules/custom/session_invalidator`).
3. Enable the module via the Drupal administration panel or Drush with the command `drush en session_invalidator`.

## Configuration

There is no additional configuration necessary after installation. The module works out-of-the-box by hooking into the user password change process.

## Usage

Once installed, the module will automatically invalidate all sessions whenever a user changes their password. A message will be displayed to the user informing them of the session invalidation and prompting them to log back in.

## Dependencies

This module does not depend on any non-core modules. It is designed to work with Drupal 8 and above.

## Maintainers

Current maintainers:
- [Vinod Kannan](https://www.drupal.org/u/vinod-kannan)

## Support

If you encounter any issues with this module, please report them in the issue queue on Drupal.org. Community contributions to both code and documentation are welcome!
