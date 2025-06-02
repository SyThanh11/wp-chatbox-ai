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

 // Định nghĩa các constant plugin
 define('LGL_VERSION', '1.0.0');
 define( 'LGL_PREFIX', 'lgl' );
 define( 'LGL_CHATBOT_DOMAIN', 'wp-chatbot-ai' );
 define( 'WPCB_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
 define( 'WPCB_PLUGIN_URL', plugin_dir_url( __FILE__ ) );

 require_once WPCB_PLUGIN_DIR . 'includes/class-loader.php';

 add_action('plugin_loaded', function(): void {
    WPCB_Loader::init();
 });
?>