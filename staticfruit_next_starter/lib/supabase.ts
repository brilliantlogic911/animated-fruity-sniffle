import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hhogymibdgsuwdlpfebs.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types for type safety
export interface MarketPool {
  market_id: number
  pool_yes: number
  pool_no: number
  pool_total: number
}

export interface LeaderboardEntry {
  address: string
  total_staked: number
}

// Helper functions for frontend operations
export const db = {
  // Market pools
  async getMarketPools(): Promise<MarketPool[]> {
    const { data, error } = await supabase
      .from('market_pools')
      .select('*')
      .order('market_id')

    if (error) throw error
    return data || []
  },

  // Leaderboard
  async getLeaderboard(limit = 10): Promise<LeaderboardEntry[]> {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('total_staked', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  },

  // Storage operations
  async getGraphUrl(filename: string): Promise<string> {
    const { data } = supabase.storage
      .from('staticfruit-graphs')
      .getPublicUrl(filename)

    return data.publicUrl
  }
}

export default supabase