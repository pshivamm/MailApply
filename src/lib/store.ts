import type { Template, Application } from '@/types'

const STORAGE_KEYS = {
  TEMPLATES: 'mailapply_templates',
  APPLICATIONS: 'mailapply_applications',
  USER: 'mailapply_user',
  THEME: 'mailapply_theme',
} as const

export function getStorageItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : fallback
  } catch {
    return fallback
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.warn('Failed to save to localStorage')
  }
}

export function getTemplates(): Template[] {
  return getStorageItem<Template[]>(STORAGE_KEYS.TEMPLATES, [])
}

export function setTemplates(templates: Template[]): void {
  setStorageItem(STORAGE_KEYS.TEMPLATES, templates)
}

export function getApplications(): Application[] {
  return getStorageItem<Application[]>(STORAGE_KEYS.APPLICATIONS, [])
}

export function setApplications(applications: Application[]): void {
  setStorageItem(STORAGE_KEYS.APPLICATIONS, applications)
}

export function getTheme(): 'light' | 'dark' | 'system' {
  return getStorageItem<'light' | 'dark' | 'system'>(STORAGE_KEYS.THEME, 'light')
}

export function setTheme(theme: 'light' | 'dark' | 'system'): void {
  setStorageItem(STORAGE_KEYS.THEME, theme)
}

export function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export { STORAGE_KEYS }
