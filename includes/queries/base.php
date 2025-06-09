<?php
    // class Query_Base implements JsonSerializable {
    //      // Environment
    //     public ?string $session = null;
    //     public ?string $chatId = null;
    //     public string $scope = '';
    //     private $core = null;

    //     // Core Content
    //     public ?string $instructions = null; // hướng dẫn hệ thống (tương tự "system prompt").
    //     public array $messages = []; // lịch sử cuộc hội thoại.
    //     public ?string $context = null; // bối cảnh bổ sung.
    //     public string $message = ''; // tin nhắn hiện tại từ người dùng.

    //     // Parameters
    //     public int $maxMessages = 15;
    //     public int $maxResults = 1;
    //     public ?string $model = null;
    //     public string $feature = 'completion';

    //     // Functions
    //     public array $functions = [];
    //     public ?string $functionCall = null;

    //     // Overrides for env
    //     public array $envSettings = [];
    //     public string $envId = '';
    //     public ?string $apiKey = null;

    //     // Seem to be only used by the Assistants, to get the current thread/discussion.
    //     // Maybe we should try to move this to the assistant class, or use it as ExtraParams.
    //     public ?string $botId = null;  

    //     // Extra Parameters (used by specific services, or for statistics, etc)
    //     public array $extraParams = [];

    //     // Options
    //     // Engine will either upload or share an URL to the image, for Vision, for example.
    //     // Having this here allows other services to override it if needed (Ollama needs it false).
    //     public ?string $image_remote_upload = null;

    //     #region Constructors, Serialization
    // }
?>