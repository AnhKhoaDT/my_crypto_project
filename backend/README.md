# Backend — Hướng dẫn Tuần 1

Đây là nơi chứa các service backend của dự án.

Quy ước Port:
- Auth Service: 4000
- Market Service: 4001

Backend Team (Tuần 1):
- `backend/auth-service` (Vinh): implement auth (register/login/me), kết nối PostgreSQL.
- `backend/market-service` (Hào): implement API dummy coins/price, kết nối Redis.

Chạy local (nên dùng docker compose):

```powershell
docker compose up --build
```

Endpoints mẫu:
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- GET /api/market/coins
- GET /api/market/price?symbol=BTC
