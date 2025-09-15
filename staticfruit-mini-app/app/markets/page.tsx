'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import InteractivePredictionCard from '@/components/InteractivePredictionCard';
import MarketCharts from '@/components/MarketCharts';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import InfiniteScroll from 'react-infinite-scroll-component';

interface Prediction {
  id: number;
  title: string;
  yes: number;
  createdAt: number;
}

export default function Page() {
  const [activeTab, setActiveTab] = React.useState('cards');
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  
  // Mock data for charts - in a real app, this would come from an API
  const oddsData = [
    {market_id: 1, odds_yes: 0.54, odds_no: 0.46},
    {market_id: 2, odds_yes: 0.32, odds_no: 0.68},
    {market_id: 3, odds_yes: 0.78, odds_no: 0.22},
    {market_id: 4, odds_yes: 0.61, odds_no: 0.39},
    {market_id: 5, odds_yes: 0.45, odds_no: 0.55}
  ];

  const poolsData = [
    {market_id: 1, pool_yes: 479, pool_no: 160, market_title: 'Market #1'},
    {market_id: 2, pool_yes: 320, pool_no: 280, market_title: 'Market #2'},
    {market_id: 3, pool_yes: 650, pool_no: 120, market_title: 'Market #3'},
    {market_id: 4, pool_yes: 410, pool_no: 350, market_title: 'Market #4'},
    {market_id: 5, pool_yes: 290, pool_no: 420, market_title: 'Market #5'}
  ];

  const leaderboardData = [
    {address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', total_staked: 600},
    {address: '0x1234567890123456789012345678901234567890', total_staked: 500},
    {address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', total_staked: 400},
    {address: '0x9876543210987654321098765432109876543210', total_staked: 300},
    {address: '0xfedcba0987654321fedcba0987654321fedcba09', total_staked: 200}
  ];

  // Fetch initial predictions
  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const res = await fetch(`/api/predictions?limit=5${nextCursor ? `&cursor=${nextCursor}` : ''}`);
      const data = await res.json();
      
      setPredictions(prev => [...prev, ...data.predictions]);
      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Failed to fetch predictions:', error);
    }
  };

  return (
    <div className='max-w-md mx-auto px-4 pb-20'>
      <Header />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="cards" active={activeTab === 'cards'} onClick={() => setActiveTab('cards')}>
            Markets
          </TabsTrigger>
          <TabsTrigger value="charts" active={activeTab === 'charts'} onClick={() => setActiveTab('charts')}>
            Charts
          </TabsTrigger>
        </TabsList>
        
        <TabsContent active={activeTab === 'cards'}>
          <InfiniteScroll
            dataLength={predictions.length}
            next={fetchPredictions}
            hasMore={hasMore}
            loader={<h4 className="text-gray-400 text-center py-4">Loading...</h4>}
            endMessage={<p className="text-gray-500 text-center py-4">No more predictions</p>}
          >
            {predictions.map(prediction => (
              <InteractivePredictionCard key={prediction.id} prediction={prediction} />
            ))}
          </InfiniteScroll>
        </TabsContent>
        
        <TabsContent active={activeTab === 'charts'}>
          <MarketCharts
            oddsData={oddsData}
            poolsData={poolsData}
            leaderboardData={leaderboardData}
          />
        </TabsContent>
      </Tabs>
      
      <BottomNav />
    </div>
  );
}