# Karaoke Forge

MVP web karaoke kết hợp trải nghiệm đầu karaoke thông minh với giao diện lò rèn/kho báu. Ứng dụng có thư viện bài hát, tìm kiếm, yêu thích, hàng chờ, chọn bài ngẫu nhiên, màn hình hát và chấm điểm cao độ trực tiếp từ microphone.

## Chạy dự án

```bash
npm install
npm run dev
```

Mở địa chỉ Vite hiển thị trong terminal. Khi vào màn hình hát, chọn **Bật micro** để chấm giọng thật hoặc **Chế độ thử** để xem mô phỏng thuật toán mà không cần cấp quyền microphone.

## Cách tính điểm trong MVP

- Microphone được đọc qua Web Audio API.
- Cao độ được ước lượng bằng tự tương quan tín hiệu âm thanh.
- Tần số giọng hát được đổi sang MIDI note rồi so với note mục tiêu theo timeline.
- Điểm tổng hợp gồm độ đúng nốt, thời lượng bắt được giọng và độ ổn định quanh tông mục tiêu.

Các bài hát và giai điệu trong bản demo là dữ liệu mẫu nguyên bản, không chứa nhạc thương mại.
