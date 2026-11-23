/**
 * Lightweight export utilities — no external library needed.
 * Supports CSV and basic XLSX (Office Open XML).
 */

// ─── CSV ───────────────────────────────────────────────────────────────────────

function escapeCsv(val: unknown): string {
  const str = val === null || val === undefined ? '' : String(val)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function exportToCsv(filename: string, headers: string[], rows: unknown[][]): void {
  const lines = [
    headers.map(escapeCsv).join(','),
    ...rows.map(row => row.map(escapeCsv).join(',')),
  ]
  const blob = new Blob(['\uFEFF' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' })
  triggerDownload(blob, `${filename}.csv`)
}

// ─── XLSX (minimal Office Open XML) ──────────────────────────────────────────

function xlsxEscape(val: unknown): string {
  const str = val === null || val === undefined ? '' : String(val)
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function colLetter(n: number): string {
  let s = ''
  while (n >= 0) {
    s = String.fromCharCode((n % 26) + 65) + s
    n = Math.floor(n / 26) - 1
  }
  return s
}

export function exportToXlsx(filename: string, headers: string[], rows: unknown[][]): void {
  const allRows = [headers, ...rows]
  const sheetXml = allRows
    .map((row, ri) => {
      const cells = row
        .map((val, ci) => {
          const ref = `${colLetter(ci)}${ri + 1}`
          const isHeader = ri === 0
          const isNum = typeof val === 'number'
          if (isNum) {
            return `<c r="${ref}" s="${isHeader ? '1' : '0'}"><v>${val}</v></c>`
          }
          return `<c r="${ref}" t="inlineStr" s="${isHeader ? '1' : '0'}"><is><t>${xlsxEscape(val)}</t></is></c>`
        })
        .join('')
      return `<row r="${ri + 1}">${cells}</row>`
    })
    .join('')

  // Minimal XLSX: single sheet, bold header style
  const xl = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <sheets><sheet name="Sheet1" sheetId="1" r:id="rId1"/></sheets>
</workbook>`

  const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <fonts><font/><font><b/></font></fonts>
  <fills><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>
  <borders><border><left/><right/><top/><bottom/><diagonal/></border></borders>
  <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
  <cellXfs>
    <xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
    <xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0"/>
  </cellXfs>
</styleSheet>`

  const sheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
  <sheetData>${sheetXml}</sheetData>
</worksheet>`

  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`

  const appRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`

  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
  <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
  <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`

  // Build ZIP manually using a simple approach
  const files: Record<string, string> = {
    '[Content_Types].xml': contentTypes,
    '_rels/.rels': appRels,
    'xl/workbook.xml': xl,
    'xl/_rels/workbook.xml.rels': rels,
    'xl/worksheets/sheet1.xml': sheet,
    'xl/styles.xml': styles,
  }

  // Use JSZip-compatible approach via raw bytes
  // We'll fall back to CSV in environments without JSZip
  try {
    buildAndDownloadZip(files, `${filename}.xlsx`)
  } catch {
    // fallback to CSV
    exportToCsv(filename, headers, rows)
  }
}

// ─── Minimal ZIP builder ────────────────────────────────────────────────────

function str2bytes(str: string): Uint8Array {
  return new TextEncoder().encode(str)
}

function crc32(data: Uint8Array): number {
  const table = makeCrcTable()
  let crc = 0xFFFFFFFF
  for (let i = 0; i < data.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ data[i]) & 0xFF]
  }
  return (crc ^ 0xFFFFFFFF) >>> 0
}

let _crcTable: number[] | null = null
function makeCrcTable(): number[] {
  if (_crcTable) return _crcTable
  _crcTable = []
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
    _crcTable[n] = c
  }
  return _crcTable
}

function u16le(n: number): Uint8Array {
  return new Uint8Array([n & 0xFF, (n >> 8) & 0xFF])
}
function u32le(n: number): Uint8Array {
  return new Uint8Array([n & 0xFF, (n >> 8) & 0xFF, (n >> 16) & 0xFF, (n >> 24) & 0xFF])
}

function concat(...arrays: Uint8Array[]): Uint8Array {
  const total = arrays.reduce((s, a) => s + a.length, 0)
  const out = new Uint8Array(total)
  let pos = 0
  for (const a of arrays) { out.set(a, pos); pos += a.length }
  return out
}

function buildAndDownloadZip(files: Record<string, string>, zipName: string): void {
  const enc = new TextEncoder()
  const localHeaders: Uint8Array[] = []
  const centralHeaders: Uint8Array[] = []
  let offset = 0

  for (const [name, content] of Object.entries(files)) {
    const data = enc.encode(content)
    const nameBytes = enc.encode(name)
    const crc = crc32(data)
    const size = data.length

    // Local file header
    const localHeader = concat(
      new Uint8Array([0x50, 0x4B, 0x03, 0x04]), // signature
      u16le(20),        // version needed
      u16le(0),         // flags
      u16le(0),         // compression (store)
      u16le(0), u16le(0), // mod time, date
      u32le(crc),
      u32le(size),      // compressed size
      u32le(size),      // uncompressed size
      u16le(nameBytes.length),
      u16le(0),         // extra field length
      nameBytes,
      data,
    )
    localHeaders.push(localHeader)

    // Central directory header
    const centralHeader = concat(
      new Uint8Array([0x50, 0x4B, 0x01, 0x02]),
      u16le(20), u16le(20),
      u16le(0),
      u16le(0),
      u16le(0), u16le(0),
      u32le(crc),
      u32le(size),
      u32le(size),
      u16le(nameBytes.length),
      u16le(0), u16le(0),
      u16le(0), u16le(0),
      u32le(0),
      u32le(offset),
      nameBytes,
    )
    centralHeaders.push(centralHeader)
    offset += localHeader.length
  }

  const centralDir = concat(...centralHeaders)
  const eocd = concat(
    new Uint8Array([0x50, 0x4B, 0x05, 0x06]),
    u16le(0), u16le(0),
    u16le(centralHeaders.length),
    u16le(centralHeaders.length),
    u32le(centralDir.length),
    u32le(offset),
    u16le(0),
  )

  const zip = concat(...localHeaders, centralDir, eocd)
  const blob = new Blob([zip], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  triggerDownload(blob, zipName)
}

// ─── Shared download trigger ─────────────────────────────────────────────────

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
