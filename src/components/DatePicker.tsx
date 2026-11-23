'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'

const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]
const DAYS_ID = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

function parseDate(val: string): Date | null {
  if (!val) return null
  const d = new Date(val + 'T00:00:00')
  return isNaN(d.getTime()) ? null : d
}

function toDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function displayDate(val: string): string {
  const d = parseDate(val)
  if (!d) return ''
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`
}

interface DatePickerProps {
  value?: string
  onChange?: (val: string) => void
  placeholder?: string
  label?: string
  className?: string
  min?: string
  max?: string
  format?: 'id' | 'iso'
}

export default function DatePicker({
  value = '',
  onChange,
  placeholder = 'Pilih tanggal',
  className = '',
  min,
  max,
  format = 'id',
}: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const initial = parseDate(value)
  const [viewYear, setViewYear] = useState(initial ? initial.getFullYear() : 2026)
  const [viewMonth, setViewMonth] = useState(initial ? initial.getMonth() : 10)
  const [todayStr, setTodayStr] = useState('')
  const [mode, setMode] = useState<'days' | 'months' | 'years'>('days')
  const wrapRef = useRef<HTMLDivElement>(null)

  // Initialize client-side current date safely
  useEffect(() => {
    const now = new Date()
    setTodayStr(toDateStr(now))
    if (!value) {
      setViewYear(now.getFullYear())
      setViewMonth(now.getMonth())
    }
  }, [value])

  // Sync view when value changes externally
  useEffect(() => {
    const d = parseDate(value)
    if (d) { setViewYear(d.getFullYear()); setViewMonth(d.getMonth()) }
  }, [value])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const selectDate = useCallback((date: Date) => {
    const str = toDateStr(date)
    if (min && str < min) return
    if (max && str > max) return
    onChange?.(str)
    setOpen(false)
  }, [min, max, onChange])

  // Build calendar grid
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const selectedStr = value

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) } else setViewMonth(m => m - 1) }
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) } else setViewMonth(m => m + 1) }

  // Year range for picker
  const yearStart = Math.floor(viewYear / 12) * 12
  const years = Array.from({ length: 12 }, (_, i) => yearStart + i)

  return (
    <div ref={wrapRef} style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
      {/* Trigger input */}
      <div
        onClick={() => { setOpen(o => !o); setMode('days') }}
        className={`form-control ${className}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          userSelect: 'none',
          color: value ? 'var(--text-primary)' : 'var(--text-muted)',
          marginBottom: 0,
        }}
      >
        <span style={{ fontSize: 13 }}>
          {value ? (format === 'iso' ? value : displayDate(value)) : placeholder}
        </span>
        <Calendar size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
      </div>

      {/* Popup */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          zIndex: 9999,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--shadow-lg)',
          padding: 12,
          minWidth: 280,
          animation: 'fadeInDown 0.15s ease',
        }}>

          {/* ───── DAY VIEW ───── */}
          {mode === 'days' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <button
                  type="button"
                  onClick={prevMonth}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: 6, color: 'var(--text-primary)' }}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setMode('months')}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontWeight: 700, fontSize: 13, color: 'var(--text-primary)',
                    padding: '4px 10px', borderRadius: 6,
                  }}
                >
                  {MONTHS_ID[viewMonth]} {viewYear}
                </button>
                <button
                  type="button"
                  onClick={nextMonth}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', borderRadius: 6, color: 'var(--text-primary)' }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Day headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: 4 }}>
                {DAYS_ID.map(d => (
                  <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', padding: '2px 0' }}>{d}</div>
                ))}
              </div>

              {/* Cells */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                {cells.map((day, idx) => {
                  if (!day) return <div key={idx} />
                  const dateStr = toDateStr(new Date(viewYear, viewMonth, day))
                  const isSelected = dateStr === selectedStr
                  const isToday = dateStr === todayStr
                  const isDisabled = (min && dateStr < min) || (max && dateStr > max)
                  return (
                    <button
                      key={idx}
                      type="button"
                      disabled={!!isDisabled}
                      onClick={() => selectDate(new Date(viewYear, viewMonth, day))}
                      style={{
                        border: 'none',
                        borderRadius: 7,
                        padding: '6px 0',
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        fontSize: 12,
                        fontWeight: isSelected ? 700 : isToday ? 600 : 400,
                        background: isSelected ? 'var(--primary)' : isToday ? 'var(--primary-bg)' : 'transparent',
                        color: isSelected ? '#fff' : isToday ? 'var(--primary)' : isDisabled ? 'var(--text-muted)' : 'var(--text-primary)',
                        opacity: isDisabled ? 0.4 : 1,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { if (!isSelected && !isDisabled) (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-hover)' }}
                      onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = isToday ? 'var(--primary-bg)' : 'transparent' }}
                    >
                      {day}
                    </button>
                  )
                })}
              </div>

              {/* Today shortcut */}
              <div style={{ marginTop: 10, borderTop: '1px solid var(--border-color)', paddingTop: 8, textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => selectDate(new Date())}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}
                >
                  Hari ini
                </button>
              </div>
            </>
          )}

          {/* ───── MONTH VIEW ───── */}
          {mode === 'months' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <button type="button" onClick={() => setViewYear(y => y - 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', color: 'var(--text-primary)' }}><ChevronLeft size={16} /></button>
                <button type="button" onClick={() => setMode('years')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)', padding: '4px 10px', borderRadius: 6 }}>{viewYear}</button>
                <button type="button" onClick={() => setViewYear(y => y + 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', color: 'var(--text-primary)' }}><ChevronRight size={16} /></button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
                {MONTHS_ID.map((m, i) => {
                  const isCur = i === viewMonth && viewYear === (parseDate(value)?.getFullYear() ?? -1)
                  return (
                    <button key={m} type="button" onClick={() => { setViewMonth(i); setMode('days') }}
                      style={{ border: 'none', borderRadius: 8, padding: '8px 4px', cursor: 'pointer', fontSize: 12, fontWeight: isCur ? 700 : 400, background: isCur ? 'var(--primary)' : 'transparent', color: isCur ? '#fff' : 'var(--text-primary)' }}
                      onMouseEnter={e => { if (!isCur) (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-hover)' }}
                      onMouseLeave={e => { if (!isCur) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
                    >{m.slice(0, 3)}</button>
                  )
                })}
              </div>
            </>
          )}

          {/* ───── YEAR VIEW ───── */}
          {mode === 'years' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <button type="button" onClick={() => setViewYear(y => y - 12)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', color: 'var(--text-primary)' }}><ChevronLeft size={16} /></button>
                <span style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{yearStart} – {yearStart + 11}</span>
                <button type="button" onClick={() => setViewYear(y => y + 12)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', color: 'var(--text-primary)' }}><ChevronRight size={16} /></button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
                {years.map(yr => {
                  const isCur = yr === viewYear
                  return (
                    <button key={yr} type="button" onClick={() => { setViewYear(yr); setMode('months') }}
                      style={{ border: 'none', borderRadius: 8, padding: '8px 4px', cursor: 'pointer', fontSize: 12, fontWeight: isCur ? 700 : 400, background: isCur ? 'var(--primary)' : 'transparent', color: isCur ? '#fff' : 'var(--text-primary)' }}
                      onMouseEnter={e => { if (!isCur) (e.currentTarget as HTMLButtonElement).style.background = 'var(--bg-hover)' }}
                      onMouseLeave={e => { if (!isCur) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
                    >{yr}</button>
                  )
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
