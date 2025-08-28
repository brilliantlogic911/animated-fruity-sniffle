import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = 'https://hhogymibdgsuwdlpfebs.supabase.co'
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
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

// Helper functions for database operations
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

  async updateMarketPool(marketId: number, poolYes: number, poolNo: number): Promise<void> {
    const { error } = await supabase
      .from('market_pools')
      .upsert({
        market_id: marketId,
        pool_yes: poolYes,
        pool_no: poolNo,
        pool_total: poolYes + poolNo
      })

    if (error) throw error
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

  async updateLeaderboard(address: string, amount: number): Promise<void> {
    const { error } = await supabase.rpc('increment_staked_amount', {
      user_address: address,
      stake_amount: amount
    })

    if (error) throw error
  },

  // Storage operations
  async uploadGraph(filename: string, buffer: Buffer): Promise<string> {
    const { data, error } = await supabase.storage
      .from('staticfruit-graphs')
      .upload(filename, buffer, {
        contentType: 'image/png',
        upsert: true
      })

    if (error) throw error
    return data.path
  },

  async getGraphUrl(filename: string): Promise<string> {
    const { data } = supabase.storage
      .from('staticfruit-graphs')
      .getPublicUrl(filename)

    return data.publicUrl
  }
}

export default supabase