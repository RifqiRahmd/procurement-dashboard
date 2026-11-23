'use client'
import { useState, useRef, useEffect } from 'react'
import { Download, FileText, Table2, ChevronDown } from 'lucide-react'

interface ExportDropdownProps {
  onExportCsv: () => void
  onExportXlsx: () => void
  label?: string
}

export default function ExportDropdown({ onExportCsv, onExportXlsx, label = 'Export' }: ExportDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        className="btn btn-secondary btn-sm"
        onClick={() => setOpen(o => !o)}
        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
      >
        <Download size={14} />
        {label}
        <ChevronDown size={12} style={{ transition: 'transform 0.2s', transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          right: 0,
          zIndex: 9999,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius-sm)',
          boxShadow: 'var(--shadow-lg)',
          minWidth: 180,
          overflow: 'hidden',
          animation: 'fadeInDown 0.15s ease',
        }}>
          <div style={{ padding: '6px 0' }}>
            <button
              onClick={() => { onExportCsv(); setOpen(false) }}
              style={{
                width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 16px', fontSize: 13, color: 'var(--text-primary)',
                textAlign: 'left',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <FileText size={15} style={{ color: 'var(--success)', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600 }}>Export CSV</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>Buka di Excel / Google Sheets</div>
              </div>
            </button>

            <button
              onClick={() => { onExportXlsx(); setOpen(false) }}
              style={{
                width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 16px', fontSize: 13, color: 'var(--text-primary)',
                textAlign: 'left',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'none')}
            >
              <Table2 size={15} style={{ color: 'var(--info)', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600 }}>Export Excel (.xlsx)</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>Format Microsoft Excel</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
