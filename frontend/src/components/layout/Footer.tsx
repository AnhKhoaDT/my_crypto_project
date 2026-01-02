export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <h4>Về chúng tôi</h4>
                    <ul>
                        <li><a href="/about">Giới thiệu</a></li>
                        <li><a href="/terms">Điều khoản</a></li>
                        <li><a href="/privacy">Chính sách</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Sản phẩm</h4>
                    <ul>
                        <li><a href="/trade">Giao dịch</a></li>
                        <li><a href="/market">Thị trường</a></li>
                        <li><a href="/api">API</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Hỗ trợ</h4>
                    <ul>
                        <li><a href="/help">Trung tâm trợ giúp</a></li>
                        <li><a href="/contact">Liên hệ</a></li>
                        <li><a href="/faq">FAQ</a></li>
                    </ul>
                </div>

                <div className="footer-section">
                    <h4>Cộng đồng</h4>
                    <ul>
                        <li><a href="#">Twitter</a></li>
                        <li><a href="#">Telegram</a></li>
                        <li><a href="#">Discord</a></li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; 2024 CryptoTrade. All rights reserved.</p>
            </div>
        </footer>
    );
}
