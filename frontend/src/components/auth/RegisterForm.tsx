'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './auth.css';

export default function RegisterForm() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        address: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<{
        username?: string;
        email?: string;
        phone?: string;
        address?: string;
        password?: string;
        confirmPassword?: string;
    }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validateForm = () => {
        const newErrors: typeof errors = {};

        if (!formData.username) {
            newErrors.username = 'Tên người dùng không được để trống';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Tên người dùng phải có ít nhất 3 ký tự';
        }

        if (!formData.email) {
            newErrors.email = 'Email không được để trống';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.phone) {
            newErrors.phone = 'Số điện thoại không được để trống';
        } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
            newErrors.phone = 'Số điện thoại phải có 10-11 chữ số';
        }

        if (!formData.address) {
            newErrors.address = 'Địa chỉ không được để trống';
        } else if (formData.address.length < 10) {
            newErrors.address = 'Địa chỉ phải có ít nhất 10 ký tự';
        }

        if (!formData.password) {
            newErrors.password = 'Mật khẩu không được để trống';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
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
            // TODO: Thay đổi URL này thành API thực tế từ BE 1
            const response = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    password: formData.password
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Đăng ký thành công, chuyển đến trang login
                router.push('/login?registered=true');
            } else {
                setServerError(data.message || 'Đăng ký thất bại');
            }
        } catch (error) {
            setServerError('Không thể kết nối đến server');
            console.error('Register error:', error);
        } finally {
            setIsLoading(false);
        }
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
                    <h1>Đăng Ký</h1>
                    <p className="text-secondary">Tạo tài khoản mới để bắt đầu giao dịch crypto.</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {serverError && (
                        <div className="error-banner">
                            <span>⚠️ {serverError}</span>
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="username">Tên người dùng</label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            className={`input-field ${errors.username ? 'input-error' : ''}`}
                            placeholder="username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        {errors.username && <span className="error-text">{errors.username}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            className={`input-field ${errors.email ? 'input-error' : ''}`}
                            placeholder="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Số điện thoại</label>
                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            className={`input-field ${errors.phone ? 'input-error' : ''}`}
                            placeholder="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        {errors.phone && <span className="error-text">{errors.phone}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Địa chỉ</label>
                        <input
                            id="address"
                            type="text"
                            name="address"
                            className={`input-field ${errors.address ? 'input-error' : ''}`}
                            placeholder="address"
                            value={formData.address}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        {errors.address && <span className="error-text">{errors.address}</span>}
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

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            className={`input-field ${errors.confirmPassword ? 'input-error' : ''}`}
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner"></span>
                                Đang đăng ký...
                            </>
                        ) : 'Đăng Ký'}
                    </button>

                    <div className="auth-footer">
                        <p className="text-secondary">
                            Đã có tài khoản? <a href="/login" className="link-primary">Đăng nhập</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
