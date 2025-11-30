import { createBrowserClient } from "@supabase/ssr"
import { SAMPLE_PRODUCTS, SAMPLE_SERVICES, SAMPLE_REQUESTS, SAMPLE_PROFILES } from "./seed-data"

let client: ReturnType<typeof createBrowserClient> | null = null

// Mock authentication system using localStorage
const USERS_STORAGE_KEY = 'skilllink_users'
const CURRENT_USER_KEY = 'skilllink_current_user'

interface MockUser {
  id: string
  email: string
  password: string
  user_metadata: {
    full_name?: string
  }
  created_at: string
}

// Helper functions for mock auth
const getStoredUsers = (): MockUser[] => {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(USERS_STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

const saveUsers = (users: MockUser[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

const getCurrentUser = (): MockUser | null => {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(CURRENT_USER_KEY)
  return stored ? JSON.parse(stored) : null
}

const setCurrentUser = (user: MockUser | null) => {
  if (typeof window === 'undefined') return
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(CURRENT_USER_KEY)
  }
}

const generateId = () => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

export function createClient() {
  if (client) return client

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Helper to get/set data for a table
    const getTableData = (table: string) => {
      if (typeof window === 'undefined') return []
      
      // Auto-seed data if empty
      const key = `skilllink_${table}`
      const stored = localStorage.getItem(key)
      
      if (!stored) {
        let seedData: any[] = []
        if (table === 'products') seedData = SAMPLE_PRODUCTS
        else if (table === 'services') seedData = SAMPLE_SERVICES
        else if (table === 'requests') seedData = SAMPLE_REQUESTS
        else if (table === 'profiles') seedData = SAMPLE_PROFILES
        
        if (seedData.length > 0) {
          localStorage.setItem(key, JSON.stringify(seedData))
          return seedData
        }
        return []
      }
      
      return JSON.parse(stored)
    }

    const setTableData = (table: string, data: any[]) => {
      if (typeof window === 'undefined') return
      localStorage.setItem(`skilllink_${table}`, JSON.stringify(data))
    }

    return {
      auth: {
        getUser: async () => {
          const user = getCurrentUser()
          if (user) {
            const { password, ...userWithoutPassword } = user
            return {
              data: { user: userWithoutPassword },
              error: null,
            }
          }
          return { data: { user: null }, error: null }
        },
        
        onAuthStateChange: (callback: (event: string, session: any) => void) => {
          const user = getCurrentUser()
          if (user) {
            const { password, ...userWithoutPassword } = user
            callback('SIGNED_IN', {
              user: userWithoutPassword,
              access_token: 'mock-token',
            })
          }
          return {
            data: {
              subscription: {
                unsubscribe: () => {},
              },
            },
          }
        },
        
        signOut: async () => {
          setCurrentUser(null)
          return { error: null }
        },
        
        signUp: async (credentials: any) => {
          const users = getStoredUsers()
          const existingUser = users.find(u => u.email === credentials.email)
          if (existingUser) {
            return {
              data: { user: null, session: null },
              error: { message: 'User already registered' },
            }
          }
          
          const newUser: MockUser = {
            id: generateId(),
            email: credentials.email,
            password: credentials.password,
            user_metadata: credentials.options?.data || {},
            created_at: new Date().toISOString(),
          }
          
          users.push(newUser)
          saveUsers(users)
          setCurrentUser(newUser)
          
          const { password, ...userWithoutPassword } = newUser
          return {
            data: {
              user: userWithoutPassword,
              session: {
                access_token: 'mock-access-token',
                refresh_token: 'mock-refresh-token',
                user: userWithoutPassword,
              },
            },
            error: null,
          }
        },
        
        signInWithPassword: async (credentials: any) => {
          const users = getStoredUsers()
          const user = users.find(
            u => u.email === credentials.email && u.password === credentials.password
          )
          
          if (!user) {
            return {
              data: { user: null, session: null },
              error: { message: 'Invalid login credentials' },
            }
          }
          
          setCurrentUser(user)
          const { password, ...userWithoutPassword } = user
          
          return {
            data: {
              user: userWithoutPassword,
              session: {
                access_token: 'mock-access-token',
                refresh_token: 'mock-refresh-token',
                user: userWithoutPassword,
              },
            },
            error: null,
          }
        },
        
        resetPasswordForEmail: async (email: string) => {
          return { data: {}, error: null }
        },
      },

      from: (table: string) => {
        return {
          select: (columns = '*') => {
            const data = getTableData(table)
            let filteredData = [...data]
            
            const queryBuilder = {
              eq: (column: string, value: any) => {
                filteredData = filteredData.filter((item: any) => item[column] === value)
                return queryBuilder
              },
              neq: (column: string, value: any) => {
                filteredData = filteredData.filter((item: any) => item[column] !== value)
                return queryBuilder
              },
              gt: (column: string, value: any) => {
                filteredData = filteredData.filter((item: any) => item[column] > value)
                return queryBuilder
              },
              lt: (column: string, value: any) => {
                filteredData = filteredData.filter((item: any) => item[column] < value)
                return queryBuilder
              },
              gte: (column: string, value: any) => {
                filteredData = filteredData.filter((item: any) => item[column] >= value)
                return queryBuilder
              },
              lte: (column: string, value: any) => {
                filteredData = filteredData.filter((item: any) => item[column] <= value)
                return queryBuilder
              },
              like: (column: string, pattern: string) => {
                const regex = new RegExp(pattern.replace(/%/g, '.*'), 'i')
                filteredData = filteredData.filter((item: any) => regex.test(item[column]))
                return queryBuilder
              },
              ilike: (column: string, pattern: string) => {
                const regex = new RegExp(pattern.replace(/%/g, '.*'), 'i')
                filteredData = filteredData.filter((item: any) => regex.test(item[column]))
                return queryBuilder
              },
              in: (column: string, values: any[]) => {
                filteredData = filteredData.filter((item: any) => values.includes(item[column]))
                return queryBuilder
              },
              order: (column: string, { ascending = true } = {}) => {
                filteredData.sort((a: any, b: any) => {
                  if (a[column] < b[column]) return ascending ? -1 : 1
                  if (a[column] > b[column]) return ascending ? 1 : -1
                  return 0
                })
                return queryBuilder
              },
              limit: (count: number) => {
                filteredData = filteredData.slice(0, count)
                return queryBuilder
              },
              single: async () => {
                return { data: filteredData[0] || null, error: null }
              },
              then: (resolve: (value: any) => void) => {
                resolve({ data: filteredData, error: null })
              }
            }
            return queryBuilder
          },
          
          insert: async (data: any) => {
            const currentData = getTableData(table)
            const newItem = {
              id: Math.random().toString(36).substr(2, 9),
              created_at: new Date().toISOString(),
              ...data
            }
            currentData.push(newItem)
            setTableData(table, currentData)
            return { data: [newItem], error: null }
          },
          
          update: (data: any) => {
            const queryBuilder = {
              eq: async (column: string, value: any) => {
                const currentData = getTableData(table)
                const updatedData = currentData.map((item: any) => {
                  if (item[column] === value) {
                    return { ...item, ...data }
                  }
                  return item
                })
                setTableData(table, updatedData)
                return { data: updatedData.filter((item: any) => item[column] === value), error: null }
              }
            }
            return queryBuilder
          },
          
          delete: () => {
            const queryBuilder = {
              eq: async (column: string, value: any) => {
                const currentData = getTableData(table)
                const newData = currentData.filter((item: any) => item[column] !== value)
                setTableData(table, newData)
                return { data: null, error: null }
              }
            }
            return queryBuilder
          }
        }
      }
    } as any
  }

  client = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  return client
}
