<?php
// includes/class-loader.php
class WPCB_Loader {
    protected static $instance = null;

    public static function init(): WPCB_Loader {
        if ( null === self::$instance ) {
            self::$instance = new self();
            self::$instance->includes();
            self::$instance->hooks();
        }
        return self::$instance;
    }

    private function includes(): void {
        require_once WPCB_PLUGIN_DIR . 'includes/class-ai-engine.php';
        require_once WPCB_PLUGIN_DIR . 'includes/class-api-handler.php';
        require_once WPCB_PLUGIN_DIR . 'includes/class-chatbot-core.php';
        require_once WPCB_PLUGIN_DIR . 'includes/class-database.php';
        require_once WPCB_PLUGIN_DIR . 'includes/class-exception-handler.php';
        require_once WPCB_PLUGIN_DIR . 'includes/class-shortcode.php';
        require_once WPCB_PLUGIN_DIR . 'admin/class-admin.php';
        require_once WPCB_PLUGIN_DIR . 'includes/ajax/process-chat.php';
    }

    private function hooks(): void {
        // Admin
        add_action('admin_menu', ['WPCB_Admin', 'register_menu']);
        
        // Frontend
        add_action('wp_enqueue_scripts', ['WPCB_Chatbot_Core', 'enqueue_scripts']);

        // Shortcode
        add_shortcode('wp_chatbot_ai', ['WPCB_Shortcode', 'render_chatbox']);

        // AJAX handlers with lgl prefix
        add_action('wp_ajax_lgl_stream_prompt', ['WPCB_Process_Chat', 'handle']);
        add_action('wp_ajax_nopriv_lgl_stream_prompt', ['WPCB_Process_Chat', 'handle']);
        
        // Keep backward compatibility with old action names
        add_action('wp_ajax_mwai_stream_prompt', ['WPCB_Process_Chat', 'handle']);
        add_action('wp_ajax_nopriv_mwai_stream_prompt', ['WPCB_Process_Chat', 'handle']);
        
        // Backup action with plugin-specific name
        add_action('wp_ajax_wpcb_process_chat', ['WPCB_Process_Chat', 'handle']);
        add_action('wp_ajax_nopriv_wpcb_process_chat', ['WPCB_Process_Chat', 'handle']);
    }
}
?>