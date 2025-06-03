<?php
class Engines_Core {
    protected $core = null; //đối tượng chính, thường là tham chiếu đến hệ thống plugin
    public $env = null; // môi trường hiện tại của AI
    public $envId = null; // thông tin chi tiết của $env
    public $envType = null; // thông tin chi tiết của $env

    // Streaming
    protected $streamCallback = null; // Hàm sẽ được gọi mỗi khi có phần dữ liệu stream về
    protected $streamTemporaryBuffer = ""; // lưu trữ tạm thời dữ liệu đang stream
    protected $streamBuffer = ""; // lưu trữ tạm thời dữ liệu đang stream
    protected $streamHeaders = []; // lưu các header nhận đượ
    protected $streamContent = ""; // nội dung đầy đủ đã stream xong

    public function __construct( $core, $env ) {
        $this->core = $core;
        $this->env = $env;
        $this->envId = isset( $env['id'] ) ? $env['id'] : null;
        $this->envType = isset( $env['type'] ) ? $env['type'] : null;
    }

    // Hàm chính để xử lý các truy vấn AI
    public function run( $query, $streamCallback = null, $maxDepth = 5 ): mixed {

      // Check if the query is allowed.
      $limits = $this->core->get_option( 'limits' );
      $allowed = apply_filters( 'ai_allowed', true, $query, $limits );
      if ( $allowed !== true ) {
        $message = is_string( $allowed ) ? $allowed : 'Unauthorized query.';
        throw new Exception( $message );
      }

      // Important as it makes sure everything is consolidated in the query and the engine.
      $this->final_checks( $query );

      // Run the query
      $reply = null;
      if ( $query instanceof Query_Text || $query instanceof Query_Feedback ) {
        $reply = $this->run_completion_query( $query, $streamCallback );
      }
      else if ( $query instanceof Query_Assistant || $query instanceof Query_AssistFeedback ) {
        $reply = $this->run_assistant_query( $query, $streamCallback );
        if ( $reply === null ) {
          throw new Exception( 'Assistants are not supported in this version of AI Engine.' );
        }
      }
      else if ( $query instanceof Query_Embed ) {
        $reply = $this->run_embedding_query( $query );
      }
      else if ( $query instanceof Query_EditImage ) {
        $reply = $this->run_editimage_query( $query );
      }
      else if ( $query instanceof Query_Image ) {
        $reply = $this->run_image_query( $query );
      }
      else if ( $query instanceof Query_Transcribe ) {
        $reply = $this->run_transcribe_query( $query );
      }
      else {
        throw new Exception( 'Unknown query type.' );
      }

      // Allow to modify the reply before it is sent.
      $reply = apply_filters( 'mwai_ai_reply', $reply, $query );

      // Function Call
      if ( !empty( $reply->needFeedbacks ) ) {

        // Check if we reached the maximum depth
        if ( $maxDepth <= 0 ) {
          throw new Exception( 'AI Engine: There seems to be a loop in the function/tools calls.' );
        }

        // We should use a feedback query around the original query
        if ( !( $query instanceof Meow_MWAI_Query_AssistFeedback) && !( $query instanceof Meow_MWAI_Query_Feedback ) ) {
          $queryClass = $query instanceof Meow_MWAI_Query_Assistant ?
            Meow_MWAI_Query_AssistFeedback::class : Meow_MWAI_Query_Feedback::class;
          $query = new $queryClass( $reply, $reply->query );
        }

        // The engine for the model will handle the feedback query nicely
        // In the case of Anthropic, it's like a "discussion" between the user (= WordPress's AI Engine
        // and the model (= Anthropic). The feedback is a way to communicate between the two.
        $feedback_blocks = [];
        foreach ( $reply->needFeedbacks as $needFeedback ) {
          $rawMessageKey = md5( serialize( $needFeedback['rawMessage'] ) );

          // Initialize the feedback block for this rawMessage if it hasn't been initialized yet
          if ( !isset( $feedback_blocks[$rawMessageKey] ) ) {
            $feedback_blocks[$rawMessageKey] = [ 
              'rawMessage' => $needFeedback['rawMessage'],
              'feedbacks' => []
            ];
          }

          // Get the value related to this feedback (usually, a function call)
          $value = apply_filters( 'mwai_ai_feedback', null, $needFeedback, $reply );

          if ( $value === null ) {
            Meow_MWAI_Logging::warn( "The returned value for '{$needFeedback['name']}' was null." );
            $value = "[NO VALUE RETURNED - DO NOT SHOW THIS]";
          }

          // Add the feedback information to the appropriate feedback block
          $feedback_blocks[$rawMessageKey]['feedbacks'][] = [ 
            'request' => $needFeedback, // TODO: Meow_MWAI_Feedback_Request
            'reply' => [ 'value' => $value ] // TODO: Meow_MWAI_Feedback_Reply
          ];
        }

        $query->clear_feedback_blocks();
        foreach ( $feedback_blocks as $feedback_block ) {
          $query->add_feedback_block( $feedback_block );
        }

        // Run the feedback query
        $reply = $this->run( $query, $streamCallback, $maxDepth - 1 );
      } 

    return $reply;
    }
}

?>