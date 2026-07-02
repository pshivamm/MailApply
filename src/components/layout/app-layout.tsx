import { useState, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar } from '@/components/layout/sidebar'
import { Navbar } from '@/components/layout/navbar'
import { ErrorBoundary } from '@/components/shared/error-boundary'
import { cn } from '@/lib/utils'

export function AppLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const location = useLocation()

  const handleToggle = useCallback(() => {
    setIsCollapsed((prev) => !prev)
  }, [])

  const handleMobileClose = useCallback(() => {
    setIsMobileOpen(false)
  }, [])

  const handleMenuClick = useCallback(() => {
    setIsMobileOpen((prev) => !prev)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      <Sidebar
        isCollapsed={isCollapsed}
        onToggle={handleToggle}
        isMobileOpen={isMobileOpen}
        onMobileClose={handleMobileClose}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar onMenuClick={handleMenuClick} onSidebarToggle={handleToggle} />

        <main
          className={cn(
            'flex-1 overflow-y-auto p-4 md:p-6 lg:p-8',
            'bg-gray-50 dark:bg-gray-900'
          )}
        >
          <ErrorBoundary>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  )
}
