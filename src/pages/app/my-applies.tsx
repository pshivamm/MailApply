import { useState, useMemo, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Search, Trash2, FileSpreadsheet, Download, Briefcase, FilterX } from '@/lib/icons'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import * as XLSX from 'xlsx'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { EmptyState } from '@/components/ui/empty-state'
import { DataTable } from '@/components/shared/data-table'
import { Pagination } from '@/components/ui/pagination'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { getApplications, setApplications } from '@/lib/store'
import { mockApplications } from '@/lib/mock-data'
import { cn, formatDate } from '@/lib/utils'
import type { Application, ApplicationStatus, JobSource } from '@/types'
import type { ColumnDef } from '@tanstack/react-table'

const STATUSES: ApplicationStatus[] = ['Applied', 'Viewed', 'Interview', 'Offer', 'Rejected', 'Pending']
const SOURCES: JobSource[] = ['LinkedIn', 'Naukri', 'Indeed', 'Cutshort', 'Company Website', 'Internshala', 'Other']

const statusBadgeConfig: Record<ApplicationStatus, { variant: 'default' | 'secondary' | 'success' | 'warning' | 'danger'; className?: string }> = {
  Applied: { variant: 'default' },
  Viewed: { variant: 'secondary' },
  Interview: { variant: 'default', className: 'bg-violet-100 text-violet-800 dark:bg-violet-900/50 dark:text-violet-300 border-violet-200 dark:border-violet-800' },
  Offer: { variant: 'success' },
  Rejected: { variant: 'danger' },
  Pending: { variant: 'warning' },
}

const sourceBadgeConfig: Record<JobSource, { variant: 'default' | 'secondary' | 'success' | 'warning' | 'danger' | 'outline'; className?: string }> = {
  LinkedIn: { variant: 'default' },
  Naukri: { variant: 'warning', className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300 border-orange-200 dark:border-orange-800' },
  Indeed: { variant: 'default' },
  Cutshort: { variant: 'default', className: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 border-purple-200 dark:border-purple-800' },
  'Company Website': { variant: 'success' },
  Internshala: { variant: 'default', className: 'bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300 border-teal-200 dark:border-teal-800' },
  Other: { variant: 'secondary' },
}

function StatusBadge({ status }: { status: ApplicationStatus }) {
  const config = statusBadgeConfig[status]
  return <Badge variant={config.variant} className={cn('capitalize', config.className)}>{status}</Badge>
}

function SourceBadge({ source }: { source: JobSource }) {
  const config = sourceBadgeConfig[source]
  return <Badge variant={config.variant} className={cn('capitalize', config.className)}>{source}</Badge>
}

const PER_PAGE = 10

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
}

export default function MyAppliesPage() {
  const navigate = useNavigate()
  const [applications, setLocalApplications] = useState<Application[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sourceFilter, setSourceFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState<Application | null>(null)

  useEffect(() => {
    const stored = getApplications()
    if (stored.length === 0) {
      setApplications(mockApplications)
      setLocalApplications(mockApplications)
    } else {
      setLocalApplications(stored)
    }
  }, [])

  const hasActiveFilters = searchQuery || statusFilter !== 'All' || sourceFilter !== 'All'

  const filtered = useMemo(() => {
    let result = [...applications]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        (a) =>
          a.company.toLowerCase().includes(q) ||
          a.position.toLowerCase().includes(q) ||
          a.location.toLowerCase().includes(q)
      )
    }

    if (statusFilter !== 'All') {
      result = result.filter((a) => a.status === statusFilter)
    }

    if (sourceFilter !== 'All') {
      result = result.filter((a) => a.source === sourceFilter)
    }

    return result
  }, [applications, searchQuery, statusFilter, sourceFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const safePage = Math.min(page, totalPages)
  const paginatedData = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE)

  useEffect(() => {
    if (safePage !== page) setPage(safePage)
  }, [safePage, page])

  const handleDelete = useCallback((id: string) => {
    const updated = applications.filter((a) => a.id !== id)
    setLocalApplications(updated)
    setApplications(updated)
    setDeleteTarget(null)
    toast.success('Application deleted')
  }, [applications])

  const clearFilters = useCallback(() => {
    setSearchQuery('')
    setStatusFilter('All')
    setSourceFilter('All')
    setPage(1)
  }, [])

  const exportToExcel = useCallback(() => {
    const data = filtered.map((a) => ({
      Company: a.company,
      Email: a.email,
      Position: a.position,
      Location: a.location,
      Source: a.source,
      Template: a.templateName,
      'Applied Date': a.appliedDate,
      Status: a.status,
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Applications')
    XLSX.writeFile(wb, 'applications.xlsx')
    toast.success('Excel file downloaded')
  }, [filtered])

  const exportToCSV = useCallback(() => {
    const headers = ['Company', 'Email', 'Position', 'Location', 'Source', 'Template', 'Applied Date', 'Status']
    const rows = filtered.map((a) => [
      a.company,
      a.email,
      a.position,
      a.location,
      a.source,
      a.templateName,
      a.appliedDate,
      a.status,
    ])
    const csv = [headers.join(','), ...rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'applications.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('CSV file downloaded')
  }, [filtered])

  const stats = useMemo(() => {
    const total = applications.length
    const applied = applications.filter((a) => a.status === 'Applied').length
    const interview = applications.filter((a) => a.status === 'Interview').length
    const offer = applications.filter((a) => a.status === 'Offer').length
    const rejected = applications.filter((a) => a.status === 'Rejected').length
    return { total, applied, interview, offer, rejected }
  }, [applications])

  const columns: ColumnDef<Application>[] = useMemo(
    () => [
      {
        accessorKey: 'company',
        header: 'Company',
        meta: { className: 'min-w-[120px]' },
        cell: ({ row }) => (
          <div className="min-w-0">
            <span className="font-semibold text-gray-900 dark:text-white block truncate max-w-[140px]">
              {row.original.company}
            </span>
          </div>
        ),
      },
      {
        accessorKey: 'position',
        header: 'Position',
        meta: { className: 'hidden sm:table-cell' },
        cell: ({ row }) => (
          <span className="truncate block max-w-[160px] text-gray-700 dark:text-gray-300">
            {row.original.position}
          </span>
        ),
      },
      {
        accessorKey: 'source',
        header: 'Source',
        meta: { className: 'hidden md:table-cell' },
        cell: ({ row }) => <SourceBadge source={row.original.source} />,
      },
      {
        accessorKey: 'appliedDate',
        header: 'Date',
        meta: { className: 'hidden lg:table-cell' },
        cell: ({ row }) => (
          <span className="text-gray-500 dark:text-gray-400">{formatDate(row.original.appliedDate)}</span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        meta: { className: 'min-w-[90px]' },
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: 'actions',
        header: '',
        meta: { className: 'w-12' },
        cell: ({ row }) => (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
              onClick={() => setDeleteTarget(row.original)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  )

  if (applications.length === 0) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-6xl"
      >
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            My Applications
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track all your job applications
          </p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <EmptyState
            icon={<Briefcase className="h-12 w-12" />}
            title="No applications yet"
            description="Get started by creating your first job application."
            action={{
              label: 'Create your first application',
              onClick: () => navigate('/app/new-apply'),
            }}
          />
        </motion.div>
      </motion.div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-6xl"
    >
      <motion.div variants={itemVariants} className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            My Applications
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Track all your job applications
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={exportToExcel}>
            <FileSpreadsheet className="h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: 'Total', value: stats.total, color: 'from-blue-500 to-blue-600' },
          { label: 'Applied', value: stats.applied, color: 'from-blue-400 to-blue-500' },
          { label: 'Interview', value: stats.interview, color: 'from-violet-500 to-violet-600' },
          { label: 'Offer', value: stats.offer, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Rejected', value: stats.rejected, color: 'from-red-500 to-red-600' },
        ].map((stat) => (
          <Card key={stat.label} className="overflow-hidden">
            <div className={cn('h-1 w-full bg-gradient-to-r', stat.color)} />
            <CardContent className="p-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className=" h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Search by company, position, location..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            className="h-10 pl-10"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(v) => {
            setStatusFilter(v)
            setPage(1)
          }}
        >
          <SelectTrigger className="h-10 w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Status</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={sourceFilter}
          onValueChange={(v) => {
            setSourceFilter(v)
            setPage(1)
          }}
        >
          <SelectTrigger className="h-10 w-[160px]">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Sources</SelectItem>
            {SOURCES.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters} className="h-10 gap-1.5">
            <FilterX className="h-4 w-4" />
            Clear
          </Button>
        )}
      </motion.div>

      <motion.div variants={itemVariants}>
        {filtered.length === 0 ? (
          <EmptyState
            icon={<Search className="h-12 w-12" />}
            title="No matching applications"
            description="Try adjusting your search or filters."
            action={hasActiveFilters ? { label: 'Clear filters', onClick: clearFilters } : undefined}
          />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={paginatedData}
              emptyMessage="No applications found."
            />
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing {(safePage - 1) * PER_PAGE + 1}–{Math.min(safePage * PER_PAGE, filtered.length)} of{' '}
                  {filtered.length} applications
                </p>
                <Pagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}
      </motion.div>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Application</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the application for{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                {deleteTarget?.position}
              </span>{' '}
              at{' '}
              <span className="font-semibold text-gray-900 dark:text-white">
                {deleteTarget?.company}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteTarget && handleDelete(deleteTarget.id)}
            >
              <Trash2 className="mr-1.5 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}
