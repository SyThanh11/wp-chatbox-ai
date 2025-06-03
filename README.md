# WP Chatbot AI

**WP Chatbot AI** là một plugin WordPress tích hợp trí tuệ nhân tạo (AI) vào website, giúp tạo chatbot thông minh có thể trả lời người dùng, hỗ trợ khách hàng, hoặc trò chuyện tự nhiên thông qua các mô hình ngôn ngữ như OpenAI GPT.

---

## 🚀 Tính năng chính

- ✅ Chatbot AI thông minh, có thể tích hợp GPT-4, Claude hoặc các API khác
- ✅ Tương tác thời gian thực thông qua AJAX
- ✅ Trang cấu hình trong admin dễ sử dụng
- ✅ Ghi log lỗi riêng, dễ debug
- ✅ Tương thích với đa ngôn ngữ (i18n ready)

---

## 📁 Cấu trúc thư mục plugin

Plugin này được tổ chức theo cấu trúc rõ ràng, dễ bảo trì:

    wp-chatbot-ai/
    ├── wp-chatbot-ai.php # File chính: khởi tạo plugin, load các thành phần
    ├── uninstall.php # Xử lý logic khi plugin bị gỡ cài đặt
    │
    ├── includes/ # Logic xử lý chính (core, AI, API, database, shortcode)
    │ ├── class-loader.php
    │ ├── class-chatbot-core.php
    │ ├── class-ai-engine.php
    │ ├── class-api-handler.php
    │ ├── class-database.php
    │ ├── class-shortcode.php
    │ ├── class-exception-handler.php
    │ └── ajax/
    │ └── process-chat.php # AJAX xử lý dữ liệu chat từ frontend
    │
    ├── admin/ # Phần quản trị (admin settings, style, UI)
    │ ├── class-admin.php
    │ ├── admin-settings.php
    │ ├── admin-styles.css
    │ └── views/ # Template giao diện trong trang quản trị
    │ └── settings-page.php
    │
    ├── frontend/ # Giao diện và tài nguyên cho người dùng cuối
    │ ├── js/
    │ │ └── chatbot.js
    │ ├── css/
    │ │ └── chatbot-style.css
    │ └── templates/
    │ └── chatbox.php
    │
    ├── assets/ # Tài nguyên tĩnh như hình ảnh, icon
    │ ├── images/
    │ └── icons/
    │
    ├── logs/ # Ghi log lỗi (tuỳ chọn, cần bảo mật bằng .htaccess)
    │ └── chatbot-error.log
    │
    ├── languages/ # File dịch đa ngôn ngữ (.pot, .po, .mo)
    │ └── wp-chatbot-ai.pot
    │
    └── readme.md # Tài liệu mô tả plugin, hướng dẫn sử dụng

--- 🛠 Yêu cầu hệ thống

- WordPress 5.8+
- PHP 7.4 trở lên
- Cần API key từ OpenAI hoặc dịch vụ AI khác nếu muốn sử dụng GPT

---

## 🔒 Bảo mật và ghi log

- Tất cả tương tác AJAX đều kiểm tra `nonce` và quyền người dùng
- Plugin hỗ trợ ghi log lỗi riêng tại `wp-content/uploads/chatbot-error.log`

---

## 🌐 Dịch và đa ngôn ngữ

Plugin hỗ trợ `Text Domain: wp-chatbot-ai` và có file nguồn dịch `.pot` trong thư mục `languages/`, sẵn sàng để bạn dịch sang bất kỳ ngôn ngữ nào.

---

## 📜 Giấy phép

Plugin này phát hành theo giấy phép GPLv2 hoặc cao hơn.

---

## ✍️ Tác giả

- **Tên**: [LGL-AI]
- **Website**: https://lgl-ai.com/
- **GitHub**: https://github.com/SyThanh11/wp-chatbox-ai

---

> **Lưu ý:** Đây là phiên bản nền tảng, bạn có thể mở rộng thêm các tính năng như lưu lịch sử chat, phân quyền người dùng, tích hợp WooCommerce, v.v.
