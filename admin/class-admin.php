<?php
    // Trong class WPCB_Admin (admin/class-admin.php)
class WPCB_Admin {
    public static function init() {
        add_action('admin_menu', [self::class, 'register_menu']);
    }

    public static function register_menu() {
        add_menu_page(
            __('WP Chatbot AI', 'wp-chatbot-ai'), // Page title
            __('Chatbot AI', 'wp-chatbot-ai'),    // Menu title
            'manage_options',                      // Capability
            'wpcb-chatbot-ai',                     // Menu slug
            [self::class, 'settings_page'],       // Callback function
            'dashicons-format-chat',               // Icon
            56                                    // Position
        );
    }

    public static function settings_page() {
        echo '<div class="wrap"><h1>WP Chatbot AI Settings</h1>';
        echo '<p>Đây là trang cài đặt plugin.</p></div>';
    }
}
?>