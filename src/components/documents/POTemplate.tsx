'use client'
import React, { forwardRef } from 'react'
import { formatRp } from '@/lib/format'

export interface POCompanyConfig {
  name: string
  address: string
  city: string
  phone: string
  email: string
  npwp?: string
  logoText?: string
}

export interface POItemData {
  no: number
  description: string
  qty: number
  unit: string
  unitPrice: number
  total: number
}

export interface PODocumentData {
  id: string
  prId: string
  vendor: {
    name: string
    address?: string
    phone?: string
    email?: string
    contactPerson?: string
  }
  orderDate: string
  deliveryDate: string
  paymentTerms: string
  shippingAddress: string
  notes?: string
  items: POItemData[]
  totalAmount: number
  preparedBy?: { name: string; role: string }
  approvedBy?: { name: string; role: string }
}

interface POTemplateProps {
  po: PODocumentData
  company?: POCompanyConfig
}

export const defaultCompanyConfig: POCompanyConfig = {
  name: 'PT ALDZAMA',
  address: 'Jl. KH Syafii No.5, Sukomulyo, Manyar',
  city: 'Kab. Gresik 61151, Jawa Timur - Indonesia',
  phone: '(021) 520-8899',
  email: 'procurement@aldzama.co.id',
  npwp: '01.890.123.4-012.000',
  logoText: 'PROPOS',
}

const POTemplate = forwardRef<HTMLDivElement, POTemplateProps>(({ po, company = defaultCompanyConfig }, ref) => {
  const subtotal = po.totalAmount
  const ppn = Math.round(subtotal * 0.12) // PPN 12%
  const grandTotal = subtotal + ppn

  return (
    <div
      ref={ref}
      className="po-print-document"
      style={{
        width: '100%',
        maxWidth: 820,
        margin: '0 auto',
        backgroundColor: '#ffffff',
        color: '#1e293b',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        padding: '20px 42px',
        borderRadius: 12,
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        boxSizing: 'border-box',
      }}
    >
      {/* ── HEADER / KOP SURAT ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000', paddingBottom: 18, marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <img
            src="/asset/azm_logo.png"
            alt="Logo"
            style={{
              width: 180,
              height: 120,
              borderRadius: 10,
              objectFit: 'contain'
            }}
          />
          <div>
            <h2 style={{ margin: 0, fontSize: 25, fontWeight: 800, color: '#0F0F1A', letterSpacing: '0.2px' }}>
              {company.name}
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: 11, color: '#000', lineHeight: 1.4 }}>
              {company.address}
              <br />
              {company.city}
              {/* <br />
              Telp: {company.phone} | Email: {company.email} | NPWP: {company.npwp} */}
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'left' }}>
        <h1 style={{
          margin: 0,
          fontSize: 20,
          fontWeight: 800,
          color: '#000',
          letterSpacing: 1
        }}>
          PURCHASE ORDER
        </h1>

       <table style={{
          fontSize: 11,
          borderCollapse: 'collapse',
          color: '#0F0F1A',
          background: 'transparent',
          border: 'none',
          marginTop: 2          
        }}>
          <tbody>
            {[
              ['Nomor', po.id],
              ['Tanggal', po.orderDate],
              ['Request No.', po.prId],
              ['Delivery Date', po.deliveryDate]
            ].map(([label, value]) => (
              <tr key={label} style={{ background: 'transparent', color: '#0F0F1A' }}>
                <td style={{
                  padding: '2px 0',
                  width: 70,
                  color: '#0F0F1A',
                  border: 'none',
                  background: 'transparent'
                }}>
                  {label}
                </td>
                <td style={{
                  padding: '2px 8px',
                  width: 10,
                  color: '#0F0F1A',
                  border: 'none',
                  background: 'transparent'
                }}>
                  :
                </td>
                <td style={{
                  padding: '2px 0',
                  fontWeight: 600,
                  color: '#0F0F1A',
                  fontFamily: 'monospace',
                  border: 'none',
                  background: 'transparent'
                }}>
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      {/* ── META INFO / VENDOR & DELIVERY ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 24 }}>
        {/* Vendor Box */}
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 16px' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#000', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
            Kepada
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#0F0F1A' }}>
          {po.vendor.name}
        </div>

        <div style={{
          fontSize: 11,
          color: '#000',
          marginTop: 3,
          lineHeight: 1.5,
          background: 'transparent'
        }}>
          {po.vendor.address || 'Alamat vendor rekanan terdaftar'}
        </div><br />

        <table style={{
          width: '100%',
          fontSize: 11,
          borderCollapse: 'collapse',
          color: '#475569',
          marginTop: 3,
          background: 'transparent',
          border: 'none'
        }}>
          <tbody style={{ background: 'transparent' }}>
            {[
              ...(po.vendor.email ? [['Email', po.vendor.email]] : []),
              ...(po.vendor.phone ? [['Telp', po.vendor.phone]] : []),
              ['Jatuh Tempo']
            ].map(([label, value]) => (
              <tr key={label} style={{
                background: 'transparent',
                border: 'none'
              }}>
                <td style={{
                  width: '30%',
                  padding: '1px 5px 1px 0',
                  color: '#000',
                  background: 'transparent',
                  border: 'none',
                  verticalAlign: 'top'
                }}>
                  {label}
                </td>
                <td style={{
                  padding: '1px 5px',
                  color: '#000',
                  background: 'transparent',
                  border: 'none',
                  verticalAlign: 'top'
                }}>
                  :
                </td>
                <td style={{
                  padding: '1px 0',
                  color: '#000',
                  background: 'transparent',
                  border: 'none',
                  verticalAlign: 'top'
                }}>
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {/* Shipping & Order Info */}
        <div style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: 8,
          padding: '12px 16px'
        }}>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#000',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: 6
          }}>
            Ketentuan Pengiriman & Pembayaran
          </div>

          <table style={{
            width: '100%',
            fontSize: 11,
            borderCollapse: 'collapse',
            background: '#F8FAFC',
            border: 'none',
            color: '#0F0F1A'
          }}>
            <tbody>
              {[
                ['Tanggal Order', po.orderDate],
                ['Batas Pengiriman', po.deliveryDate],
                ['Syarat Pembayaran', po.paymentTerms],
                ['Alamat Kirim', po.shippingAddress]
              ].map(([label, value]) => (
                <tr key={label} style={{ background: '#F8FAFC' }}>
                  <td style={{
                    padding: '2px 0',
                    width: '35%',
                    background: '#F8FAFC',
                    border: 'none',
                    color: '#0F0F1A'
                  }}>
                    {label}
                  </td>
                  <td style={{
                    padding: '2px 0',
                    width: '3%',
                    background: '#F8FAFC',
                    border: 'none',
                    color: '#0F0F1A'
                  }}>
                    :
                  </td>
                  <td style={{
                    padding: '2px 0',
                    fontWeight: 600,
                    background: '#F8FAFC',
                    border: 'none',
                    color: '#0F0F1A'
                  }}>
                    {value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── TABEL ITEM PO ── */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20, fontSize: 12 }}>
        <thead>
          <tr style={{ background: '#000', color: '#FFFFFF' }}>
            <th style={{ padding: '10px 12px', textAlign: 'center', width: 36, borderRadius: '6px 0 0 0', color: '#FFF' }}>#</th>
            <th style={{ padding: '10px 12px', textAlign: 'left', color: '#FFF' }}>Deskripsi Barang / Jasa</th>
            <th style={{ padding: '10px 12px', textAlign: 'center', width: 70, color: '#FFF' }}>Qty</th>
            <th style={{ padding: '10px 12px', textAlign: 'center', width: 80, color: '#FFF' }}>Satuan</th>
            <th style={{ padding: '10px 12px', textAlign: 'right', width: 140, color: '#FFF' }}>Harga Satuan</th>
            <th style={{ padding: '10px 12px', textAlign: 'right', width: 150, color: '#FFF', borderRadius: '0 6px 0 0' }}>Total (Rp)</th>
          </tr>
        </thead>
        <tbody>
          {po.items.map((it, idx) => (
            <tr key={it.no || idx} style={{ borderBottom: '1px solid #E2E8F0', backgroundColor: idx % 2 === 1 ? '#FAFAFC' : '#fff' }}>
              <td style={{ padding: '9px 12px', textAlign: 'center', color: '#000' }}>{it.no || idx + 1}</td>
              <td style={{ padding: '9px 12px', fontWeight: 600, color: '#000' }}>{it.description}</td>
              <td style={{ padding: '9px 12px', textAlign: 'center', color: '#000' }}>{it.qty}</td>
              <td style={{ padding: '9px 12px', textAlign: 'center', color: '#000' }}>{it.unit}</td>
              <td style={{ padding: '9px 12px', textAlign: 'right', color: '#000' }}>{formatRp(it.unitPrice)}</td>
              <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 700, color: '#000' }}>{formatRp(it.total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── SUMMARY & NOTES ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20, marginBottom: 28 }}>
        <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 14px', fontSize: 11, color: '#000' }}>
          <strong style={{ color: '#0F0F1A', display: 'block', marginBottom: 4 }}>Syarat & Ketentuan PO:</strong>
          <img src="/asset/qr-tnc.png"
            alt="Logo"
            style={{
              width: 75,
              height: 75,
              borderRadius: 10,
              objectFit: 'contain'
            }}/>
          <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px dashed #CBD5E1' }}></div>
          <ol style={{ margin: 0, lineHeight: 1.5, paddingTop: 5 }}>
            <p>PPN : PT. ALDZAMA</p>
            <p>31.259.733.9-612.000</p>
            <p>{company.address} {company.city}</p>
          </ol>
          {/* {po.notes && (
            <div style={{ marginTop: 8, paddingTop: 6, borderTop: '1px dashed #CBD5E1' }}>
              <strong>Catatan Khusus:</strong> {po.notes}
            </div>
          )} */}
        </div>

        <div style={{ border: '1px solid #E2E8F0', borderRadius: 8, padding: '12px 16px', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6, color: '#000' }}>
            <span>Subtotal:</span>
            <strong style={{ color: '#0F0F1A' }}>{formatRp(subtotal)}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8, color: '#000' }}>
            <span>PPN (12%):</span>
            <strong style={{ color: '#0F0F1A' }}>{formatRp(ppn)}</strong>
          </div>
          <div style={{ borderTop: '2px solid #E2E8F0', paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#0F0F1A' }}>Total Akhir:</span>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#000' }}>{formatRp(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* ── TANDA TANGAN ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, textAlign: 'center', fontSize: 11 }}>
        <div>
          <div style={{ color: '#64748B', marginBottom: 50 }}>Dikonfirmasi Vendor,</div>
          <div style={{ borderTop: '1px solid #94A3B8', paddingTop: 4, fontWeight: 700, color: '#0F0F1A' }}>
            ( {po.vendor.name} )
          </div>
          <div style={{ color: '#64748B', fontSize: 10 }}>Meterai &amp; Stempel Perusahaan</div>
        </div>

        <div>
          <div style={{ color: '#64748B', marginBottom: 50 }}>Dibuat Oleh,</div>
          <div style={{ borderTop: '1px solid #94A3B8', paddingTop: 4, fontWeight: 700, color: '#0F0F1A' }}>
            ( {po.preparedBy?.name || 'Admin Procurement'} )
          </div>
          <div style={{ color: '#64748B', fontSize: 10 }}>{po.preparedBy?.role || 'Staff Pengadaan'}</div>
        </div>

        <div>
          <div style={{ color: '#64748B', marginBottom: 50 }}>Disetujui Oleh,</div>
          <div style={{ borderTop: '1px solid #94A3B8', paddingTop: 4, fontWeight: 700, color: '#0F0F1A' }}>
            ( {po.approvedBy?.name || 'Bapak Santoso'} )
          </div>
          <div style={{ color: '#64748B', fontSize: 10 }}>{po.approvedBy?.role || 'Procurement / GM Manager'}</div>
        </div>
      </div>
    </div>
  )
})

POTemplate.displayName = 'POTemplate'
export default POTemplate
