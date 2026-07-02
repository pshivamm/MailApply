import { useMemo } from 'react'
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
  LineChart,
  Line,
} from 'recharts'
import {
  Briefcase,
  MessageCircle,
  UserCheck,
  Award,
  Clock,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Activity,
} from '@/lib/icons'
import { StatsCard } from '@/components/shared/stats-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { mockAnalytics } from '@/lib/mock-data'
import { cn } from '@/lib/utils'
import { useTheme } from '@/contexts/theme-context'

const PIE_COLORS = ['#2563EB', '#60A5FA', '#3B82F6', '#22C55E', '#F59E0B', '#EF4444', '#8B5CF6']

const TEMPLATE_NAMES = ['SWE Application', 'PM Role', 'Internship', 'Follow Up', 'Cold Outreach', 'Other']

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

interface ChartTooltipProps {
  active?: boolean
  payload?: { name?: string; value?: number; color?: string }[]
  label?: string
}

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-gray-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-sm dark:border-gray-700 dark:bg-gray-900/95">
      {label && (
        <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">{label}</p>
      )}
      {payload.map((entry, i) => (
        <p key={i} className="text-sm font-semibold text-gray-900 dark:text-gray-100">
          {entry.name ? `${entry.name}: ` : ''}{entry.value}
        </p>
      ))}
    </div>
  )
}

function TotalLabel({ cx, cy }: { cx: number; cy: number }) {
  const total = mockAnalytics.sourceDistribution.reduce((sum, s) => sum + s.count, 0)
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
      <tspan x={cx} dy="-6" className="fill-foreground" fontSize="28" fontWeight="700">
        {total}
      </tspan>
      <tspan x={cx} dy="20" className="fill-muted-foreground" fontSize="12" fontWeight="500">
        Total
      </tspan>
    </text>
  )
}

export default function AnalyticsPage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const textColor = isDark ? '#9CA3AF' : '#6B7280'
  const gridColor = isDark ? '#374151' : '#E5E7EB'

  const templateData = useMemo(
    () =>
      mockAnalytics.sourceDistribution.map((item, i) => ({
        ...item,
        template: TEMPLATE_NAMES[i] || item.source,
      })),
    [],
  )

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Analytics
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Your job application insights
        </p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
      >
        <StatsCard
          icon={Briefcase}
          label="Total Applications"
          value={mockAnalytics.stats.applications}
          accentColor="from-blue-500 to-blue-600"
        />
        <StatsCard
          icon={MessageCircle}
          label="Responses"
          value={mockAnalytics.stats.responses}
          accentColor="from-green-500 to-green-600"
        />
        <StatsCard
          icon={UserCheck}
          label="Interviews"
          value={mockAnalytics.stats.interviews}
          accentColor="from-purple-500 to-purple-600"
        />
        <StatsCard
          icon={Award}
          label="Offers"
          value={mockAnalytics.stats.offers}
          accentColor="from-amber-500 to-amber-600"
        />
        <StatsCard
          icon={Clock}
          label="Pending"
          value={mockAnalytics.stats.pending}
          accentColor="from-rose-500 to-rose-600"
        />
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="grid gap-6 lg:grid-cols-2"
      >
        <Card className="rounded-2xl border-gray-200 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <BarChart3 className="h-4 w-4" />
              </span>
              Monthly Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockAnalytics.applicationsByMonth} barSize={36}>
                  <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: textColor, fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: textColor, fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: isDark ? '#1F2937' : '#F3F4F6' }} />
                  <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                <PieChartIcon className="h-4 w-4" />
              </span>
              Source Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockAnalytics.sourceDistribution}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="count"
                  >
                    {mockAnalytics.sourceDistribution.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <TotalLabel cx={0} cy={0} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-x-5 gap-y-1.5">
              {mockAnalytics.sourceDistribution.map((item, i) => (
                <div key={item.source} className="flex items-center gap-1.5 text-xs">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                  />
                  <span className="text-gray-600 dark:text-gray-400">{item.source}</span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Activity className="h-4 w-4" />
              </span>
              Templates Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={templateData}
                  layout="vertical"
                  barSize={20}
                  margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid stroke={gridColor} strokeDasharray="3 3" horizontal={false} />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: textColor, fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <YAxis
                    dataKey="template"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: textColor, fontSize: 12 }}
                    width={100}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: isDark ? '#1F2937' : '#F3F4F6' }} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {templateData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-gray-200 shadow-sm dark:border-gray-800 dark:bg-gray-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                <TrendingUp className="h-4 w-4" />
              </span>
              Applications Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockAnalytics.emailSentTrend}>
                  <defs>
                    <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: textColor, fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: textColor, fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#2563EB"
                    strokeWidth={2}
                    dot={{ fill: '#2563EB', strokeWidth: 2, r: 4, stroke: '#fff' }}
                    activeDot={{ r: 6, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
