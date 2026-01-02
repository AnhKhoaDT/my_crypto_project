'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import './layout.css';

interface User {
    username: string;
    role?: 'normal' | 'vip';
}

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<User | null>(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load user from localStorage
        const loadUser = () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (e) {
                    console.error('Error parsing user data:', e);
                }
            } else {
                setUser(null);
            }
        };

        loadUser();

        // Listen for auth changes
        const handleAuthChange = () => {
            loadUser();
        };

        window.addEventListener('authChange', handleAuthChange);

        return () => {
            window.removeEventListener('authChange', handleAuthChange);
        };
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setShowDropdown(false);

        // Dispatch auth change event
        window.dispatchEvent(new Event('authChange'));

        router.push('/login');
    };

    const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register');

    return (
        <header className="header">
            <div className="header-container">
                <div className="header-left">
                    <a href="/" className="logo">
                        <span className="logo-icon">₿</span>
                        <span className="logo-text">CryptoTrade</span>
                    </a>

                    {!isAuthPage && (
                        <nav className="nav-menu">
                            <a href="/" className={pathname === '/' ? 'nav-link active' : 'nav-link'}>
                                Thị trường
                            </a>
                            <a href="/portfolio" className={pathname === '/portfolio' ? 'nav-link active' : 'nav-link'}>
                                Danh mục
                            </a>
                            <a href="/trade" className={pathname === '/trade' ? 'nav-link active' : 'nav-link'}>
                                Giao dịch
                            </a>
                        </nav>
                    )}
                </div>

                <div className="header-right">
                    {user ? (
                        <div className="user-section" ref={dropdownRef}>
                            <button
                                className="user-menu"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <div className="user-avatar">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="username-wrapper">
                                    <span>{user.username}</span>
                                    {user.role === 'vip' && (
                                        <span className="vip-badge">VIP</span>
                                    )}
                                </div>
                                <svg
                                    className={`dropdown-icon ${showDropdown ? 'rotate' : ''}`}
                                    width="16"
                                    height="16"
                                    viewBox="0 0 16 16"
                                    fill="none"
                                >
                                    <path
                                        d="M4 6L8 10L12 6"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>

                            {showDropdown && (
                                <div className="user-dropdown">
                                    <a
                                        href="/profile"
                                        className="dropdown-item"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path
                                                d="M8 8C10.21 8 12 6.21 12 4C12 1.79 10.21 0 8 0C5.79 0 4 1.79 4 4C4 6.21 5.79 8 8 8ZM8 10C5.33 10 0 11.34 0 14V16H16V14C16 11.34 10.67 10 8 10Z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        Trang cá nhân
                                    </a>
                                    <div className="dropdown-divider"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="dropdown-item logout"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path
                                                d="M6 14H3C2.73478 14 2.48043 13.8946 2.29289 13.7071C2.10536 13.5196 2 13.2652 2 13V3C2 2.73478 2.10536 2.48043 2.29289 2.29289C2.48043 2.10536 2.73478 2 3 2H6M11 11L14 8M14 8L11 5M14 8H6"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <a href="/login" className="btn btn-outline btn-sm">
                                Đăng nhập
                            </a>
                            <a href="/register" className="btn btn-primary btn-sm">
                                Đăng ký
                            </a>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
