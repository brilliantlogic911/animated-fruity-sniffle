'use client';

import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { ThumbsUp, MessageCircle, Share2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import BaseAuthButton from './BaseAuthButton';

// Blockchain Design System Colors
const colors = {
  primary: {
    deepSpaceBlack: '#0D0D0D',
    electricPurple: '#7B2CBF',
    neonGreen: '#39FF14'
  },
  accent: {
    gold: '#FFB700',
    cyan: '#00FFFF',
    crimson: '#DC143C'
  },
  supporting: {
    charcoal: '#36454F',
    silver: '#C0C0C0',
    white: '#FFFFFF'
  }
};

interface OddsData {
  market_id: number;
  odds_yes: number;
  odds_no: number;
}

interface PoolsData {
  market_id: number;
  pool_yes: number;
  pool_no: number;
  market_title: string;
}

interface LeaderboardData {
  address: string;
  total_staked: number;
}

interface MarketChartsProps {
  oddsData: OddsData[];
  poolsData: PoolsData[];
  leaderboardData: LeaderboardData[];
}

const MarketCharts: React.FC<MarketChartsProps> = ({ oddsData, poolsData, leaderboardData }) => {
  const { isConnected, userAddress, trackEvent } = useAuth();
  // State for tracking interactions
  const [likes, setLikes] = useState<Record<number, number>>({});
  const [comments, setComments] = useState<Record<number, number>>({});
  const [shares, setShares] = useState<Record<number, number>>({});
  const [stakeAmounts, setStakeAmounts] = useState<Record<number, number>>({});
  const [selectedSides, setSelectedSides] = useState<Record<number, 'yes' | 'no' | null>>({});
  const [showAuthPrompts, setShowAuthPrompts] = useState<Record<number, boolean>>({});
  
  // State for real-time data
  const [realTimeOddsData, setRealTimeOddsData] = useState<OddsData[]>(oddsData);
  const [realTimePoolsData, setRealTimePoolsData] = useState<PoolsData[]>(poolsData);
  const [realTimeLeaderboardData, setRealTimeLeaderboardData] = useState<LeaderboardData[]>(leaderboardData);

  // Transform pools data for bar chart
  const poolsChartData = realTimePoolsData.map(item => ({
    name: `Market ${item.market_id}`,
    yes: item.pool_yes,
    no: item.pool_no
  }));

  // Transform leaderboard data for bar chart (top 5)
  const leaderboardChartData = realTimeLeaderboardData
    .sort((a, b) => b.total_staked - a.total_staked)
    .slice(0, 5)
    .map((item, index) => ({
      name: `User ${index + 1}`,
      staked: item.total_staked
    }));

  // Fetch real-time interaction counts
  useEffect(() => {
    const fetchInteractions = async (marketId: number) => {
      try {
        // Fetch likes
        const likesRes = await fetch(`/api/like?predictionId=${marketId}`);
        const likesData = await likesRes.json();
        setLikes(prev => ({
          ...prev,
          [marketId]: likesData.likes || 0
        }));
        
        // Fetch comments
        const commentsRes = await fetch(`/api/comment?predictionId=${marketId}`);
        const commentsData = await commentsRes.json();
        setComments(prev => ({
          ...prev,
          [marketId]: commentsData.comments?.length || 0
        }));
        
        // Fetch shares
        const sharesRes = await fetch(`/api/share?predictionId=${marketId}`);
        const sharesData = await sharesRes.json();
        setShares(prev => ({
          ...prev,
          [marketId]: sharesData.shares || 0
        }));
      } catch (error) {
        console.error(`Failed to fetch interactions for market ${marketId}:`, error);
      }
    };

    // Fetch interactions for all markets
    fetchInteractions(1);
    fetchInteractions(2);
    fetchInteractions(3);
    
    // Poll for updates every 5 seconds
    const interval = setInterval(() => {
      fetchInteractions(1);
      fetchInteractions(2);
      fetchInteractions(3);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Fetch real-time market data
  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        // In a real app, this would fetch updated data from an API
        // For now, we'll simulate small changes to the data
        
        // Update odds data
        setRealTimeOddsData(prev => {
          return prev.map(item => {
            const changeYes = (Math.random() - 0.5) * 0.02;
            const changeNo = (Math.random() - 0.5) * 0.02;
            return {
              ...item,
              odds_yes: Math.max(0.01, Math.min(0.99, item.odds_yes + changeYes)),
              odds_no: Math.max(0.01, Math.min(0.99, item.odds_no + changeNo))
            };
          });
        });
        
        // Update pools data
        setRealTimePoolsData(prev => {
          return prev.map(item => {
            const changeYes = Math.floor((Math.random() - 0.3) * 10);
            const changeNo = Math.floor((Math.random() - 0.3) * 10);
            return {
              ...item,
              pool_yes: Math.max(0, item.pool_yes + changeYes),
              pool_no: Math.max(0, item.pool_no + changeNo)
            };
          });
        });
        
        // Update leaderboard data
        setRealTimeLeaderboardData(prev => {
          return prev.map(item => {
            const change = Math.floor((Math.random() - 0.2) * 5);
            return {
              ...item,
              total_staked: Math.max(0, item.total_staked + change)
            };
          });
        });
      } catch (error) {
        console.error('Failed to fetch market data:', error);
      }
    };

    // Poll for market data updates every 10 seconds
    const interval = setInterval(fetchMarketData, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleLike = async (marketId: number) => {
    try {
      // Track like attempt
      trackEvent('market_like_attempt', { marketId });
      
      // Optimistic update
      setLikes(prev => ({
        ...prev,
        [marketId]: (prev[marketId] || 0) + 1
      }));
      
      // API call
      const response = await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ predictionId: marketId })
      });
      
      const data = await response.json();
      if (!data.success) {
        // Revert if failed
        setLikes(prev => ({
          ...prev,
          [marketId]: Math.max(0, (prev[marketId] || 0) - 1)
        }));
        trackEvent('market_like_error', { marketId, error: data.error });
      } else {
        trackEvent('market_like_success', { marketId });
      }
    } catch (error: unknown) {
      // Revert if failed
      setLikes(prev => ({
        ...prev,
        [marketId]: Math.max(0, (prev[marketId] || 0) - 1)
      }));
      trackEvent('market_like_error', { marketId, error: (error as Error).message });
      console.error('Failed to like market:', error);
    }
  };

  const handleComment = async (marketId: number) => {
    try {
      // Track comment attempt
      trackEvent('market_comment_attempt', { marketId });
      
      // Optimistic update
      setComments(prev => ({
        ...prev,
        [marketId]: (prev[marketId] || 0) + 1
      }));
      
      // API call
      const response = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          predictionId: marketId,
          text: 'Great market!',
          user: userAddress || 'anonymous'
        })
      });
      
      const data = await response.json();
      if (!data.success) {
        // Revert if failed
        setComments(prev => ({
          ...prev,
          [marketId]: Math.max(0, (prev[marketId] || 0) - 1)
        }));
        trackEvent('market_comment_error', { marketId, error: data.error });
      } else {
        trackEvent('market_comment_success', { marketId });
      }
    } catch (error: unknown) {
      // Revert if failed
      setComments(prev => ({
        ...prev,
        [marketId]: Math.max(0, (prev[marketId] || 0) - 1)
      }));
      trackEvent('market_comment_error', { marketId, error: (error as Error).message });
      console.error('Failed to comment on market:', error);
    }
  };

  const handleShare = async (marketId: number, platform: string) => {
    try {
      // Track share attempt
      trackEvent('market_share_attempt', { marketId, platform });
      
      // Optimistic update
      setShares(prev => ({
        ...prev,
        [marketId]: (prev[marketId] || 0) + 1
      }));
      
      // API call
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ predictionId: marketId, platform })
      });
      
      const data = await response.json();
      if (!data.success) {
        // Revert if failed
        setShares(prev => ({
          ...prev,
          [marketId]: Math.max(0, (prev[marketId] || 0) - 1)
        }));
        trackEvent('market_share_error', { marketId, platform, error: data.error });
      } else {
        trackEvent('market_share_success', { marketId, platform });
      }
    } catch (error: unknown) {
      // Revert if failed
      setShares(prev => ({
        ...prev,
        [marketId]: Math.max(0, (prev[marketId] || 0) - 1)
      }));
      trackEvent('market_share_error', { marketId, platform, error: (error as Error).message });
      console.error('Failed to share market:', error);
    }
  };

  const handleStake = async (marketId: number) => {
    const amount = stakeAmounts[marketId] || 0;
    const side = selectedSides[marketId];
    
    if (!side || amount <= 0) return;
    
    // Check if user is connected
    if (!isConnected) {
      setShowAuthPrompts(prev => ({ ...prev, [marketId]: true }));
      trackEvent('stake_auth_prompt_shown', { marketId });
      return;
    }
    
    try {
      // Track stake attempt
      trackEvent('market_stake_attempt', {
        marketId,
        amount,
        side,
        userAddress: userAddress?.slice(0, 6) + '...' + userAddress?.slice(-4)
      });
      
      // API call
      const response = await fetch('/api/stake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          predictionId: marketId,
          amount,
          side
        })
      });
      
      const data = await response.json();
      if (data.success) {
        // Reset staking form for this market
        setStakeAmounts(prev => ({
          ...prev,
          [marketId]: 0
        }));
        setSelectedSides(prev => ({
          ...prev,
          [marketId]: null
        }));
        trackEvent('market_stake_success', {
          marketId,
          amount,
          side,
          userAddress: userAddress?.slice(0, 6) + '...' + userAddress?.slice(-4)
        });
      } else {
        trackEvent('market_stake_error', { marketId, amount, side, error: data.error });
        console.error('Failed to stake:', data.error);
      }
    } catch (error: unknown) {
      trackEvent('market_stake_error', { marketId, amount, side, error: (error as Error).message });
      console.error('Failed to stake:', error);
    }
  };

  const handleAuthSuccess = (marketId: number) => {
    setShowAuthPrompts(prev => ({ ...prev, [marketId]: false }));
    // Auto-trigger stake after successful auth
    setTimeout(() => {
      handleStake(marketId);
    }, 500);
  };

  return (
    <div className="space-y-8">
      {/* Odds Line Chart */}
      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold" style={{ color: colors.primary.electricPurple }}>
            Market Odds Over Time
          </h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLike(1)}
              className="flex items-center gap-1 text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <ThumbsUp size={16} />
              <span>{likes[1] || 0}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleComment(1)}
              className="flex items-center gap-1 text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <MessageCircle size={16} />
              <span>{comments[1] || 0}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare(1, 'twitter')}
              className="flex items-center gap-1 text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <Share2 size={16} />
              <span>{shares[1] || 0}</span>
            </Button>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={realTimeOddsData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={colors.supporting.charcoal} />
              <XAxis
                dataKey="market_id"
                stroke={colors.supporting.silver}
                tick={{ fill: colors.supporting.silver }}
              />
              <YAxis
                stroke={colors.supporting.silver}
                tick={{ fill: colors.supporting.silver }}
                domain={[0, 1]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.primary.deepSpaceBlack,
                  borderColor: colors.supporting.charcoal,
                  color: colors.supporting.white
                }}
                itemStyle={{ color: colors.supporting.white }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="odds_yes"
                name="Yes Odds"
                stroke={colors.primary.neonGreen}
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="odds_no"
                name="No Odds"
                stroke={colors.accent.crimson}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Auth Prompt for Staking */}
        {showAuthPrompts[1] && (
          <div className="mb-4 p-4 bg-purple-900/20 border border-purple-700 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Connect to Stake</h3>
            <p className="text-sm text-gray-300 mb-3">
              Connect your Base Account to stake on this market.
            </p>
            <BaseAuthButton onConnect={() => handleAuthSuccess(1)} />
          </div>
        )}
        
        {/* Staking Section for Odds Chart */}
        <div className="border-t border-gray-700 pt-4 mt-4">
          <div className="flex gap-2 mb-3">
            <Button
              variant={selectedSides[1] === 'yes' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSides(prev => ({ ...prev, 1: 'yes' }))}
              className={selectedSides[1] === 'yes' ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              <TrendingUp size={16} className="mr-1" />
              Back YES
            </Button>
            
            <Button
              variant={selectedSides[1] === 'no' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSides(prev => ({ ...prev, 1: 'no' }))}
              className={selectedSides[1] === 'no' ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              <TrendingUp size={16} className="mr-1" />
              Back NO
            </Button>
          </div>
          
          {selectedSides[1] && (
            <div className="flex gap-2">
              <input
                type="number"
                value={stakeAmounts[1] || ''}
                onChange={(e) => setStakeAmounts(prev => ({ ...prev, 1: Number(e.target.value) }))}
                placeholder="Amount"
                className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                min="0"
              />
              <Button
                onClick={() => handleStake(1)}
                disabled={(stakeAmounts[1] || 0) <= 0}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Stake
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Pools Bar Chart */}
      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold" style={{ color: colors.accent.gold }}>
            Market Pools Comparison
          </h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLike(2)}
              className="flex items-center gap-1 text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <ThumbsUp size={16} />
              <span>{likes[2] || 0}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleComment(2)}
              className="flex items-center gap-1 text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <MessageCircle size={16} />
              <span>{comments[2] || 0}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare(2, 'twitter')}
              className="flex items-center gap-1 text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <Share2 size={16} />
              <span>{shares[2] || 0}</span>
            </Button>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={poolsChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={colors.supporting.charcoal} />
              <XAxis
                dataKey="name"
                stroke={colors.supporting.silver}
                tick={{ fill: colors.supporting.silver }}
              />
              <YAxis
                stroke={colors.supporting.silver}
                tick={{ fill: colors.supporting.silver }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.primary.deepSpaceBlack,
                  borderColor: colors.supporting.charcoal,
                  color: colors.supporting.white
                }}
                itemStyle={{ color: colors.supporting.white }}
              />
              <Legend />
              <Bar
                dataKey="yes"
                name="Yes Pool"
                fill={colors.primary.neonGreen}
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="no"
                name="No Pool"
                fill={colors.accent.crimson}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Auth Prompt for Staking */}
        {showAuthPrompts[2] && (
          <div className="mb-4 p-4 bg-purple-900/20 border border-purple-700 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Connect to Stake</h3>
            <p className="text-sm text-gray-300 mb-3">
              Connect your Base Account to stake on this market.
            </p>
            <BaseAuthButton onConnect={() => handleAuthSuccess(2)} />
          </div>
        )}
        
        {/* Staking Section for Pools Chart */}
        <div className="border-t border-gray-700 pt-4 mt-4">
          <div className="flex gap-2 mb-3">
            <Button
              variant={selectedSides[2] === 'yes' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSides(prev => ({ ...prev, 2: 'yes' }))}
              className={selectedSides[2] === 'yes' ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              <TrendingUp size={16} className="mr-1" />
              Back YES
            </Button>
            
            <Button
              variant={selectedSides[2] === 'no' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSides(prev => ({ ...prev, 2: 'no' }))}
              className={selectedSides[2] === 'no' ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              <TrendingUp size={16} className="mr-1" />
              Back NO
            </Button>
          </div>
          
          {selectedSides[2] && (
            <div className="flex gap-2">
              <input
                type="number"
                value={stakeAmounts[2] || ''}
                onChange={(e) => setStakeAmounts(prev => ({ ...prev, 2: Number(e.target.value) }))}
                placeholder="Amount"
                className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                min="0"
              />
              <Button
                onClick={() => handleStake(2)}
                disabled={(stakeAmounts[2] || 0) <= 0}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Stake
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Leaderboard Bar Chart */}
      <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold" style={{ color: colors.accent.cyan }}>
            Top Stakers Leaderboard
          </h3>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLike(3)}
              className="flex items-center gap-1 text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <ThumbsUp size={16} />
              <span>{likes[3] || 0}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleComment(3)}
              className="flex items-center gap-1 text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <MessageCircle size={16} />
              <span>{comments[3] || 0}</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleShare(3, 'twitter')}
              className="flex items-center gap-1 text-gray-300 hover:text-white hover:bg-gray-800"
            >
              <Share2 size={16} />
              <span>{shares[3] || 0}</span>
            </Button>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={leaderboardChartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={colors.supporting.charcoal} />
              <XAxis
                dataKey="name"
                stroke={colors.supporting.silver}
                tick={{ fill: colors.supporting.silver }}
              />
              <YAxis
                stroke={colors.supporting.silver}
                tick={{ fill: colors.supporting.silver }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: colors.primary.deepSpaceBlack,
                  borderColor: colors.supporting.charcoal,
                  color: colors.supporting.white
                }}
                itemStyle={{ color: colors.supporting.white }}
              />
              <Legend />
              <Bar
                dataKey="staked"
                name="Total Staked"
                fill={colors.accent.gold}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MarketCharts;