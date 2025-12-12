# Hệ thống Phân tích Tài chính & Crypto Real-time

Tuần 1 — Hướng dẫn setup & phân công công việc

Mục tiêu Tuần 1: Xây dựng skeleton (monorepo), thiết lập Docker chung, hoàn thành luồng xác thực (Authentication) và các API dummy cho market.

Chạy nhanh (Docker):

```powershell
docker compose up --build
```

Endpoints chính:
- Auth: http://localhost:4000/api/auth
- Market: http://localhost:4001/api/market

Xem chi tiết phân công và cách chạy từng phần ở:
- [backend/README.md](backend/README.md)
- [frontend/README.md](frontend/README.md)
