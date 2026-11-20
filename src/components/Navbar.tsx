'use client'
import { Bell, Search, Sun, Moon } from 'lucide-react'
import { useTheme } from '@/lib/theme'

interface NavbarProps {
  title: string
  subtitle?: string
}

export default function Navbar({ title, subtitle }: NavbarProps) {
  const { theme, toggle } = useTheme()

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div>
          <h1 className="navbar-title">{title}</h1>
          {subtitle && <p className="navbar-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="navbar-right">
        {/* Search */}
        <div className="navbar-search">
          <Search size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <input placeholder="Cari sesuatu..." />
        </div>

        {/* Theme toggle */}
        <button className="icon-btn" onClick={toggle} title="Toggle theme" id="theme-toggle-btn">
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications */}
        <button className="icon-btn" title="Notifikasi" id="notif-btn">
          <Bell size={16} />
          <span className="notif-dot" />
        </button>
      </div>
    </header>
  )
}
