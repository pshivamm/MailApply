import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon, Monitor, Download, Trash2, Mail, Bell, Shield, Palette, Save } from '@/lib/icons'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { useTheme } from '@/contexts/theme-context'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { cn } from '@/lib/utils'

interface NotificationSettings {
  emailNotifications: boolean
  weeklyDigest: boolean
  applicationUpdates: boolean
  marketingEmails: boolean
}

interface EmailPreferences {
  defaultSender: string
  signature: string
  autoSave: boolean
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [clearDataDialogOpen, setClearDataDialogOpen] = useState(false)

  const [notifications, setNotifications] = useLocalStorage<NotificationSettings>(
    'mailapply_notifications',
    {
      emailNotifications: true,
      weeklyDigest: false,
      applicationUpdates: true,
      marketingEmails: false,
    }
  )

  const [emailPrefs, setEmailPrefs] = useLocalStorage<EmailPreferences>(
    'mailapply_email_prefs',
    {
      defaultSender: '',
      signature: '',
      autoSave: true,
    }
  )

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ]

  function handleExportData() {
    const data: Record<string, unknown> = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key) ?? '')
        } catch {
          data[key] = localStorage.getItem(key)
        }
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mailapply-export-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Data exported successfully')
  }

  function handleClearData() {
    localStorage.clear()
    setClearDataDialogOpen(false)
    toast.success('All data cleared')
    window.location.reload()
  }

  function handleSaveEmailPrefs() {
    toast.success('Email preferences saved')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Customize your experience and manage preferences
        </p>
      </div>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="w-full justify-start gap-0">
          <TabsTrigger value="appearance" className="gap-2">
            <Palette className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <Shield className="h-4 w-4" />
            Privacy & Data
          </TabsTrigger>
          <TabsTrigger value="email" className="gap-2">
            <Mail className="h-4 w-4" />
            Email Preferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Theme
              </CardTitle>
              <CardDescription>Choose how MailApply looks for you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                {themeOptions.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTheme(value)}
                    className={cn(
                      'flex flex-col items-center gap-3 rounded-xl border-2 p-6 transition-all duration-200',
                      theme === value
                        ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/50'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-950 dark:hover:border-gray-600 dark:hover:bg-gray-900'
                    )}
                  >
                    <Icon className={cn(
                      'h-6 w-6',
                      theme === value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
                    )} />
                    <span className={cn(
                      'text-sm font-medium',
                      theme === value ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300'
                    )}>
                      {label}
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Manage what notifications you receive</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications" className="text-sm font-medium cursor-pointer">
                    Email Notifications
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Receive email notifications about your account
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={notifications.emailNotifications}
                  onCheckedChange={checked =>
                    setNotifications(prev => ({ ...prev, emailNotifications: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weeklyDigest" className="text-sm font-medium cursor-pointer">
                    Weekly Digest
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Get a weekly summary of your application activity
                  </p>
                </div>
                <Switch
                  id="weeklyDigest"
                  checked={notifications.weeklyDigest}
                  onCheckedChange={checked =>
                    setNotifications(prev => ({ ...prev, weeklyDigest: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="applicationUpdates" className="text-sm font-medium cursor-pointer">
                    Application Updates
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Receive updates when your applications are viewed or replied to
                  </p>
                </div>
                <Switch
                  id="applicationUpdates"
                  checked={notifications.applicationUpdates}
                  onCheckedChange={checked =>
                    setNotifications(prev => ({ ...prev, applicationUpdates: checked }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketingEmails" className="text-sm font-medium cursor-pointer">
                    Marketing Emails
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Receive tips, updates, and promotional content
                  </p>
                </div>
                <Switch
                  id="marketingEmails"
                  checked={notifications.marketingEmails}
                  onCheckedChange={checked =>
                    setNotifications(prev => ({ ...prev, marketingEmails: checked }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Privacy & Data
              </CardTitle>
              <CardDescription>Manage your data and account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-4">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Export Data</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Download all your data as a JSON file
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleExportData}>
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/50 p-4">
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">Clear Local Data</p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
                    Remove all locally stored data. This cannot be undone.
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/50"
                  onClick={() => setClearDataDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Data
                </Button>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/50 p-4">
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-300">Delete Account</p>
                  <p className="text-xs text-red-600 dark:text-red-400 mt-0.5">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>

          <Dialog open={clearDataDialogOpen} onOpenChange={setClearDataDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <Trash2 className="h-5 w-5" />
                  Clear All Data
                </DialogTitle>
                <DialogDescription>
                  This will permanently remove all locally stored data including templates, applications, and preferences. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setClearDataDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={handleClearData}>
                  <Trash2 className="h-4 w-4" />
                  Yes, Clear Everything
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <Trash2 className="h-5 w-5" />
                  Delete Account
                </DialogTitle>
                <DialogDescription>
                  This action is irreversible. All your data, templates, and applications will be permanently deleted.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={() => {
                  setDeleteDialogOpen(false);
                  localStorage.clear();
                  window.location.href = '/';
                }}>
                  <Trash2 className="h-4 w-4" />
                  Delete Account
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                Email Preferences
              </CardTitle>
              <CardDescription>Configure your default email settings and signature</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="defaultSender">Default Sender Email</Label>
                <Input
                  id="defaultSender"
                  type="email"
                  placeholder="you@example.com"
                  value={emailPrefs.defaultSender}
                  onChange={e =>
                    setEmailPrefs(prev => ({ ...prev, defaultSender: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signature">Email Signature</Label>
                <Textarea
                  id="signature"
                  placeholder="Best regards,&#10;Your Name"
                  rows={4}
                  value={emailPrefs.signature}
                  onChange={e =>
                    setEmailPrefs(prev => ({ ...prev, signature: e.target.value }))
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoSave" className="text-sm font-medium cursor-pointer">
                    Auto-Save Drafts
                  </Label>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Automatically save email drafts as you type
                  </p>
                </div>
                <Switch
                  id="autoSave"
                  checked={emailPrefs.autoSave}
                  onCheckedChange={checked =>
                    setEmailPrefs(prev => ({ ...prev, autoSave: checked }))
                  }
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handleSaveEmailPrefs}>
                  <Save className="h-4 w-4" />
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
