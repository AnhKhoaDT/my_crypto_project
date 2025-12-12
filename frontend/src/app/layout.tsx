import './globals.css'

export const metadata = {
  title: 'Crypto Trading Sys',
  description: 'Dashboard'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <header style={{ padding: 16, borderBottom: '1px solid #eee' }}>
          <h2>Crypto Trading Sys (Tuần 1)</h2>
        </header>
        <main style={{ padding: 16 }}>{children}</main>
      </body>
    </html>
  )
}
