export default function ChartPlaceholder() {
    return (
        <div className="chart-placeholder">
            <div className="chart-header">
                <h3>Biểu đồ nến</h3>
                <div className="chart-controls">
                    <button className="time-btn active">1H</button>
                    <button className="time-btn">4H</button>
                    <button className="time-btn">1D</button>
                    <button className="time-btn">1W</button>
                    <button className="time-btn">1M</button>
                </div>
            </div>

            <div className="chart-content">
                <div className="placeholder-message">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 3v18h18" strokeWidth="2" strokeLinecap="round" />
                        <path d="M7 16V8M12 16V5M17 16v-4" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <h4>Biểu đồ nến sẽ được tích hợp ở Tuần 2</h4>
                    <p className="text-secondary">
                        Sử dụng thư viện như TradingView hoặc Chart.js để hiển thị dữ liệu giá
                    </p>
                </div>
            </div>
        </div>
    );
}
