import { createClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function createSupabaseClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Types for Supabase auth
export type AuthUser = {
  id: string
  email?: string
  phone?: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
    username?: string
  }
  app_metadata?: {
    provider?: string
  }
}

// Helper functions for auth
export const auth = {
  signUp: async (email: string, password: string, metadata?: any) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    })
  },

  signInWithOAuth: async (provider: 'google' | 'github' | 'apple') => {
    return await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`
      }
    })
  },

  signOut: async () => {
    return await supabase.auth.signOut()
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  resetPassword: async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`
    })
  },

  updatePassword: async (password: string) => {
    return await supabase.auth.updateUser({ password })
  },

  updateProfile: async (updates: any) => {
    return await supabase.auth.updateUser({
      data: updates
    })
  }
}

// Database helpers
export const db = {
  users: {
    findByEmail: async (email: string) => {
      return await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()
    },

    create: async (userData: any) => {
      return await supabase
        .from('users')
        .insert([userData])
        .select()
        .single()
    },

    update: async (id: string, updates: any) => {
      return await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
    },

    findById: async (id: string) => {
      return await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
    }
  },

  groups: {
    findAll: async (limit = 20, offset = 0) => {
      return await supabase
        .from('groups')
        .select(`
          *,
          memberships:group_memberships(count)
        `)
        .range(offset, offset + limit - 1)
    },

    findById: async (id: string) => {
      return await supabase
        .from('groups')
        .select(`
          *,
          memberships:group_memberships(
            id,
            role,
            joinedAt,
            user:users(id, username, fullName, avatar)
          )
        `)
        .eq('id', id)
        .single()
    },

    create: async (groupData: any) => {
      return await supabase
        .from('groups')
        .insert([groupData])
        .select()
        .single()
    }
  },

  events: {
    findUpcoming: async (userId: string, limit = 10) => {
      return await supabase
        .from('events')
        .select(`
          *,
          createdBy:users(id, username, fullName, avatar),
          group:groups(id, name, avatar)
        `)
        .or(`createdById.eq.${userId},group.memberships.userId.eq.${userId}`)
        .gte('startTime', new Date().toISOString())
        .order('startTime', { ascending: true })
        .limit(limit)
    },

    create: async (eventData: any) => {
      return await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single()
    }
  },

  messages: {
    findByGroup: async (groupId: string, limit = 50) => {
      return await supabase
        .from('messages')
        .select(`
          *,
          sender:users(id, username, fullName, avatar)
        `)
        .eq('groupId', groupId)
        .order('createdAt', { ascending: false })
        .limit(limit)
    },

    create: async (messageData: any) => {
      return await supabase
        .from('messages')
        .insert([messageData])
        .select()
        .single()
    }
  },

  habits: {
    findByUser: async (userId: string) => {
      return await supabase
        .from('habits')
        .select(`
          *,
          logs:habit_logs(
            date,
            count,
            notes
          )
        `)
        .eq('userId', userId)
        .eq('isActive', true)
        .order('createdAt', { ascending: false })
    },

    create: async (habitData: any) => {
      return await supabase
        .from('habits')
        .insert([habitData])
        .select()
        .single()
    },

    logProgress: async (habitId: string, date: string, count = 1, notes?: string) => {
      return await supabase
        .from('habit_logs')
        .upsert([{
          habitId,
          date,
          count,
          notes
        }])
        .select()
        .single()
    }
  }
}

// Real-time subscriptions
export const realtime = {
  subscribeToGroup: (groupId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`group:${groupId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages',
        filter: `groupId=eq.${groupId}`
      }, callback)
      .subscribe()
  },

  subscribeToUserEvents: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`user:${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'events',
        filter: `createdById=eq.${userId}`
      }, callback)
      .subscribe()
  },

  unsubscribe: (subscription: any) => {
    return supabase.removeChannel(subscription)
  }
}