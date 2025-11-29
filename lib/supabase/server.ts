import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const { sampleProducts, sampleServices, sampleRequests } = await import('../sample-data')
    
    let currentTable = ''
    let currentData: any[] = []
    let filters: any = {}
    
    const mockQuery = {
      get data() {
        // Apply filters
        let filteredData = [...currentData]
        
        // Apply eq filters
        if (filters.status) {
          filteredData = filteredData.filter((item: any) => item.status === filters.status)
        }
        if (filters.is_available !== undefined) {
          filteredData = filteredData.filter((item: any) => item.is_available === filters.is_available)
        }
        if (filters.category) {
          filteredData = filteredData.filter((item: any) => item.category === filters.category)
        }
        if (filters.urgency) {
          filteredData = filteredData.filter((item: any) => item.urgency === filters.urgency)
        }
        
        // Apply ilike filter (search)
        if (filters.search) {
          const searchLower = filters.search.toLowerCase()
          filteredData = filteredData.filter((item: any) => 
            item.title?.toLowerCase().includes(searchLower)
          )
        }
        
        return filteredData
      },
      error: null,
      select: (columns: string) => mockQuery,
      eq: (column: string, value: any) => {
        filters[column] = value
        return mockQuery
      },
      order: (column: string, options?: any) => mockQuery,
      limit: (count: number) => mockQuery,
      single: () => mockQuery,
      insert: (data: any) => mockQuery,
      update: (data: any) => mockQuery,
      delete: () => mockQuery,
      ilike: (column: string, pattern: string) => {
        // Remove % wildcards and store search term
        filters.search = pattern.replace(/%/g, '')
        return mockQuery
      },
    }
    
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
      },
      from: (table: string) => {
        currentTable = table
        filters = {}
        
        // Set data based on table
        if (table === 'products') {
          currentData = sampleProducts
        } else if (table === 'services') {
          currentData = sampleServices
        } else if (table === 'requests') {
          currentData = sampleRequests
        } else {
          currentData = []
        }
        
        return mockQuery
      },
    } as any
  }

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // The "setAll" method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  })
}
