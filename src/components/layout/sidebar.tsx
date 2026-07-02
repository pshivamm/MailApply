import { useEffect, useCallback } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FileText,
  SendHorizontal,
  Briefcase,
  BarChart3,
  UserCircle,
  Settings,
  LogOut,
} from '@/lib/icons'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/auth-context'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  isMobileOpen: boolean
  onMobileClose: () => void
}

const navItems = [
  { label: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
  { label: 'Templates', href: '/app/templates', icon: FileText },
  { label: 'New Apply', href: '/app/new-apply', icon: SendHorizontal },
  { label: 'My Applies', href: '/app/my-applies', icon: Briefcase },
  { label: 'Analytics', href: '/app/analytics', icon: BarChart3 },
  { label: 'Profile', href: '/app/profile', icon: UserCircle },
  { label: 'Settings', href: '/app/settings', icon: Settings },
]

export function Sidebar({ isCollapsed, onToggle, isMobileOpen, onMobileClose }: SidebarProps) {
  const location = useLocation()
  const { logout } = useAuth()

  const isActive = useCallback(
    (href: string) => {
      if (href === '/app/dashboard') {
        return location.pathname === href
      }
      return location.pathname.startsWith(href)
    },
    [location.pathname]
  )

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen])

  const sidebarContent = (
    <div
      className={cn(
        'flex h-full flex-col bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800',
        isCollapsed ? 'items-center' : ''
      )}
    >
      <div
        className={cn(
          'flex h-16 items-center border-b border-gray-200 dark:border-gray-800',
          isCollapsed ? 'justify-center px-2' : 'px-4'
        )}
      >
        <Link to="/app/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-white text-sm font-bold">
            <img src="/logo.png" alt="MailApply Logo" />
          </div>
          {!isCollapsed && <span className="text-lg font-bold text-gray-900 dark:text-white">MailApply</span>}
        </Link>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {navItems.map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => {
                if (isMobileOpen) onMobileClose()
              }}
              className={cn(
                'group flex items-center rounded-lg text-sm font-medium transition-all duration-200',
                isCollapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2',
                active
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100'
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon
                className={cn(
                  'h-5 w-5 shrink-0 transition-colors',
                  active
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'
                )}
              />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className={cn('border-t border-gray-200 p-2 dark:border-gray-800', isCollapsed ? 'flex justify-center' : '')}>
        <button
          onClick={() => {
            logout()
            if (isMobileOpen) onMobileClose()
          }}
          className={cn(
            'group flex w-full items-center rounded-lg text-sm font-medium transition-all duration-200 text-gray-600 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-950/50 dark:hover:text-red-400',
            isCollapsed ? 'justify-center p-2' : 'gap-3 px-3 py-2'
          )}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-red-500 dark:text-gray-500 dark:group-hover:text-red-400" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 64 : 240 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="hidden h-screen flex-shrink-0 md:block sticky top-0 overflow-hidden"
      >
        {sidebarContent}
      </motion.aside>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="fixed inset-y-0 left-0 z-50 w-64 md:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
