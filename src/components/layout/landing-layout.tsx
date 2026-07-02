import type { ReactNode } from 'react'

export function LandingLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-white dark:bg-gray-950">{children}</div>
}
