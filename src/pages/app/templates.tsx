import { useState, useMemo, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Plus, Grid3X3, List, Pencil, Copy,
  ToggleLeft, ToggleRight, Trash2, Eye, FileText,
  ArrowUp, ArrowDown,
} from '@/lib/icons'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Modal } from '@/components/shared/modal'
import { EmptyState } from '@/components/ui/empty-state'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { getTemplates, setTemplates } from '@/lib/store'
import { mockTemplates } from '@/lib/mock-data'
import { cn, formatDate } from '@/lib/utils'
import type { Template } from '@/types'

const templateFormSchema = z.object({
  name: z.string().min(1, 'Template name is required'),
  senderEmail: z.string().min(1, 'Sender email is required').email('Please enter a valid email'),
  subject: z.string().min(1, 'Subject is required'),
  body: z.string().min(1, 'Email body is required'),
})

type TemplateFormData = z.infer<typeof templateFormSchema>

const VARIABLES = ['{{company}}', '{{position}}', '{{name}}'] as const

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 300, damping: 25 },
  },
}

const rowVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.035, duration: 0.25, ease: 'easeOut' as const },
  }),
}

export default function TemplatesPage() {
  const [templates, setTemplatesState] = useState<Template[]>(() => {
    const stored = getTemplates()
    if (stored.length === 0) {
      setTemplates(mockTemplates)
      return mockTemplates
    }
    return stored
  })

  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'disabled'>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<Template | null>(null)
  const [sortField, setSortField] = useState<'name' | 'createdAt'>('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewContent, setPreviewContent] = useState<{ subject: string; body: string } | null>(null)

  const formRef = useRef<HTMLFormElement>(null)

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: { name: '', senderEmail: '', subject: '', body: '' },
  })

  const { register, handleSubmit, reset, setValue, getValues, formState: { errors } } = form

  function saveTemplates(updated: Template[]) {
    setTemplatesState(updated)
    setTemplates(updated)
  }

  function openCreateModal() {
    setEditingTemplate(null)
    reset({ name: '', senderEmail: '', subject: '', body: '' })
    setFocusedField(null)
    setModalOpen(true)
  }

  function openEditModal(template: Template) {
    setEditingTemplate(template)
    reset({
      name: template.name,
      senderEmail: template.senderEmail,
      subject: template.subject,
      body: template.body,
    })
    setFocusedField(null)
    setModalOpen(true)
  }

  function handleDuplicate(template: Template) {
    const newTemplate: Template = {
      ...template,
      id: crypto.randomUUID(),
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    }
    saveTemplates([newTemplate, ...templates])
    toast.success('Template duplicated')
  }

  function handleToggleStatus(template: Template) {
    const updated = templates.map(t =>
      t.id === template.id
        ? { ...t, disabled: !t.disabled, updatedAt: new Date().toISOString().split('T')[0] }
        : t
    )
    saveTemplates(updated)
    toast.success(template.disabled ? 'Template enabled' : 'Template disabled')
  }

  function confirmDelete(template: Template) {
    setTemplateToDelete(template)
    setDeleteConfirmOpen(true)
  }

  function handleDelete() {
    if (!templateToDelete) return
    const updated = templates.filter(t => t.id !== templateToDelete.id)
    saveTemplates(updated)
    setDeleteConfirmOpen(false)
    setTemplateToDelete(null)
    toast.success('Template deleted')
  }

  function toggleSort(field: 'name' | 'createdAt') {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDir(field === 'createdAt' ? 'desc' : 'asc')
    }
  }

  function insertVariable(variable: string) {
    if (!focusedField) return
    const key = focusedField as keyof TemplateFormData
    const current = (getValues(key) as string) || ''
    setValue(key, current + variable, { shouldValidate: true })
  }

  function getPreviewContent(subject: string, body: string) {
    const vars = { company: 'Acme Corp', position: 'Senior Software Engineer', name: 'John Doe' }
    const replace = (text: string) =>
      text.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
        vars[key as keyof typeof vars] || `{{${key}}}`
      )
    return { subject: replace(subject), body: replace(body) }
  }

  function openPreview() {
    const values = getValues()
    setPreviewContent(getPreviewContent(values.subject, values.body))
    setPreviewOpen(true)
  }

  async function onSave(data: TemplateFormData) {
    setSaving(true)
    try {
      await new Promise(r => setTimeout(r, 150))
      const updated = [...templates]

      if (editingTemplate) {
        const idx = updated.findIndex(t => t.id === editingTemplate.id)
        if (idx !== -1) {
          updated[idx] = {
            ...updated[idx],
            ...data,
            updatedAt: new Date().toISOString().split('T')[0],
          }
        }
      } else {
        const newTemplate: Template = {
          id: crypto.randomUUID(),
          ...data,
          createdAt: new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          disabled: false,
        }
        updated.unshift(newTemplate)
      }

      saveTemplates(updated)
      setModalOpen(false)
      toast.success(editingTemplate ? 'Template updated' : 'Template created')
    } finally {
      setSaving(false)
    }
  }

  const filteredTemplates = useMemo(() => {
    let result = [...templates]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        t => t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q)
      )
    }

    if (statusFilter === 'active') result = result.filter(t => !t.disabled)
    else if (statusFilter === 'disabled') result = result.filter(t => t.disabled)

    result.sort((a, b) => {
      if (sortField === 'name') {
        return sortDir === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      }
      const da = new Date(a.createdAt).getTime()
      const db = new Date(b.createdAt).getTime()
      return sortDir === 'asc' ? da - db : db - da
    })

    return result
  }, [templates, searchQuery, statusFilter, sortField, sortDir])

  const SortIcon = sortDir === 'asc' ? ArrowUp : ArrowDown

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Templates
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your email templates
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="h-4 w-4" />
          Create Template
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row items-start sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 z-10 text-gray-400 dark:text-gray-500" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-sm"
            />
          </div>

          <div className="flex items-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 p-0.5 dark:bg-gray-800">
            {(['all', 'active', 'disabled'] as const).map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  'px-3 py-1.5 text-xs font-medium rounded-md transition-all',
                  statusFilter === status
                    ? 'bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                )}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="w-auto flex items-center rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 p-0.5 dark:bg-gray-800">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'p-1.5 rounded-md transition-all',
              viewMode === 'grid'
                ? 'bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            )}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={cn(
              'p-1.5 rounded-md transition-all',
              viewMode === 'table'
                ? 'bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 shadow-sm'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            )}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {filteredTemplates.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
              >
                {filteredTemplates.map(template => (
                  <motion.div key={template.id} variants={cardVariants}>
                    <Card className="group h-full flex flex-col">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-base font-semibold truncate flex-1">
                            {template.name}
                          </CardTitle>
                          <Badge
                            variant={template.disabled ? 'secondary' : 'success'}
                            className="shrink-0 text-[10px] px-2 py-0.5"
                          >
                            {template.disabled ? 'Disabled' : 'Active'}
                          </Badge>
                        </div>
                        <CardDescription className="truncate text-sm mt-1">
                          {template.subject}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3 flex-1">
                        <div className="space-y-1.5 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-gray-600 dark:text-gray-300">From:</span>
                            <span className="truncate">{template.senderEmail}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-medium text-gray-600 dark:text-gray-300">Created:</span>
                            <span>{formatDate(template.createdAt)}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="pt-0 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-1 pt-3 w-full">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => openEditModal(template)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDuplicate(template)}
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleToggleStatus(template)}
                          >
                            {template.disabled ? (
                              <ToggleRight className="h-3.5 w-3.5" />
                            ) : (
                              <ToggleLeft className="h-3.5 w-3.5" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 ml-auto text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            onClick={() => confirmDelete(template)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <EmptyState
                icon={<FileText className="h-10 w-10" />}
                title="No templates found"
                description={
                  searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Create your first template to get started with automated applications.'
                }
                action={
                  !searchQuery && statusFilter === 'all'
                    ? { label: 'Create Template', onClick: openCreateModal }
                    : undefined
                }
              />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
          >
            {filteredTemplates.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50/80 dark:border-gray-800 dark:bg-gray-900/50">
                      <th
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 cursor-pointer select-none group"
                        onClick={() => toggleSort('name')}
                      >
                        <div className="flex items-center gap-1.5">
                          Name
                          <span className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors">
                            {sortField === 'name' ? (
                              <SortIcon className="h-3 w-3" />
                            ) : (
                              <ArrowUp className="h-3 w-3 opacity-0 group-hover:opacity-50" />
                            )}
                          </span>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Subject
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 hidden md:table-cell">
                        Sender Email
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Status
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 cursor-pointer select-none group hidden sm:table-cell"
                        onClick={() => toggleSort('createdAt')}
                      >
                        <div className="flex items-center gap-1.5">
                          Created
                          <span className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors">
                            {sortField === 'createdAt' ? (
                              <SortIcon className="h-3 w-3" />
                            ) : (
                              <ArrowUp className="h-3 w-3 opacity-0 group-hover:opacity-50" />
                            )}
                          </span>
                        </div>
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    <AnimatePresence mode="popLayout">
                      {filteredTemplates.map((template, i) => (
                        <motion.tr
                          key={template.id}
                          variants={rowVariants}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, x: 12, transition: { duration: 0.15 } }}
                          custom={i}
                          className="group hover:bg-gray-50/50 dark:hover:bg-gray-900/30 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {template.name}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-sm text-gray-600 dark:text-gray-400 truncate block max-w-[220px]">
                              {template.subject}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {template.senderEmail}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <Badge
                              variant={template.disabled ? 'secondary' : 'success'}
                              className="text-[10px] px-2 py-0.5"
                            >
                              {template.disabled ? 'Disabled' : 'Active'}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(template.createdAt)}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-0.5">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => openEditModal(template)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleDuplicate(template)}
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                onClick={() => handleToggleStatus(template)}
                              >
                                {template.disabled ? (
                                  <ToggleRight className="h-3.5 w-3.5" />
                                ) : (
                                  <ToggleLeft className="h-3.5 w-3.5" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                onClick={() => confirmDelete(template)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState
                icon={<FileText className="h-10 w-10" />}
                title="No templates found"
                description={
                  searchQuery || statusFilter !== 'all'
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Create your first template to get started with automated applications.'
                }
                action={
                  !searchQuery && statusFilter === 'all'
                    ? { label: 'Create Template', onClick: openCreateModal }
                    : undefined
                }
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editingTemplate ? 'Edit Template' : 'Create Template'}
        description={editingTemplate ? 'Update your email template details below.' : 'Fill in the details to create a new email template.'}
        size="xl"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="outline" onClick={openPreview} disabled={saving}>
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button onClick={() => formRef.current?.requestSubmit()} loading={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </>
        }
      >
        <form ref={formRef} onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              placeholder="e.g. Software Engineer Application"
              error={errors.name?.message}
              {...register('name')}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="senderEmail">Sender Email</Label>
            <Input
              id="senderEmail"
              type="email"
              placeholder="you@example.com"
              error={errors.senderEmail?.message}
              {...register('senderEmail')}
              onFocus={() => setFocusedField('senderEmail')}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="subject">Subject</Label>
              <div className="flex items-center gap-1">
                {VARIABLES.map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      setFocusedField('subject')
                      insertVariable(v)
                    }}
                    className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 text-[10px] font-mono text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <Input
              id="subject"
              placeholder="Application for {{position}} at {{company}}"
              error={errors.subject?.message}
              {...register('subject')}
              onFocus={() => setFocusedField('subject')}
              onBlur={() => setFocusedField(null)}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="body">Email Body</Label>
              <div className="flex items-center gap-1">
                {VARIABLES.map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      setFocusedField('body')
                      insertVariable(v)
                    }}
                    className="inline-flex items-center rounded-md bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 text-[10px] font-mono text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              id="body"
              placeholder="Dear Hiring Team,..."
              rows={8}
              error={errors.body?.message}
              {...register('body')}
              onFocus={() => setFocusedField('body')}
              onBlur={() => setFocusedField(null)}
            />
          </div>
        </form>
      </Modal>

      <Modal
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        title="Preview Template"
        description="This is how your email will look with sample data."
        size="lg"
        footer={
          <Button variant="outline" onClick={() => setPreviewOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-4">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              Subject
            </div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {previewContent?.subject}
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950 p-4 min-h-[200px] whitespace-pre-wrap text-sm leading-relaxed text-gray-800 dark:text-gray-200">
            {previewContent?.body}
          </div>
        </div>
      </Modal>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{' '}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                &ldquo;{templateToDelete?.name}&rdquo;
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
