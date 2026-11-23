import { Suspense } from 'react'
import DashboardShell from '@/components/DashboardShell'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="loading-spinner" />}>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  )
}
