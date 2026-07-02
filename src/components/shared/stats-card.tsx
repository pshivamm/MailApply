import { type ComponentType, type SVGAttributes } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  icon: ComponentType<SVGAttributes<SVGSVGElement>>
  label: string
  value: number
  formatValue?: (value: number) => string
  trend?: {
    value: number
    isUp: boolean
  }
  subtitle?: string
  accentColor?: string
  className?: string
}

export function StatsCard({
  icon: Icon,
  label,
  value,
  formatValue,
  trend,
  subtitle,
  accentColor = 'from-blue-500 to-blue-600',
  className,
}: StatsCardProps) {
  const displayValue = formatValue ? formatValue(value) : value.toLocaleString()

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 12px 24px -8px rgba(0,0,0,0.15)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900',
        className
      )}
    >
      <div className={cn('h-1 w-full bg-gradient-to-r', accentColor)} />

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <Icon className="h-5 w-5" />
          </div>

          {trend && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold',
                trend.isUp
                  ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              )}
            >
              <span>{trend.isUp ? '↑' : '↓'}</span>
              {Math.abs(trend.value)}%
            </span>
          )}
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
          <div className="mt-1 flex items-baseline gap-2">
            <p className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {displayValue}
            </p>
            {subtitle && (
              <span className="text-xs text-gray-400 dark:text-gray-500">{subtitle}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
