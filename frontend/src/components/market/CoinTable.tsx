'use client';

import { useEffect, useState } from 'react';
import './market.css';

interface Coin {
    id: string;
    symbol: string;
    name: string;
    current_price: number;
    price_change_percentage_24h: number;
    market_cap: number;
    total_volume: number;
    image?: string;
}

export default function CoinTable() {
    const [coins, setCoins] = useState<Coin[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCoins = async () => {
            try {
                // TODO: Thay đổi URL này thành API thực tế từ BE 2
                const response = await fetch('http://localhost:3002/api/coins');

                if (response.ok) {
                    const data = await response.json();
                    setCoins(data.coins || data);
                } else {
                    setError('Không thể tải dữ liệu thị trường');
                }
            } catch (err) {
                setError('Lỗi kết nối đến server');
                console.error('Fetch coins error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCoins();

        // Refresh data every 30 seconds
        const interval = setInterval(fetchCoins, 30000);
        return () => clearInterval(interval);
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
        }).format(price);
    };

    const formatMarketCap = (value: number) => {
        if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
        if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
        if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
        return `$${value.toFixed(2)}`;
    };

    if (isLoading) {
        return (
            <div className="coin-table-loading">
                <span className="spinner-large"></span>
                <p>Đang tải dữ liệu thị trường...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="coin-table-error">
                <p className="text-error">{error}</p>
                <button onClick={() => window.location.reload()} className="btn btn-outline">
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="coin-table-container">
            <div className="table-header">
                <h2>Giá Crypto Hôm Nay</h2>
                <p className="text-secondary">Cập nhật mỗi 30 giây</p>
            </div>

            <div className="table-wrapper">
                <table className="coin-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tên</th>
                            <th>Giá</th>
                            <th>24h %</th>
                            <th>Vốn hóa</th>
                            <th>Khối lượng 24h</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coins.map((coin, index) => (
                            <tr key={coin.id} className="coin-row">
                                <td className="rank">{index + 1}</td>
                                <td className="coin-name">
                                    <div className="coin-info">
                                        {coin.image && (
                                            <img src={coin.image} alt={coin.name} className="coin-icon" />
                                        )}
                                        <div>
                                            <div className="name">{coin.name}</div>
                                            <div className="symbol">{coin.symbol.toUpperCase()}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="price">{formatPrice(coin.current_price)}</td>
                                <td className={coin.price_change_percentage_24h >= 0 ? 'change positive' : 'change negative'}>
                                    {coin.price_change_percentage_24h >= 0 ? '▲' : '▼'}
                                    {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                                </td>
                                <td className="market-cap">{formatMarketCap(coin.market_cap)}</td>
                                <td className="volume">{formatMarketCap(coin.total_volume)}</td>
                                <td>
                                    <button className="btn btn-primary btn-sm">Giao dịch</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
