import { useState, useMemo } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { motion } from 'framer-motion'
import { ChevronUp, ChevronDown, ChevronsUpDown, Search, Inbox } from '@/lib/icons'
import { cn } from '@/lib/utils'

interface DataTableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  isLoading?: boolean
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  emptyMessage?: string
}

function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 w-full animate-pulse rounded-md bg-gray-200 dark:bg-gray-700" />
        </td>
      ))}
    </tr>
  )
}

export function DataTable<TData>({
  columns,
  data,
  isLoading = false,
  searchPlaceholder = 'Search...',
  onSearch,
  emptyMessage = 'No results found.',
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: (value) => {
      setGlobalFilter(value)
      onSearch?.(value)
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const rows = table.getRowModel().rows

  return (
    <div className="space-y-4">
      {onSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={globalFilter}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-blue-400"
          />
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-200 bg-gray-50/80 dark:border-gray-700 dark:bg-gray-900/50">
                    {headerGroup.headers.map((header) => {
                      const canSort = header.column.getCanSort()
                      const sorted = header.column.getIsSorted()
                      const meta = (header.column.columnDef as any).meta as { className?: string } | undefined
                      return (
                        <th
                          key={header.id}
                          className={cn(
                            'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400',
                            canSort && 'cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-200',
                            meta?.className
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div className="inline-flex items-center gap-1.5">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {canSort && (
                              <span className="inline-flex flex-col">
                                {sorted === 'asc' ? (
                                  <ChevronUp className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                ) : sorted === 'desc' ? (
                                  <ChevronDown className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                ) : (
                                  <ChevronsUpDown className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />
                                )}
                              </span>
                            )}
                          </div>
                        </th>
                      )
                    })}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={columns.length} />)
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Inbox className="h-10 w-10 text-gray-300 dark:text-gray-600" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-b border-gray-100 transition-colors last:border-b-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = (cell.column.columnDef as any).meta as { className?: string } | undefined
                    return (
                      <td key={cell.id} className={cn('px-4 py-3 text-sm text-gray-700 dark:text-gray-300', meta?.className)}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    )
                  })}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}
