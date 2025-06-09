<?php
// includes/class-shortcode.php
class WPCB_Shortcode {
    public static function render_chatbox($atts = []) {
        // Parse shortcode attributes
        $atts = shortcode_atts([
            'title' => 'AI Chatbot',
            'placeholder' => 'Nhập câu hỏi của bạn...',
            'theme' => 'chatgpt',
            'model' => 'gpt-3.5-turbo',
            'max_tokens' => 150,
            'mode' => 'window', // window hoặc fullscreen
            'welcome_message' => 'Xin chào! Tôi có thể giúp gì cho bạn?',
            'send_text' => 'Gửi',
            'env_id' => ''
        ], $atts, 'wp_chatbot_ai');
        
        // System configuration (LGL AI format)
        $system = [
            'model' => $atts['model'],
            'max_tokens' => intval($atts['max_tokens']),
            'temperature' => 0.7,
            'instructions' => 'You are a helpful assistant.',
            'env_id' => $atts['env_id']
        ];
        
        // UI Parameters (LGL AI format)
        $params = [
            'title' => $atts['title'],
            'text_input_placeholder' => $atts['placeholder'],
            'text_send' => $atts['send_text'],
            'welcome_message' => $atts['welcome_message'],
            'mode' => $atts['mode']
        ];
        
        // Theme configuration
        $theme = [
            'name' => $atts['theme'],
            'primary_color' => '#0073aa',
            'secondary_color' => '#f1f1f1',
            'text_color' => '#333333'
        ];
        
        // Generate unique ID
        $chatbot_id = 'lgl-chatbot-' . uniqid();
        
        // Encode data for the LGL AI format
        $encoded_system = htmlentities(json_encode($system), ENT_QUOTES, 'UTF-8');
        $encoded_params = htmlentities(json_encode($params), ENT_QUOTES, 'UTF-8');
        $encoded_theme = htmlentities(json_encode($theme), ENT_QUOTES, 'UTF-8');
        
        // Return container with the correct class name
        return sprintf(
            '<div id="%s" class="lgl-chatbot-container" data-system="%s" data-params="%s" data-theme="%s"></div>',
            esc_attr($chatbot_id),
            $encoded_system,
            $encoded_params,
            $encoded_theme
        );
    }
}
?>