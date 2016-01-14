(function( exports, $, translations ) {
	'use strict';

	function Email_Notifications( translations ) {
		this.translations = translations;

		this.selectors = {
			notifications: '#form-email-notifications .notifications',
			notifications_counter: '#form-email-notifications .notifications  > div',
			add_notification_button: '#form_add_email_notification',
			delete_notification_button: '.form-delete-email-notification',
			delete_notification_dialog: '#delete_email_notification_dialog',
			nothing_found_sub: '.no-entry-found'
		};
	}

	Email_Notifications.prototype = {
		init: function() {
			this.init_notifications();

			var self = this;

			var email_notification_id;
			var delete_notification_dialog = $( this.selectors.delete_notification_dialog );

			delete_notification_dialog.dialog({
				'dialogClass'	: 'wp-dialog',
				'modal'			: true,
				'autoOpen'		: false,
				'closeOnEscape'	: true,
				'minHeight'		: 80,
				'buttons'		: [
					{
						text: this.translations.yes,
						click: function() {
							$( '.notification-' + email_notification_id ).remove();
							$( '.notification-' + email_notification_id + '-content' ).remove();

							self.refresh_nothing_found();

							$( this ).dialog('close');
						}
					},
					{
						text: this.translations.no,
						click: function() {
							$( this ).dialog( 'close' );
						}
					},
				],
			});

			$( document ).on( 'click', this.selectors.add_notification_button, function( e ) {
				var data = {
					action: 'get_email_notification_html',
				};

				$.post( ajaxurl, data, function( response ) {
					response = jQuery.parseJSON( response );

					$( self.selectors.notifications ).prepend( response.html );

					self.init_notifications();

					$( '.notification-' + response.id ).hide().fadeIn( 2500 );
				});
			});

			$( document ).on( 'click', this.selectors.delete_notification_button, function( e ){
				email_notification_id = $( this ).attr( 'data-emailnotificationid' );

				e.preventDefault();

				delete_notification_dialog.dialog( 'open' );
			});
		},

		init_notifications: function() {
			var notifications_list = $( this.selectors.notifications );

			if ( notifications_list.hasClass( 'ui-accordion' ) ) {
				notifications_list.accordion( 'destroy' );
			}

			this.refresh_nothing_found();

			notifications_list.accordion({
				collapsible: true,
				active: false,
				header: 'h4',
				heightStyle: 'content'
            });

			exports.handle_templatetag_buttons();
		},

		refresh_nothing_found: function() {
			if ( 0 === $( this.selectors.notifications_counter ).length ) {
				$( this.selectors.notifications ).find( this.selectors.nothing_found_sub ).show();
			} else {
				$( this.selectors.notifications ).find( this.selectors.nothing_found_sub ).hide();
			}
		}
	};

	var email_notifications = new Email_Notifications( translations );

	$( document ).ready( function() {
		email_notifications.init();
	});

	exports.add_extension( 'email_notifications', email_notifications );
}( form_builder, jQuery, translation_email_notifications ) );