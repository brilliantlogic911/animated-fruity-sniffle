'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import {
  ThumbsUp,
  MessageCircle,
  Share2,
  TrendingUp,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
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

interface Prediction {
  id: number;
  title: string;
  yes: number;
  createdAt: number;
}

interface InteractionCounts {
  likes: number;
  comments: number;
  shares: number;
}

interface InteractivePredictionCardProps {
  prediction: Prediction;
}

const InteractivePredictionCard: React.FC<InteractivePredictionCardProps> = ({ prediction }) => {
  const { isConnected, userAddress, trackEvent } = useAuth();
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);
  const [shares, setShares] = useState(0);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [selectedSide, setSelectedSide] = useState<'yes' | 'no' | null>(null);
  const [isStaking, setIsStaking] = useState(false);
  const [odds, setOdds] = useState(prediction.yes);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // Mock chart data for visualization
  const [chartData, setChartData] = useState([
    { time: '1d', odds: prediction.yes - 0.1 },
    { time: '2d', odds: prediction.yes - 0.05 },
    { time: '3d', odds: prediction.yes },
    { time: '4d', odds: prediction.yes + 0.03 },
    { time: '5d', odds: prediction.yes + 0.07 },
  ]);

  // Fetch real-time interaction counts
  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        // Fetch likes
        const likesRes = await fetch(`/api/like?predictionId=${prediction.id}`);
        const likesData = await likesRes.json();
        setLikes(likesData.likes || 0);
        
        // Fetch comments
        const commentsRes = await fetch(`/api/comment?predictionId=${prediction.id}`);
        const commentsData = await commentsRes.json();
        setComments(commentsData.comments?.length || 0);
        
        // Fetch shares
        const sharesRes = await fetch(`/api/share?predictionId=${prediction.id}`);
        const sharesData = await sharesRes.json();
        setShares(sharesData.shares || 0);
      } catch (error) {
        console.error('Failed to fetch interactions:', error);
      }
    };

    fetchInteractions();
    
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchInteractions, 5000);
    
    return () => clearInterval(interval);
  }, [prediction.id]);

  // Fetch real-time odds updates
  useEffect(() => {
    const fetchOdds = async () => {
      try {
        // In a real app, this would fetch updated odds from an API
        // For now, we'll simulate small changes
        setOdds(prev => {
          const change = (Math.random() - 0.5) * 0.02; // Small random change
          const newOdds = Math.max(0.01, Math.min(0.99, prev + change));
          return newOdds;
        });
      } catch (error) {
        console.error('Failed to fetch odds:', error);
      }
    };

    // Poll for odds updates every 10 seconds
    const interval = setInterval(fetchOdds, 10000);
    
    return () => clearInterval(interval);
  }, []);

  // Update chart data when odds change
  useEffect(() => {
    setChartData(prev => {
      const newData = [...prev];
      // Update the latest data point
      if (newData.length > 0) {
        newData[newData.length - 1] = { ...newData[newData.length - 1], odds };
      }
      // Add a new data point occasionally
      if (Math.random() > 0.7 && newData.length < 10) {
        newData.push({ time: `${newData.length + 1}d`, odds });
      }
      return newData;
    });
  }, [odds]);

  const handleLike = async () => {
    try {
      // Track like attempt
      trackEvent('prediction_like_attempt', { predictionId: prediction.id });
      
      // Optimistic update
      setLikes(prev => prev + 1);
      
      // API call
      const response = await fetch('/api/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ predictionId: prediction.id })
      });
      
      const data = await response.json();
      if (!data.success) {
        // Revert if failed
        setLikes(prev => prev - 1);
        trackEvent('prediction_like_error', { predictionId: prediction.id, error: data.error });
      } else {
        trackEvent('prediction_like_success', { predictionId: prediction.id });
      }
    } catch (error: any) {
      // Revert if failed
      setLikes(prev => prev - 1);
      trackEvent('prediction_like_error', { predictionId: prediction.id, error: error.message });
      console.error('Failed to like prediction:', error);
    }
  };

  const handleComment = async () => {
    try {
      // Track comment attempt
      trackEvent('prediction_comment_attempt', { predictionId: prediction.id });
      
      // Optimistic update
      setComments(prev => prev + 1);
      
      // API call
      const response = await fetch('/api/comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          predictionId: prediction.id,
          text: 'Great prediction!',
          user: userAddress || 'anonymous'
        })
      });
      
      const data = await response.json();
      if (!data.success) {
        // Revert if failed
        setComments(prev => prev - 1);
        trackEvent('prediction_comment_error', { predictionId: prediction.id, error: data.error });
      } else {
        trackEvent('prediction_comment_success', { predictionId: prediction.id });
      }
    } catch (error: any) {
      // Revert if failed
      setComments(prev => prev - 1);
      trackEvent('prediction_comment_error', { predictionId: prediction.id, error: error.message });
      console.error('Failed to comment on prediction:', error);
    }
  };

  const handleShare = async (platform: string) => {
    try {
      // Track share attempt
      trackEvent('prediction_share_attempt', { predictionId: prediction.id, platform });
      
      // Optimistic update
      setShares(prev => prev + 1);
      
      // API call
      const response = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ predictionId: prediction.id, platform })
      });
      
      const data = await response.json();
      if (!data.success) {
        // Revert if failed
        setShares(prev => prev - 1);
        trackEvent('prediction_share_error', { predictionId: prediction.id, platform, error: data.error });
      } else {
        trackEvent('prediction_share_success', { predictionId: prediction.id, platform });
      }
    } catch (error: any) {
      // Revert if failed
      setShares(prev => prev - 1);
      trackEvent('prediction_share_error', { predictionId: prediction.id, platform, error: error.message });
      console.error('Failed to share prediction:', error);
    }
  };

  const handleStake = async () => {
    if (!selectedSide || stakeAmount <= 0) return;
    
    // Check if user is connected
    if (!isConnected) {
      setShowAuthPrompt(true);
      trackEvent('stake_auth_prompt_shown', { predictionId: prediction.id });
      return;
    }
    
    try {
      setIsStaking(true);
      
      // Track stake attempt
      trackEvent('prediction_stake_attempt', {
        predictionId: prediction.id,
        amount: stakeAmount,
        side: selectedSide,
        userAddress: userAddress?.slice(0, 6) + '...' + userAddress?.slice(-4)
      });
      
      // API call
      const response = await fetch('/api/stake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          predictionId: prediction.id,
          amount: stakeAmount,
          side: selectedSide
        })
      });
      
      const data = await response.json();
      if (data.success) {
        // Reset staking form
        setStakeAmount(0);
        setSelectedSide(null);
        trackEvent('prediction_stake_success', {
          predictionId: prediction.id,
          amount: stakeAmount,
          side: selectedSide,
          userAddress: userAddress?.slice(0, 6) + '...' + userAddress?.slice(-4)
        });
      } else {
        trackEvent('prediction_stake_error', {
          predictionId: prediction.id,
          amount: stakeAmount,
          side: selectedSide,
          error: data.error
        });
        console.error('Failed to stake:', data.error);
      }
    } catch (error: any) {
      trackEvent('prediction_stake_error', {
        predictionId: prediction.id,
        amount: stakeAmount,
        side: selectedSide,
        error: error.message
      });
      console.error('Failed to stake:', error);
    } finally {
      setIsStaking(false);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthPrompt(false);
    // Auto-trigger stake after successful auth
    if (selectedSide && stakeAmount > 0) {
      setTimeout(() => {
        handleStake();
      }, 500);
    }
  };

  return (
    <Card className="mb-4 bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">{prediction.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Odds Visualization */}
        <div className="h-32 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="time"
                stroke={colors.supporting.silver}
                tick={{ fill: colors.supporting.silver, fontSize: 12 }}
              />
              <YAxis
                stroke={colors.supporting.silver}
                tick={{ fill: colors.supporting.silver, fontSize: 12 }}
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
              <ReferenceLine
                y={odds}
                stroke={colors.accent.gold}
                strokeDasharray="3 3"
              />
              <Line
                type="monotone"
                dataKey="odds"
                stroke={colors.primary.electricPurple}
                strokeWidth={2}
                dot={{ stroke: colors.primary.neonGreen, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: colors.primary.neonGreen }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Odds Display */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.primary.neonGreen }}>
              {(odds * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-400">YES</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold" style={{ color: colors.accent.crimson }}>
              {((1 - odds) * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-400">NO</div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-between mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            className="flex items-center gap-1 text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <ThumbsUp size={16} />
            <span>{likes}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleComment}
            className="flex items-center gap-1 text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <MessageCircle size={16} />
            <span>{comments}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleShare('twitter')}
            className="flex items-center gap-1 text-gray-300 hover:text-white hover:bg-gray-800"
          >
            <Share2 size={16} />
            <span>{shares}</span>
          </Button>
        </div>
        
        {/* Auth Prompt for Staking */}
        {showAuthPrompt && (
          <div className="mb-4 p-4 bg-purple-900/20 border border-purple-700 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Connect to Stake</h3>
            <p className="text-sm text-gray-300 mb-3">
              Connect your Base Account to stake on this prediction.
            </p>
            <BaseAuthButton onConnect={handleAuthSuccess} />
          </div>
        )}
        
        {/* Staking Section */}
        <div className="border-t border-gray-700 pt-4">
          <div className="flex gap-2 mb-3">
            <Button
              variant={selectedSide === 'yes' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSide('yes')}
              className={selectedSide === 'yes' ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              <ChevronUp size={16} className="mr-1" />
              Back YES
            </Button>
            
            <Button
              variant={selectedSide === 'no' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedSide('no')}
              className={selectedSide === 'no' ? 'bg-red-500 hover:bg-red-600' : ''}
            >
              <ChevronDown size={16} className="mr-1" />
              Back NO
            </Button>
          </div>
          
          {selectedSide && (
            <div className="flex gap-2">
              <input
                type="number"
                value={stakeAmount || ''}
                onChange={(e) => setStakeAmount(Number(e.target.value))}
                placeholder="Amount"
                className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                min="0"
              />
              <Button
                onClick={handleStake}
                disabled={stakeAmount <= 0 || isStaking}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isStaking ? 'Staking...' : 'Stake'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default InteractivePredictionCard;