'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, ShoppingCart, FileText, Truck, CheckSquare,
  Receipt, Package, BarChart3, Settings, LogOut, ChevronRight
} from 'lucide-react'

const navItems = [
  {
    section: 'Main',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ]
  },
  {
    section: 'Procurement',
    items: [
      { href: '/purchase-request', label: 'Purchase Request', icon: FileText, badge: null },
      { href: '/purchase-order', label: 'Purchase Order', icon: ShoppingCart },
      { href: '/approval', label: 'Approval', icon: CheckSquare },
      { href: '/invoice', label: 'Invoice', icon: Receipt },
    ]
  },
  {
    section: 'Master Data',
    items: [
      { href: '/vendor', label: 'Vendor', icon: Truck },
      { href: '/master-data', label: 'Produk', icon: Package },
    ]
  },
  {
    section: 'Report',
    items: [
      { href: '/reports', label: 'Laporan', icon: BarChart3 },
      { href: '/settings', label: 'Pengaturan', icon: Settings },
    ]
  }
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <ShoppingCart size={18} color="white" />
        </div>
        <div className="sidebar-logo-text">
          <span className="sidebar-logo-title">ProcureEase</span>
          <span className="sidebar-logo-sub">Procurement System</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map((section) => (
          <div key={section.section}>
            <p className="sidebar-section-title">{section.section}</p>
            {section.items.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                >
                  <Icon size={17} className="nav-icon" />
                  <span>{item.label}</span>
                  {(item as any).badge && (
                    <span className="nav-badge">{(item as any).badge}</span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">A</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Admin User</div>
            <div className="sidebar-user-role">Administrator</div>
          </div>
          <LogOut size={14} style={{ color: 'rgba(255,255,255,0.3)' }} />
        </div>
      </div>
    </aside>
  )
}
