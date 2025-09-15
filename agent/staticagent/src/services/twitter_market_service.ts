// services/twitter_market_service.ts
// Service to generate market suggestions based on Twitter trends

import { getTwitterTrends } from '../collectors/twitter_collector';

interface MarketSuggestion {
  title: string;
  deadline: string;
  category: string;
  volume?: number;
}

export class TwitterMarketService {
  /**
   * Generate market suggestions based on Twitter trends
   * @param locationId WOEID for location (default: US - 23424977)
   * @param count Number of trends to fetch (default: 8)
   * @returns Array of market suggestions
   */
  async generateMarketSuggestions(locationId: string = '-7608764736147602991', count: number = 8): Promise<MarketSuggestion[]> {
      try {
        const trendsData = await getTwitterTrends(locationId, count);
        const suggestions: MarketSuggestion[] = [];
        
        // Get date 30 days from now for deadline
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 30);
        const deadlineString = deadline.toISOString().split('T')[0];
        
        // Extract trends from the new data structure
        if (trendsData.timeline && trendsData.timeline.instructions) {
          for (const instruction of trendsData.timeline.instructions) {
            if (instruction.addEntries && instruction.addEntries.entries) {
              for (const entry of instruction.addEntries.entries) {
                if (entry.entryId === 'trends' && entry.content && entry.content.timelineModule && entry.content.timelineModule.items) {
                  for (const item of entry.content.timelineModule.items) {
                    if (item.item && item.item.content && item.item.content.trend) {
                      const trend = item.item.content.trend;
                      // Convert trend name to market title
                      const title = this.convertHashtagToMarketTitle(trend.name);
                      
                      // Determine category based on keywords
                      const category = this.categorizeTrend(trend.name);
                      
                      // Use a default volume since the new API doesn't provide tweet_volume
                      const volume = 10000; // Default volume
                      
                      suggestions.push({
                        title,
                        deadline: deadlineString,
                        category,
                        volume
                      });
                    }
                  }
                }
              }
            }
          }
        }
        
        // Take top 5 suggestions
        return suggestions.slice(0, 5);
      } catch (error) {
        console.error('Error generating market suggestions from Twitter trends:', error);
        return [];
      }
    }
  
  /**
   * Convert hashtag to readable market title
   * @param hashtag Hashtag from Twitter trend
   * @returns Readable market title
   */
  private convertHashtagToMarketTitle(hashtag: string): string {
    // Remove # symbol and convert to title case
    let title = hashtag.replace('#', '');
    
    // Add spaces before capital letters (for camelCase or PascalCase)
    title = title.replace(/([A-Z])/g, ' $1').trim();
    
    // Add question mark for market format
    if (!title.endsWith('?')) {
      title += '?';
    }
    
    return title;
  }
  
  /**
   * Categorize trend based on keywords
   * @param trend Trend name
   * @returns Category string
   */
  private categorizeTrend(trend: string): string {
    const trendLower = trend.toLowerCase();
    
    if (trendLower.includes('album') || trendLower.includes('song') || trendLower.includes('music')) {
      return 'music';
    } else if (trendLower.includes('movie') || trendLower.includes('film') || trendLower.includes('cinema')) {
      return 'entertainment';
    } else if (trendLower.includes('sport') || trendLower.includes('game') || trendLower.includes('championship')) {
      return 'sports';
    } else if (trendLower.includes('tech') || trendLower.includes('app') || trendLower.includes('digital')) {
      return 'technology';
    } else if (trendLower.includes('fashion') || trendLower.includes('style') || trendLower.includes('clothing')) {
      return 'fashion';
    } else {
      return 'trending';
    }
  }
  
  /**
   * Enhance existing market suggestions with Twitter sentiment
   * @param existingMarkets Current market suggestions
   * @returns Enhanced market suggestions with Twitter data
   */
  async enhanceMarketSuggestions(existingMarkets: any[]): Promise<any[]> {
      try {
        // Get US trends
        const trendsData = await getTwitterTrends('-7608764736147602991', 20);
        
        // Create a map of trend names to volume
        const trendVolumeMap = new Map<string, number>();
        
        // Extract trends from the new data structure for volume mapping
        if (trendsData.timeline && trendsData.timeline.instructions) {
          for (const instruction of trendsData.timeline.instructions) {
            if (instruction.addEntries && instruction.addEntries.entries) {
              for (const entry of instruction.addEntries.entries) {
                if (entry.entryId === 'trends' && entry.content && entry.content.timelineModule && entry.content.timelineModule.items) {
                  for (const item of entry.content.timelineModule.items) {
                    if (item.item && item.item.content && item.item.content.trend) {
                      const trend = item.item.content.trend;
                      // Use default volume since the new API doesn't provide tweet_volume
                      const volume = 10000;
                      // Normalize trend name for matching
                      const normalizedName = trend.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                      trendVolumeMap.set(normalizedName, volume);
                    }
                  }
                }
              }
            }
          }
        }
        
        // Enhance existing markets with Twitter data
        const enhancedMarkets = existingMarkets.map(market => {
          // Try to find matching trend
          const marketNameNormalized = market.title.toLowerCase().replace(/[^a-z0-9]/g, '');
          const twitterVolume = trendVolumeMap.get(marketNameNormalized);
          
          if (twitterVolume) {
            return {
              ...market,
              twitter_volume: twitterVolume,
              // Adjust odds based on Twitter volume (higher volume = more certainty)
              priorYes: this.calculateAdjustedOdds(twitterVolume, market.priorYes)
            };
          }
          
          return market;
        });
        
        return enhancedMarkets;
      } catch (error) {
        console.error('Error enhancing market suggestions with Twitter data:', error);
        return existingMarkets;
      }
    }
  
  /**
   * Calculate adjusted odds based on Twitter volume
   * @param volume Twitter volume
   * @param currentOdds Current odds
   * @returns Adjusted odds
   */
  private calculateAdjustedOdds(volume: number, currentOdds: number): number {
    // Define volume thresholds
    const highVolumeThreshold = 100000;
    const mediumVolumeThreshold = 50000;
    
    // Adjust odds based on volume
    if (volume > highVolumeThreshold) {
      // High volume trends are more certain - move odds toward 0 or 1
      if (currentOdds > 0.5) {
        return Math.min(0.95, currentOdds + 0.1);
      } else {
        return Math.max(0.05, currentOdds - 0.1);
      }
    } else if (volume > mediumVolumeThreshold) {
      // Medium volume trends - moderate adjustment
      if (currentOdds > 0.5) {
        return Math.min(0.9, currentOdds + 0.05);
      } else {
        return Math.max(0.1, currentOdds - 0.05);
      }
    }
    
    // Low volume or no adjustment needed
    return currentOdds;
  }
}