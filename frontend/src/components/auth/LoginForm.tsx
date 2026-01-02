'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './auth.css';

export default function LoginForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!formData.email) {
            newErrors.email = 'Email không được để trống';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.password) {
            newErrors.password = 'Mật khẩu không được để trống';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setServerError('');

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            // Mock authentication - 2 Tài khoản demo
            const MOCK_USERS = [
                {
                    email: 'demo@crypto.com',
                    password: '123456',
                    userData: {
                        id: 'mock-user-123',
                        username: 'DemoUser',
                        email: 'demo@crypto.com',
                        role: 'normal' as const,
                        createdAt: new Date().toISOString()
                    }
                },
                {
                    email: 'vip@crypto.com',
                    password: '123456',
                    userData: {
                        id: 'mock-vip-456',
                        username: 'VIPUser',
                        email: 'vip@crypto.com',
                        role: 'vip' as const,
                        createdAt: new Date().toISOString()
                    }
                }
            ];

            // Kiểm tra mock credentials
            const mockUser = MOCK_USERS.find(
                u => u.email === formData.email && u.password === formData.password
            );

            if (mockUser) {
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 800));

                const mockToken = 'mock-jwt-token-' + Date.now();

                // Lưu JWT vào localStorage
                localStorage.setItem('token', mockToken);
                localStorage.setItem('user', JSON.stringify(mockUser.userData));

                // Dispatch auth change event để Header cập nhật
                window.dispatchEvent(new Event('authChange'));

                // Redirect về trang chủ
                router.push('/');
                return;
            }

            // Nếu không phải mock user, thử gọi API thực
            try {
                const response = await fetch('http://localhost:3001/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                const data = await response.json();

                if (response.ok) {
                    // Lưu JWT vào localStorage
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));

                    // Dispatch auth change event để Header cập nhật
                    window.dispatchEvent(new Event('authChange'));

                    // Redirect về trang chủ
                    router.push('/');
                } else {
                    setServerError(data.message || 'Đăng nhập thất bại');
                }
            } catch (apiError) {
                // Nếu API không khả dụng, hiển thị lỗi credentials
                setServerError('Email hoặc mật khẩu không đúng. Thử tài khoản demo: demo@crypto.com / 123456 hoặc VIP: vip@crypto.com / 123456');
            }
        } catch (error) {
            setServerError('Đã xảy ra lỗi. Vui lòng thử lại.');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        // TODO: Tích hợp Google OAuth
        alert('Tính năng đăng nhập Google sẽ được tích hợp sau');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error khi user bắt đầu nhập
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    return (
        <div className="auth-container animate-fade-in">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Đăng Nhập</h1>
                    <p className="text-secondary">Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.</p>
                </div>

                {/* Demo Account Info */}
                <div className="info-banner">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V9H11V15ZM11 7H9V5H11V7Z" fill="currentColor" />
                    </svg>
                    <div>
                        <strong>Tài khoản Demo:</strong>
                        <div className="demo-credentials">
                            <div className="demo-account">
                                <span className="account-label">👤 Thường:</span>
                                <span>Email: <code>demo@crypto.com</code> | Password: <code>123456</code></span>
                            </div>
                            <div className="demo-account">
                                <span className="account-label">⭐ VIP:</span>
                                <span>Email: <code>vip@crypto.com</code> | Password: <code>123456</code></span>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {serverError && (
                        <div className="error-banner">
                            <span>⚠️ {serverError}</span>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            className={`input-field ${errors.email ? 'input-error' : ''}`}
                            placeholder="input email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            className={`input-field ${errors.password ? 'input-error' : ''}`}
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Đang đăng nhập...
                            </>
                        ) : 'Đăng Nhập'}
                    </button>

                    <div className="divider">
                        <span>hoặc</span>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="btn btn-google btn-full"
                        disabled={isLoading}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4" />
                            <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853" />
                            <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
                            <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335" />
                        </svg>
                        Đăng nhập với Google
                    </button>

                    <div className="auth-footer">
                        <p className="text-secondary">
                            Chưa có tài khoản? <a href="/register" className="link-primary">Đăng ký ngay</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
