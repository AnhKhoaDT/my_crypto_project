'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import './profile.css';

interface User {
  id: string;
  username: string;
  email: string;
  role?: 'normal' | 'vip';
  createdAt?: string;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  coin: string;
  amount: number;
  price: number;
  total: number;
  date: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  const mockWalletBalance = {
    usd: 12450.75,
    btc: 0.45,
    eth: 3.2,
    bnb: 15.5
  };

  const mockPortfolioStats = {
    totalValue: 12450.75,
    totalProfit: 2340.50,
    profitPercent: 23.15,
    totalInvested: 10110.25
  };

  const mockRecentTransactions: Transaction[] = [
    {
      id: '1',
      type: 'buy',
      coin: 'BTC',
      amount: 0.05,
      price: 42500,
      total: 2125,
      date: '2025-12-29T10:30:00'
    },
    {
      id: '2',
      type: 'sell',
      coin: 'ETH',
      amount: 0.5,
      price: 2250,
      total: 1125,
      date: '2025-12-28T15:45:00'
    },
    {
      id: '3',
      type: 'buy',
      coin: 'BNB',
      amount: 5,
      price: 310,
      total: 1550,
      date: '2025-12-27T09:20:00'
    }
  ];

  useEffect(() => {
    const loadUserProfile = () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!token || !storedUser) {
        router.push('/login');
        return;
      }

      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing user data:', err);
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('authChange'));
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="loading-state">
          <span className="spinner-large"></span>
          <p>Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header Section */}
        <div className="profile-header-section">
          <div className="user-info">
            <div className="avatar-large">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <div className="username-with-badge">
                <h1>{user?.username}</h1>
                {user?.role === 'vip' && (
                  <span className="vip-badge-large">VIP</span>
                )}
              </div>
              <p className="email">{user?.email}</p>
              <p className="member-since">
                Thành viên từ {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
              </p>
            </div>
          </div>
          <button onClick={handleLogout} className="btn-logout">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 17.5H3.75C3.41848 17.5 3.10054 17.3683 2.86612 17.1339C2.6317 16.8995 2.5 16.5815 2.5 16.25V3.75C2.5 3.41848 2.6317 3.10054 2.86612 2.86612C3.10054 2.6317 3.41848 2.5 3.75 2.5H7.5M13.75 13.75L17.5 10M17.5 10L13.75 6.25M17.5 10H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Đăng xuất
          </button>
        </div>

        {/* Portfolio Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon wallet">💰</div>
            <div className="stat-content">
              <p className="stat-label">Tổng tài sản</p>
              <h3 className="stat-value">${mockPortfolioStats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon profit">📈</div>
            <div className="stat-content">
              <p className="stat-label">Lợi nhuận</p>
              <h3 className="stat-value positive">
                +${mockPortfolioStats.totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </h3>
              <p className="stat-percent positive">+{mockPortfolioStats.profitPercent}%</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon invested">💵</div>
            <div className="stat-content">
              <p className="stat-label">Đã đầu tư</p>
              <h3 className="stat-value">${mockPortfolioStats.totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2 })}</h3>
            </div>
          </div>
        </div>

        {/* Wallet Balances */}
        <div className="section-card">
          <h2 className="section-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 18V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V6M21 6H16C15.2044 6 14.4413 6.31607 13.8787 6.87868C13.3161 7.44129 13 8.20435 13 9V15C13 15.7956 13.3161 16.5587 13.8787 17.1213C14.4413 17.6839 15.2044 18 16 18H21V6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 12H16.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Số dư ví
          </h2>
          <div className="wallet-grid">
            <div className="wallet-item">
              <div className="coin-info">
                <span className="coin-symbol">USD</span>
                <span className="coin-name">US Dollar</span>
              </div>
              <div className="coin-balance">${mockWalletBalance.usd.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            </div>
            <div className="wallet-item">
              <div className="coin-info">
                <span className="coin-symbol btc">BTC</span>
                <span className="coin-name">Bitcoin</span>
              </div>
              <div className="coin-balance">{mockWalletBalance.btc} BTC</div>
            </div>
            <div className="wallet-item">
              <div className="coin-info">
                <span className="coin-symbol eth">ETH</span>
                <span className="coin-name">Ethereum</span>
              </div>
              <div className="coin-balance">{mockWalletBalance.eth} ETH</div>
            </div>
            <div className="wallet-item">
              <div className="coin-info">
                <span className="coin-symbol bnb">BNB</span>
                <span className="coin-name">Binance Coin</span>
              </div>
              <div className="coin-balance">{mockWalletBalance.bnb} BNB</div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="section-card">
          <h2 className="section-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 3H21M3 9H21M3 15H21M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Giao dịch gần đây
          </h2>
          <div className="transactions-list">
            {mockRecentTransactions.map((tx) => (
              <div key={tx.id} className="transaction-item">
                <div className="tx-icon-wrapper">
                  <div className={`tx-icon ${tx.type}`}>
                    {tx.type === 'buy' ? '↓' : '↑'}
                  </div>
                </div>
                <div className="tx-details">
                  <div className="tx-main">
                    <span className="tx-type">{tx.type === 'buy' ? 'Mua' : 'Bán'} {tx.coin}</span>
                    <span className={`tx-amount ${tx.type}`}>
                      {tx.type === 'buy' ? '-' : '+'}${tx.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="tx-sub">
                    <span className="tx-quantity">{tx.amount} {tx.coin} @ ${tx.price.toLocaleString('en-US')}</span>
                    <span className="tx-date">{new Date(tx.date).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Info */}
        <div className="section-card">
          <h2 className="section-title">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor" />
            </svg>
            Thông tin tài khoản
          </h2>
          <div className="account-info-grid">
            <div className="info-item">
              <span className="info-label">User ID</span>
              <span className="info-value">{user?.id}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Username</span>
              <span className="info-value">{user?.username}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email</span>
              <span className="info-value">{user?.email}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Loại tài khoản</span>
              <span className={`account-type-badge ${user?.role || 'normal'}`}>
                {user?.role === 'vip' ? 'VIP' : 'Thường'}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Trạng thái</span>
              <span className="status-badge active">Đang hoạt động</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
