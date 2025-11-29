import { createBrowserClient } from "@supabase/ssr"

let client: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (client) return client

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: async () => ({ error: null }),
        signUp: async (credentials: any) => ({
          data: {
            user: {
              id: 'mock-user-id',
              email: credentials.email,
              user_metadata: credentials.options?.data || {},
            },
            session: null,
          },
          error: null,
        }),
        signInWithPassword: async (credentials: any) => ({
          data: {
            user: {
              id: 'mock-user-id',
              email: credentials.email,
            },
            session: {
              access_token: 'mock-access-token',
              refresh_token: 'mock-refresh-token',
            },
          },
          error: null,
        }),
        resetPasswordForEmail: async (email: string) => ({
          data: {},
          error: null,
        }),
      },
    } as any
  }

  client = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  return client
}
