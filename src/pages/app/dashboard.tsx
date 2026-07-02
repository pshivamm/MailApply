import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import {
  Briefcase,
  FileText,
  Send,
  Percent,
  FileSpreadsheet,
  SendHorizontal,
  ChevronRight,
} from '@/lib/icons'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { mockAnalytics } from '@/lib/mock-data'
import { getApplications } from '@/lib/store'
import { StatsCard } from '@/components/shared/stats-card'
import { cn, formatDateShort } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

const PIE_COLORS = ['#2563EB', '#60A5FA', '#3B82F6', '#22C55E', '#F59E0B', '#EF4444']

const statusStyles: Record<string, string> = {
  Applied: 'border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  Viewed: 'border-transparent bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
  Interview:
    'border-transparent bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  Offer: 'border-transparent bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  Rejected: 'border-transparent bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  Pending:
    'border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
}

const activityDotColors: Record<string, string> = {
  Applied: 'bg-blue-500',
  Interview: 'bg-purple-500',
  Viewed: 'bg-gray-500',
  Offer: 'bg-green-500',
  Rejected: 'bg-red-500',
}

export default function DashboardPage() {
  const applications = getApplications()
  const recentApps = applications.slice(0, 5)
  const { applicationsByMonth, sourceDistribution, recentActivity } = mockAnalytics

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Your job application overview
        </p>
      </div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={itemVariants}>
          <StatsCard
            icon={Briefcase}
            label="Total Applications"
            value={mockAnalytics.totalApplications}
            trend={{ value: 12, isUp: true }}
            accentColor="from-blue-500 to-blue-600"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard
            icon={FileText}
            label="Total Templates"
            value={mockAnalytics.totalTemplates}
            subtitle="+2 this month"
            accentColor="from-violet-500 to-violet-600"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard
            icon={Send}
            label="Emails Sent"
            value={mockAnalytics.emailsSent}
            trend={{ value: 8, isUp: true }}
            accentColor="from-emerald-500 to-emerald-600"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard
            icon={Percent}
            label="Success Rate"
            value={mockAnalytics.successRate}
            formatValue={(v) => `${v}%`}
            trend={{ value: 5, isUp: true }}
            accentColor="from-amber-500 to-amber-600"
          />
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" asChild>
          <Link to="/app/templates">
            <FileText className="h-4 w-4" />
            Create Template
          </Link>
        </Button>
        <Button asChild>
          <Link to="/app/new-apply">
            <SendHorizontal className="h-4 w-4" />
            New Apply
          </Link>
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast.success('Exporting...')}
        >
          <FileSpreadsheet className="h-4 w-4" />
          Export Excel
        </Button>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Applications by Month */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
            Applications by Month
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={applicationsByMonth}
                margin={{ top: 5, right: 5, left: -15, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  className="dark:opacity-20"
                />
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  className="dark:fill-gray-400"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                  className="dark:fill-gray-400"
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    backgroundColor: 'var(--tooltip-bg, #fff)',
                  }}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.08)' }}
                />
                <Bar
                  dataKey="count"
                  radius={[6, 6, 0, 0]}
                  fill="#3B82F6"
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Job Source Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
            Job Source Breakdown
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceDistribution}
                  dataKey="count"
                  nameKey="source"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={3}
      label={({ name, percent }) =>
    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
  }
                  labelLine={false}
                >
                  {sourceDistribution.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    backgroundColor: 'var(--tooltip-bg, #fff)',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Recent Applications
            </h3>
            <Link
              to="/app/my-applies"
              className="flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              View all
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentApps.length === 0 ? (
              <p className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
                No applications yet
              </p>
            ) : (
              recentApps.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                      {app.company}
                    </p>
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {app.position}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                      {formatDateShort(app.appliedDate)}
                    </p>
                  </div>
                  <Badge
                    variant="default"
                    className={cn(statusStyles[app.status] || '', 'ml-3 shrink-0')}
                  >
                    {app.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
        >
          <h3 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h3>
          <div className="space-y-0">
            {recentActivity.map((activity, index) => (
              <div key={index} className="relative flex gap-4 pb-6 last:pb-0">
                {index < recentActivity.length - 1 && (
                  <div className="absolute left-[7px] top-3 h-full w-px bg-gray-200 dark:bg-gray-700" />
                )}
                <div
                  className={cn(
                    'relative mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full ring-4 ring-white dark:ring-gray-900',
                    activityDotColors[activity.action] || 'bg-gray-400'
                  )}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                    {activity.detail}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400 dark:text-gray-500">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
