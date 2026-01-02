import Link from 'next/link';
import CoinTable from '@/components/market/CoinTable';
import ChartPlaceholder from '@/components/market/ChartPlaceholder';

export default function HomePage() {
  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 8px 0' }}>
              Thị trường Crypto
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              Theo dõi giá và giao dịch các loại tiền điện tử hàng đầu
            </p>
          </div>
          <Link
            href="/chart"
            style={{
              background: 'linear-gradient(135deg, #26a69a 0%, #1e8a7f 100%)',
              color: '#fff',
              padding: '12px 24px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 16px rgba(38, 166, 154, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            📊 Trading Chart
          </Link>
        </div>
      </div>

      <ChartPlaceholder />
      <CoinTable />
    </div>
  );
}
