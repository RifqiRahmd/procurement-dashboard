'use client'
import { useState, useRef, use } from 'react'
import Link from 'next/link'
import { ArrowLeft, Printer, Download, Settings, RefreshCw, CheckCircle, Clock } from 'lucide-react'
import POTemplate, { PODocumentData, defaultCompanyConfig, POCompanyConfig } from '@/components/documents/POTemplate'
import { formatRp } from '@/lib/format'

// Mock database data
const samplePODatabase: Record<string, PODocumentData> = {
  'PO-2026-052': {
    id: 'PO-2026-052',
    prId: 'PR-2026-087',
    vendor: {
      name: 'PT Maju Jaya',
      address: 'Jl. Daan Mogot No. 45, Jakarta Barat 11510',
      phone: '021-55123456',
      email: 'sales@majujaya.co.id',
      contactPerson: 'Bpk. Hendra Gunawan',
    },
    orderDate: '2026-11-16',
    deliveryDate: '2026-11-30',
    paymentTerms: 'Net 30 Hari',
    shippingAddress: 'Gudang DC Pusat, Pergudangan Infinia Park Blok C-12, Jakarta Selatan',
    notes: 'Harap sertakan serial number dan garansi resmi distributor 3 tahun.',
    totalAmount: 320000000,
    items: [
      { no: 1, description: 'Server Dell PowerEdge R750 Rackmount (Xeon Silver, 64GB RAM, 2x 1.2TB SAS)', qty: 2, unit: 'Unit', unitPrice: 110000000, total: 220000000 },
      { no: 2, description: 'Cisco Catalyst 9200 48-Port PoE+ Gigabit Switch', qty: 2, unit: 'Unit', unitPrice: 35000000, total: 70000000 },
      { no: 3, description: 'APC Smart-UPS On-Line 3000VA RM 230V', qty: 2, unit: 'Unit', unitPrice: 15000000, total: 30000000 },
    ],
    preparedBy: { name: 'Admin Procurement', role: 'Staff Pengadaan IT' },
    approvedBy: { name: 'Dewi Kartika, S.E.', role: 'Head of Finance & Procurement' },
  },
  'PO-2026-051': {
    id: 'PO-2026-051',
    prId: 'PR-2026-086',
    vendor: {
      name: 'CV Sukses Makmur',
      address: 'Jl. Riau No. 18, Bandung 40115',
      phone: '022-71234567',
      email: 'cv.sukses@gmail.com',
      contactPerson: 'Ibu Ratna',
    },
    orderDate: '2026-11-14',
    deliveryDate: '2026-11-20',
    paymentTerms: 'Net 14 Hari',
    shippingAddress: 'Kantor Operasional GA, Menara Mandiri Lt. 18',
    notes: 'Kirim saat jam kerja kantor (09.00 - 16.00 WIB).',
    totalAmount: 12500000,
    items: [
      { no: 1, description: 'Vacuum Cleaner Heavy Duty Industri 30L', qty: 2, unit: 'Unit', unitPrice: 3500000, total: 7000000 },
      { no: 2, description: 'Cairan Pembersih Lantai Disinfektan 5L', qty: 10, unit: 'Jerigen', unitPrice: 150000, total: 1500000 },
      { no: 3, description: 'Alat Pel Microfiber & Spare Mop', qty: 20, unit: 'Set', unitPrice: 200000, total: 4000000 },
    ],
    preparedBy: { name: 'Admin Procurement', role: 'Staff GA Procurement' },
    approvedBy: { name: 'Bapak Santoso', role: 'General Manager' },
  },
}

export default function PODetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const poId = resolvedParams.id

  const [company, setCompany] = useState<POCompanyConfig>(defaultCompanyConfig)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  // Get data or fallback
  const po = samplePODatabase[poId] || {
    id: poId,
    prId: 'PR-2026-085',
    vendor: { name: 'PT Indo Supplies', phone: '031-45678901', email: 'sales@indosupplies.id' },
    orderDate: '2026-11-13',
    deliveryDate: '2026-11-28',
    paymentTerms: 'Net 30 Hari',
    shippingAddress: 'Gudang Logistik Pusat',
    totalAmount: 32500000,
    items: [
      { no: 1, description: 'Sepatu Safety Boots Krisbow Steel Toe Cap', qty: 25, unit: 'Pasang', unitPrice: 700000, total: 17500000 },
      { no: 2, description: 'Helm Safety Proyek V-Gard + Chinstrap', qty: 50, unit: 'Pcs', unitPrice: 150000, total: 7500000 },
      { no: 3, description: 'Rompi Reflektif Keselamatan K3', qty: 50, unit: 'Pcs', unitPrice: 150000, total: 7500000 },
    ],
    preparedBy: { name: 'Admin Procurement', role: 'Staff Logistik' },
    approvedBy: { name: 'Dewi Kartika', role: 'Finance Manager' },
  }

  // Cetak dokumen menggunakan print dialog browser
  const handlePrint = () => {
    window.print()
  }

  // Unduh dokumen PDF langsung via jspdf & html2canvas
  const handleDownloadPdf = async () => {
    if (!printRef.current) return
    setIsExporting(true)

    try {
      const html2canvas = (await import('html2canvas')).default
      const { jsPDF } = await import('jspdf')

      const element = printRef.current
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.95)
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210 // A4 width mm
      const pageHeight = 297 // A4 height mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, Math.min(imgHeight, pageHeight))
      pdf.save(`${po.id}-Dokumen-PO.pdf`)
    } catch (err) {
      console.error('Error generating PDF:', err)
      // Fallback to print dialog
      window.print()
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 60 }}>
      {/* ── TOP NAV & ACTIONS ── */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/purchase-order" className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <ArrowLeft size={15} /> Kembali ke PO
          </Link>
          <div>
            <h1 className="page-title" style={{ fontSize: 18, marginBottom: 2 }}>{po.id}</h1>
            <p className="page-desc" style={{ fontSize: 12 }}>Preview &amp; Cetak Template Dokumen Purchase Order</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowConfigModal(true)}
            title="Kustomisasi Kop &amp; Logo Perusahaan"
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Settings size={14} /> Atur Template
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={handlePrint}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <Printer size={14} /> Cetak / Print
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={handleDownloadPdf}
            disabled={isExporting}
            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
          >
            {isExporting ? <RefreshCw size={14} className="spin" /> : <Download size={14} />}
            {isExporting ? 'Memproses PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* ── PREVIEW BANNER HELPER ── */}
      <div className="card no-print" style={{ padding: '12px 18px', marginBottom: 20, background: 'var(--primary-bg)', borderColor: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 12, color: 'var(--text-primary)' }}>
          💡 <strong>Tips Template Dokumen:</strong> Anda dapat mengubah nama instansi/PT, alamat kantor, email, dan telepon melalui tombol <strong>&quot;Atur Template&quot;</strong> di kanan atas sebelum mengunduh atau mencetak dokumen ini.
        </div>
      </div>

      {/* ── LEMBAR DOKUMEN PREVIEW ── */}
      <div style={{ background: 'var(--bg-tertiary)', padding: '24px 12px', borderRadius: 16, overflowX: 'auto' }}>
        <POTemplate ref={printRef} po={po} company={company} />
      </div>

      {/* ── MODAL ATUR TEMPLATE DOKUMEN ── */}
      {showConfigModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setShowConfigModal(false)}>
          <div className="modal modal-md">
            <div className="modal-header">
              <h2 className="modal-title">Sesuaikan Template Dokumen PO</h2>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowConfigModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Nama Perusahaan / PT</label>
                <input
                  className="form-control"
                  value={company.name}
                  onChange={e => setCompany(c => ({ ...c, name: e.target.value }))}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Alamat Kantor</label>
                <input
                  className="form-control"
                  value={company.address}
                  onChange={e => setCompany(c => ({ ...c, address: e.target.value }))}
                />
              </div>

              <div className="form-grid form-grid-2">
                <div className="form-group">
                  <label className="form-label">Kota &amp; Kode Pos</label>
                  <input
                    className="form-control"
                    value={company.city}
                    onChange={e => setCompany(c => ({ ...c, city: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nomor NPWP Perusahaan</label>
                  <input
                    className="form-control"
                    value={company.npwp || ''}
                    onChange={e => setCompany(c => ({ ...c, npwp: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-grid form-grid-2">
                <div className="form-group">
                  <label className="form-label">Nomor Telepon</label>
                  <input
                    className="form-control"
                    value={company.phone}
                    onChange={e => setCompany(c => ({ ...c, phone: e.target.value }))}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Procurement</label>
                  <input
                    className="form-control"
                    value={company.email}
                    onChange={e => setCompany(c => ({ ...c, email: e.target.value }))}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setCompany(defaultCompanyConfig)
                  setShowConfigModal(false)
                }}
              >
                Reset Default
              </button>
              <button className="btn btn-primary" onClick={() => setShowConfigModal(false)}>
                Simpan &amp; Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
