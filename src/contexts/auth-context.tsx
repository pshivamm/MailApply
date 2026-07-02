import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User } from '@/types'
import { getStorageItem, setStorageItem, STORAGE_KEYS } from '@/lib/store'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() =>
    getStorageItem<User | null>(STORAGE_KEYS.USER, null)
  )

  const login = useCallback(async (email: string, _password: string) => {
    const newUser: User = { id: crypto.randomUUID(), name: email.split('@')[0], email }
    setUser(newUser)
    setStorageItem(STORAGE_KEYS.USER, newUser)
    return true
  }, [])

  const signup = useCallback(async (name: string, email: string, _password: string) => {
    const newUser: User = { id: crypto.randomUUID(), name, email }
    setUser(newUser)
    setStorageItem(STORAGE_KEYS.USER, newUser)
    return true
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEYS.USER)
  }, [])

  const updateUser = useCallback((data: Partial<User>) => {
    setUser(prev => {
      if (!prev) return prev
      const updated = { ...prev, ...data }
      setStorageItem(STORAGE_KEYS.USER, updated)
      return updated
    })
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
