'use client'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'
import { usePathname } from 'next/navigation'

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Selamat datang kembali 👋' },
  '/purchase-request': { title: 'Purchase Request', subtitle: 'Kelola permintaan pembelian' },
  '/purchase-order': { title: 'Purchase Order', subtitle: 'Kelola pesanan ke vendor' },
  '/approval': { title: 'Approval', subtitle: 'Proses persetujuan PR' },
  '/invoice': { title: 'Invoice', subtitle: 'Kelola tagihan vendor' },
  '/vendor': { title: 'Vendor', subtitle: 'Manajemen pemasok' },
  '/master-data': { title: 'Master Data Produk', subtitle: 'Katalog barang dan jasa' },
  '/reports': { title: 'Laporan', subtitle: 'Analitik dan laporan pengadaan' },
  '/settings': { title: 'Pengaturan', subtitle: 'Konfigurasi sistem' },
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const matched = Object.entries(pageTitles).find(([key]) => pathname === key || pathname.startsWith(key + '/'))
  const { title, subtitle } = matched?.[1] ?? { title: 'ProcureEase', subtitle: '' }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title={title} subtitle={subtitle} />
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  )
}
