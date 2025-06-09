<?php
/**
 * Plugin Name: WP Chatbot AI
 * Plugin URI:
 * Description: Plugin chatbot AI cho WordPress.
 * Version: 1.0
 * Author: LGL-AI
 * Author URI: https://lgl-ai.com
 * Text Domain: wp-chatbot-ai
 */

defined('ABSPATH') || exit;

// Định nghĩa hằng số plugin
define('LGL_VERSION', '1.0.0');
define('LGL_PREFIX', 'lgl');
define('LGL_CHATBOT_DOMAIN', 'wp-chatbot-ai');
define('WPCB_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('WPCB_PLUGIN_URL', plugin_dir_url(__FILE__));

// Load class loader
require_once WPCB_PLUGIN_DIR . 'includes/class-loader.php';

// Khởi tạo plugin sau khi WordPress đã load xong
add_action('plugins_loaded', function (): void {
    if (class_exists('WPCB_Loader')) {
        WPCB_Loader::init();
    }
});
