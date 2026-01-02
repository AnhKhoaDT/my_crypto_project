# 🚀 Crypto Trading System - Frontend

Dự án web app giao dịch cryptocurrency được xây dựng với **Next.js 13**, **React 18**, và **TypeScript**.

## 📁 Cấu trúc dự án

```
frontend/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Auth route group
│   │   │   ├── login/           # Trang đăng nhập
│   │   │   ├── register/        # Trang đăng ký
│   │   │   └── profile/         # Trang profile
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Homepage
│   │   └── globals.css          # Global styles
│   │
│   └── components/              # Reusable components
│       ├── auth/                # Auth components (Dev 1 - Kiệt)
│       │   ├── LoginForm.tsx
│       │   ├── RegisterForm.tsx
│       │   └── auth.css
│       │
│       ├── layout/              # Layout components (Dev 2 - Khoa)
│       │   ├── Header.tsx
│       │   ├── Footer.tsx
│       │   └── layout.css
│       │
│       └── market/              # Market components (Dev 2 - Khoa)
│           ├── CoinTable.tsx
│           ├── ChartPlaceholder.tsx
│           └── market.css
```

## 🎯 Phân công công việc

### **Dev 1 - Kiệt** (Auth & Profile)
✅ **Hoàn thành:**
- ✅ Login Form với validation đầy đủ
- ✅ Register Form với validation
- ✅ Profile Page gọi API `/me`
- ✅ JWT authentication (lưu vào localStorage)
- ✅ Auto redirect sau login/logout

**API cần tích hợp:**
- `POST http://localhost:3001/api/auth/login` - Đăng nhập
- `POST http://localhost:3001/api/auth/register` - Đăng ký
- `GET http://localhost:3001/api/auth/me` - Lấy thông tin user (cần JWT)

### **Dev 2 - Khoa** (Homepage & Market UI)
✅ **Hoàn thành:**
- ✅ Header với navigation
- ✅ Footer với links
- ✅ CoinTable hiển thị danh sách crypto
- ✅ ChartPlaceholder (chuẩn bị cho Tuần 2)
- ✅ Responsive design

**API cần tích hợp:**
- `GET http://localhost:3002/api/coins` - Lấy danh sách coins

## 🚀 Cách chạy dự án

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Chạy development server
```bash
npm run dev
```

Mở trình duyệt tại: **http://localhost:3000**

### 3. Build production
```bash
npm run build
npm start
```

## 🔧 Cấu hình quan trọng

### Path Alias
Đã cấu hình `@/*` alias trong `tsconfig.json`:
```typescript
import LoginForm from '@/components/auth/LoginForm';
import Header from '@/components/layout/Header';
```

### API Endpoints
Cần cập nhật các URL API trong:
- `src/components/auth/LoginForm.tsx` (line 48)
- `src/components/auth/RegisterForm.tsx` (line 67)
- `src/app/(auth)/profile/page.tsx` (line 24)
- `src/components/market/CoinTable.tsx` (line 23)

## 🎨 Design System

### Colors
```css
--bg-primary: #0b0e11;        /* Background chính */
--bg-secondary: #181a20;      /* Background phụ */
--bg-card: #1e2329;           /* Background card */
--brand-color: #FCD535;       /* Màu chủ đạo (vàng) */
--success: #0ecb81;           /* Màu tăng giá */
--error: #f6465d;             /* Màu giảm giá */
```

### Components
- `.btn` - Button cơ bản
- `.btn-primary` - Button chính (màu vàng)
- `.btn-outline` - Button viền
- `.input-field` - Input field
- `.card` - Card container

## 📝 Validation Rules

### Login Form
- Email: Bắt buộc, phải đúng format email
- Password: Bắt buộc, tối thiểu 6 ký tự

### Register Form
- Username: Bắt buộc, tối thiểu 3 ký tự
- Email: Bắt buộc, phải đúng format email
- Password: Bắt buộc, tối thiểu 6 ký tự
- Confirm Password: Phải khớp với password

## 🔐 Authentication Flow

1. **Login:**
   - User nhập email/password
   - Gọi API login
   - Lưu JWT token vào `localStorage`
   - Redirect về homepage

2. **Register:**
   - User nhập thông tin
   - Gọi API register
   - Redirect về login page

3. **Profile:**
   - Kiểm tra JWT token
   - Gọi API `/me` với Bearer token
   - Hiển thị thông tin user
   - Nếu token invalid → redirect về login

4. **Logout:**
   - Xóa token khỏi localStorage
   - Redirect về login page

## 📱 Responsive Design

- **Desktop:** Full layout với sidebar
- **Tablet:** Ẩn một số cột trong bảng
- **Mobile:** Stack layout, ẩn navigation menu

## 🔄 Auto-refresh

CoinTable tự động refresh mỗi **30 giây** để cập nhật giá crypto.

## 🎯 Tuần 2 - Kế hoạch

- [ ] Tích hợp biểu đồ nến (TradingView/Chart.js)
- [ ] WebSocket real-time price updates
- [ ] Trading functionality
- [ ] Portfolio management

## 🐛 Troubleshooting

### Lỗi TypeScript "Cannot find module"
- Restart TypeScript server trong VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
- Hoặc restart VS Code

### Lỗi CORS khi gọi API
- Đảm bảo backend đã enable CORS
- Hoặc dùng Next.js API routes làm proxy

## 📞 Liên hệ

- **Dev 1 (Kiệt):** Auth & Profile
- **Dev 2 (Khoa):** Homepage & Market UI

---

Made with ❤️ by Team Crypto Trading
