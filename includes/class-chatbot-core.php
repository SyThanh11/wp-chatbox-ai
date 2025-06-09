<?php
// includes/class-chatbot-core.php
class WPCB_Chatbot_Core {
    public static function enqueue_scripts() {
        // Enqueue main chatbot script
        wp_enqueue_script(
            'lgl-chatbot',
            WPCB_PLUGIN_URL . 'app/chatbot.js',
            ['wp-element', 'wp-components'], // Dependencies
            LGL_VERSION,
            true
        );

        // Localize script with LGL AI format data
        wp_localize_script('lgl-chatbot', 'lgl_settings', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce'    => wp_create_nonce('lgl_nonce'),
            'rest_url' => rest_url(),
            'site_url' => site_url(),
        ]);

        // Enqueue CSS
        wp_enqueue_style(
            'lgl-chatbot-style',
            WPCB_PLUGIN_URL . 'themes/chatgpt.css',
            [],
            LGL_VERSION
        );
    }
}
?>