(function ($, Drupal, drupalSettings) {
  'use strict';
  // This function is strict.
  Drupal.behaviors.password_encrypt = {
    attach: function (context, settings) {
      // Read the token from the obfuscated setting name. 
      // We check both the incoming 'settings' and the global 'drupalSettings'.
      var token = null;
      if (settings.password_encrypt_conf && settings.password_encrypt_conf._tok) {
        token = settings.password_encrypt_conf._tok;
      } else if (drupalSettings.password_encrypt_conf && drupalSettings.password_encrypt_conf._tok) {
        token = drupalSettings.password_encrypt_conf._tok;
      }

      // If we found a token, store it globally in the behavior so it persists across AJAX calls 
      // where the token might NOT be sent (for security).
      if (token) {
        this.token = token;
      }

      var passkey = this.token;
      if (!passkey) {
        return;
      }
      var cipher;
      var pass;
      var cpass;
      var current_pass;

      $('form.user-login, form.user-login-form', context).submit(function (event) {
        pass = $('#edit-pass').val();
        if (pass !== '') {
          cipher = CryptoJS.AES.encrypt(pass, passkey).toString();
          $('#edit-pass').val(cipher);
        }
      });

      $('form.user-register-form, form.user-form', context).submit(function (event) {
        current_pass = $('#edit-current-pass').val();
        pass = $('#edit-pass-pass1').val();
        cpass = $('#edit-pass-pass2').val();

        if (pass !== '' && pass !== cpass) {
          if ($('span.error').length === 0) {
            $('#edit-pass-pass2').after('<span class="error" style="color: red;">Password doesn\'t match. Please enter correct password.</span>');
          }
          $('#edit-pass-pass2').addClass('error').focus();
          event.preventDefault();
          return false;
        }

        if (current_pass && current_pass !== '') {
          cipher = CryptoJS.AES.encrypt(current_pass, passkey).toString();
          $('#edit-current-pass').val(cipher);
        }

        if (pass && pass !== '') {
          cipher = CryptoJS.AES.encrypt(pass, passkey).toString();
          $('#edit-pass-pass1').val(cipher);
          $('#edit-pass-pass2').val(cipher);
        }
      });
    }
  };
})(jQuery, Drupal, drupalSettings);
