# BLE Message Broadcast System

Hệ thống gửi và nhận tin nhắn qua Bluetooth Low Energy (BLE) giữa máy tính và thiết bị di động.

## Cấu trúc thư mục

```
.
├── sender/              # Phần gửi tin nhắn (máy tính)
│   ├── index.html
│   ├── styles.css
│   └── sender.js
└── receiver/           # Phần nhận tin nhắn (thiết bị di động)
    ├── index.html
    ├── styles.css
    ├── receiver.js
    └── manifest.json
```

## Yêu cầu hệ thống

### Sender (Máy tính)
- Trình duyệt web hỗ trợ Web Bluetooth API (Chrome, Edge, hoặc Opera)
- Bluetooth adapter
- Hệ điều hành hỗ trợ Web Bluetooth API

### Receiver (Thiết bị di động)
- Trình duyệt web hỗ trợ Web Bluetooth API
- Bluetooth 4.0 trở lên
- Hệ điều hành Android 6.0 trở lên hoặc iOS 13 trở lên

## Cách sử dụng

### 1. Sender (Máy tính)
1. Mở file `sender/index.html` trong trình duyệt web
2. Nhấn nút "Scan for Devices" để tìm các thiết bị BLE xung quanh
3. Nhập tin nhắn vào ô textarea
4. Nhấn nút "Send Message" để gửi tin nhắn

### 2. Receiver (Thiết bị di động)
1. Mở file `receiver/index.html` trong trình duyệt web
2. Nhấn nút "Connect to Sender" để kết nối với thiết bị sender
3. Khi nhận được tin nhắn, nó sẽ hiển thị trong danh sách tin nhắn
4. Có thể nhấn nút "Disconnect" để ngắt kết nối

## Tính năng
- Gửi tin nhắn tới nhiều thiết bị cùng lúc
- Lưu lịch sử tin nhắn trên thiết bị receiver
- Thông báo khi có tin nhắn mới
- Giao diện thân thiện với mobile
- Hỗ trợ PWA (có thể cài đặt lên màn hình chính)

## Lưu ý
- Đảm bảo Bluetooth đã được bật trên cả hai thiết bị
- Các thiết bị phải ở trong phạm vi kết nối Bluetooth
- Cho phép quyền truy cập Bluetooth khi trình duyệt yêu cầu 