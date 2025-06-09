<?php
// includes/ajax/process-chat.php
class WPCB_Process_Chat {
    public static function handle() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'lgl_nonce')) {
            wp_send_json_error(['message' => 'Security check failed']);
        }

        $prompt = sanitize_textarea_field($_POST['prompt']);
        $system_config = json_decode(stripslashes($_POST['system']), true);
        
        if (empty($prompt)) {
            wp_send_json_error(['message' => 'Prompt is required']);
        }

        try {
            // Mock response for now - in a real implementation, you would use an AI API
            $mock_response = "This is a mock response from the LGL AI chatbot. You asked: " . $prompt;
            
            // Return format for LGL AI
            wp_send_json_success([
                'reply' => $mock_response,
                'usage' => null,
                'model' => $system_config['model'] ?? 'gpt-3.5-turbo',
                'env_id' => $system_config['env_id'] ?? ''
            ]);

        } catch (Exception $e) {
            error_log('WPCB Chat Error: ' . $e->getMessage());
            wp_send_json_error([
                'message' => 'Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại.'
            ]);
        }
    }
}
?>