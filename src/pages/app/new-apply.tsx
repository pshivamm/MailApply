import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  SendHorizontal,
  Save,
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  FileText,
  Building2,
  Mail,
  MapPin,
  Globe,
  Briefcase,
} from '@/lib/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { getTemplates, getApplications, setApplications } from '@/lib/store'
import { useAuth } from '@/contexts/auth-context'
import { cn } from '@/lib/utils'
import type { Application, Template, JobSource } from '@/types'

const formSchema = z.object({
  email: z.string().min(1, 'Receiver email is required').email('Please enter a valid email'),
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  location: z.string().min(1, 'Location is required'),
  website: z.string().optional(),
  source: z.string().min(1, 'Please select a job source'),
})

type FormData = z.infer<typeof formSchema>

const JOB_SOURCES: { value: JobSource; label: string }[] = [
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'Naukri', label: 'Naukri' },
  { value: 'Indeed', label: 'Indeed' },
  { value: 'Cutshort', label: 'Cutshort' },
  { value: 'Company Website', label: 'Company Website' },
  { value: 'Internshala', label: 'Internshala' },
  { value: 'Other', label: 'Other' },
]

const STEPS = [
  { num: 1, label: 'Application Details' },
  { num: 2, label: 'Select Template' },
  { num: 3, label: 'Review & Send' },
] as const

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    opacity: 0,
  }),
}

function replaceVariables(text: string, data: Record<string, string>) {
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => data[key] || `{{${key}}}`)
}

export default function NewApplyPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(0)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)

  const templates = useMemo(() => getTemplates().filter((t) => !t.disabled), [])

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      company: '',
      position: '',
      location: '',
      website: '',
      source: '',
    },
  })

  const formValues = watch()
  const selectedTemplate = useMemo(
    () => templates.find((t) => t.id === selectedTemplateId) ?? null,
    [templates, selectedTemplateId]
  )

  const previewData = useMemo(
    () => ({
      company: formValues.company || '[Company]',
      position: formValues.position || '[Position]',
      name: user?.name || '[Name]',
    }),
    [formValues.company, formValues.position, user?.name]
  )

  function goToStep(next: number) {
    setDirection(next > step ? 1 : -1)
    setStep(next)
  }

  function onStep1Next() {
    handleSubmit(
      () => goToStep(2),
      () => toast.error('Please fix the errors in the form')
    )()
  }

  function onStep2Next() {
    if (!selectedTemplateId) {
      toast.error('Please select a template')
      return
    }
    goToStep(3)
  }

  function createApplication(status: Application['status']): Application {
    return {
      id: crypto.randomUUID(),
      company: formValues.company,
      email: formValues.email,
      position: formValues.position,
      location: formValues.location,
      website: formValues.website || undefined,
      source: formValues.source as JobSource,
      templateId: selectedTemplate?.id ?? '',
      templateName: selectedTemplate?.name ?? '',
      appliedDate: new Date().toISOString().split('T')[0],
      status,
    }
  }

  function saveApplication(status: Application['status'], message: string) {
    const app = createApplication(status)
    const all = getApplications()
    setApplications([app, ...all])
    toast.success(message)
    navigate('/app/my-applies')
  }

  function handleSend() {
    saveApplication('Applied', 'Application sent successfully!')
  }

  function handleSaveDraft() {
    saveApplication('Pending', 'Draft saved successfully!')
  }

  function handleCancel() {
    navigate('/app/my-applies')
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Application</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Fill in the details and send a personalized application
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="relative">
        <div className="absolute left-1/2 -translate-x-1/2 top-5 hidden h-px w-[85%] bg-gradient-to-b from-blue-200 via-blue-300 to-blue-200 dark:from-blue-900 dark:via-blue-800 dark:to-blue-900 lg:block" />
        <div className="relative z-10 flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <button
                type="button"
                onClick={() => {
                  if (s.num < step) goToStep(s.num)
                }}
                disabled={s.num > step}
                className={cn(
                  'flex flex-col items-center gap-2',
                  s.num < step && 'cursor-pointer',
                  s.num > step && 'cursor-default'
                )}
              >
                <motion.div
                  layout
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors',
                    s.num < step &&
                      'border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500',
                    s.num === step &&
                      'border-blue-600 bg-white text-blue-600 dark:border-blue-500 dark:bg-gray-950 dark:text-blue-400',
                    s.num > step &&
                      'border-gray-300 bg-white text-gray-400 dark:border-gray-600 dark:bg-gray-950 dark:text-gray-500'
                  )}
                >
                  {s.num < step ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <Check className="h-4 w-4" />
                    </motion.div>
                  ) : (
                    s.num
                  )}
                </motion.div>
                <span
                  className={cn(
                    'hidden text-xs font-medium sm:block',
                    s.num <= step
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-400 dark:text-gray-500'
                  )}
                >
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className="mx-3 flex-1 sm:mx-6 relative h-2">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #d1d5db 2.5px, transparent 2.5px)',
                      backgroundSize: '16px 8px',
                      backgroundPosition: '0 center',
                      backgroundRepeat: 'repeat-x',
                    }}
                  />
                  <div
                    className="absolute inset-0 hidden dark:block"
                    style={{
                      backgroundImage: 'radial-gradient(circle, #4b5563 2.5px, transparent 2.5px)',
                      backgroundSize: '16px 8px',
                      backgroundPosition: '0 center',
                      backgroundRepeat: 'repeat-x',
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 overflow-hidden"
                    initial={false}
                    animate={{ width: s.num < step ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: 'radial-gradient(circle, #2563eb 2.5px, transparent 2.5px)',
                        backgroundSize: '16px 8px',
                        backgroundPosition: '0 center',
                        backgroundRepeat: 'repeat-x',
                      }}
                    />
                    <div
                      className="absolute inset-0 hidden dark:block"
                      style={{
                        backgroundImage: 'radial-gradient(circle, #3b82f6 2.5px, transparent 2.5px)',
                        backgroundSize: '16px 8px',
                        backgroundPosition: '0 center',
                        backgroundRepeat: 'repeat-x',
                      }}
                    />
                  </motion.div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={stepVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.25, ease: 'easeInOut' }}
        >
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Application Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">
                    <span className="flex items-center gap-1.5 mb-2 md:mb-3">
                      <Mail className="h-3.5 w-3.5 text-gray-400" />
                      Receiver Email
                    </span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="hr@company.com"
                    error={errors.email?.message}
                    {...register('email')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">
                    <span className="flex items-center gap-1.5 mb-2 md:mb-3">
                      <Building2 className="h-3.5 w-3.5 text-gray-400" />
                      Company Name
                    </span>
                  </Label>
                  <Input
                    id="company"
                    placeholder="Acme Corp"
                    error={errors.company?.message}
                    {...register('company')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">
                    <span className="flex items-center gap-1.5 mb-2 md:mb-3">
                      <Briefcase className="h-3.5 w-3.5 text-gray-400" />
                      Position
                    </span>
                  </Label>
                  <Input
                    id="position"
                    placeholder="Senior Software Engineer"
                    error={errors.position?.message}
                    {...register('position')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">
                    <span className="flex items-center gap-1.5 mb-2 md:mb-3">
                      <MapPin className="h-3.5 w-3.5 text-gray-400" />
                      Location
                    </span>
                  </Label>
                  <Input
                    id="location"
                    placeholder="San Francisco, CA"
                    error={errors.location?.message}
                    {...register('location')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">
                    <span className="flex items-center gap-1.5 mb-2 md:mb-3">
                      <Globe className="h-3.5 w-3.5 text-gray-400" />
                      Company Website
                    </span>
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://acme.com"
                    error={errors.website?.message}
                    {...register('website')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="source" className="mb-2 md:mb-3">
                    Job Source
                  </Label>
                  <Controller
                    name="source"
                    control={control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value || undefined}>
                        <SelectTrigger id="source">
                          <SelectValue placeholder="Select job source" />
                        </SelectTrigger>
                        <SelectContent>
                          {JOB_SOURCES.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.source && (
                    <p className="text-xs text-red-500 dark:text-red-400">
                      {errors.source.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end pt-2">
                  <Button type="button" onClick={onStep1Next} size="lg">
                    Next Step
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Select Template
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {templates.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-8 text-center">
                      <FileText className="h-12 w-12 text-gray-300 dark:text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">No templates yet</p>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Create a template first to start applying
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {templates.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelectedTemplateId(t.id)}
                          className={cn(
                            'relative flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-all',
                            selectedTemplateId === t.id
                              ? 'border-blue-500 bg-blue-50 shadow-sm dark:border-blue-400 dark:bg-blue-950/40'
                              : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:bg-gray-950 dark:hover:border-gray-600'
                          )}
                        >
                          {selectedTemplateId === t.id && (
                            <motion.div
                              layoutId="check"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600"
                            >
                              <Check className="h-3 w-3 text-white" />
                            </motion.div>
                          )}
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {t.name}
                          </span>
                          <span className="line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                            {t.subject}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {selectedTemplate && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">
                        <div className="mb-3 space-y-1 border-b border-gray-100 pb-3 dark:border-gray-800">
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span className="font-medium text-gray-700 dark:text-gray-300">From:</span>
                            <span>{selectedTemplate.senderEmail}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span className="font-medium text-gray-700 dark:text-gray-300">To:</span>
                            <span>{formValues.email || '[Receiver Email]'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <span className="font-medium text-gray-700 dark:text-gray-300">
                              Subject:
                            </span>
                            <span>{replaceVariables(selectedTemplate.subject, previewData)}</span>
                          </div>
                        </div>
                        <div className="prose prose-sm max-w-none text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                          {replaceVariables(selectedTemplate.body, previewData)
                            .split('\n')
                            .map((line, i) => (
                              <p key={i}>{line || '\u00A0'}</p>
                            ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => goToStep(1)} size="lg">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <Button type="button" onClick={onStep2Next} size="lg">
                  Next Step
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Review Application
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Receiver Email
                      </span>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formValues.email}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Company
                      </span>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formValues.company}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Position
                      </span>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formValues.position}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Location
                      </span>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {formValues.location}
                      </p>
                    </div>
                    {formValues.website && (
                      <div className="space-y-1">
                        <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                          Website
                        </span>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {formValues.website}
                        </p>
                      </div>
                    )}
                    <div className="space-y-1">
                      <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Source
                      </span>
                      <br />
                      <Badge variant="secondary" >{formValues.source}</Badge>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Template
                      </span>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {selectedTemplate?.name ?? 'None'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Applied Date
                      </span>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {new Date().toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Email Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900 overflow-hidden">
                    <div className="border-b border-gray-200 bg-gray-50 px-5 py-3 dark:border-gray-700 dark:bg-gray-900">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="h-3 w-3 rounded-full bg-red-400" />
                          <div className="h-3 w-3 rounded-full bg-yellow-400" />
                          <div className="h-3 w-3 rounded-full bg-green-400" />
                        </div>
                        <span className="ml-2 text-xs text-gray-400">mailapply</span>
                      </div>
                    </div>
                    <div className="space-y-3 px-5 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-16 text-xs font-medium text-gray-500 dark:text-gray-400">
                          From:
                        </span>
                        <span className="text-gray-900 dark:text-white">
                          {selectedTemplate?.senderEmail ?? '—'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-16 text-xs font-medium text-gray-500 dark:text-gray-400">
                          To:
                        </span>
                        <span className="text-gray-900 dark:text-white">{formValues.email}</span>
                      </div>
                      <Separator />
                      <div className="flex items-center gap-2 text-sm">
                        <span className="w-16 text-xs font-medium text-gray-500 dark:text-gray-400">
                          Subject:
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {selectedTemplate
                            ? replaceVariables(selectedTemplate.subject, previewData)
                            : '—'}
                        </span>
                      </div>
                      <Separator />
                      <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                        {selectedTemplate
                          ? replaceVariables(selectedTemplate.body, previewData)
                              .split('\n')
                              .map((line, i) => <p key={i}>{line || '\u00A0'}</p>)
                          : 'No template selected'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <Button type="button" variant="outline" onClick={() => goToStep(2)} size="lg">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <div className="flex flex-col-reverse gap-3 sm:flex-row">
                  <Button type="button" variant="ghost" onClick={handleCancel} size="lg">
                    Cancel
                  </Button>
                  <Button type="button" variant="outline" onClick={handleSaveDraft} size="lg">
                    <Save className="h-4 w-4" />
                    Save Draft
                  </Button>
                  <Button type="button" onClick={handleSend} size="lg">
                    <SendHorizontal className="h-4 w-4" />
                    Send Email
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
