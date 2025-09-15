# Implementation Steps for Twitter API Integration

## Overview
This document provides step-by-step instructions for implementing the Twitter API integration in the StaticFruit application. The integration will enhance the Markets, Horoscope, and Bars features with real-time Twitter trends data.

## Prerequisites
- Node.js 16+
- Access to the StaticFruit codebase
- X_RAPIDAPI_KEY for Twitter API access

## Step 1: Environment Setup

### 1.1 Add API Key to Environment Variables
Add the following line to `staticfruit_kit/.env`:
```
X_RAPIDAPI_KEY=a49f135d8cmsh547ccd0272a3b80p150b23jsn1623c6be959e
```

Update `staticfruit_kit/.env.template` to include:
```
# Twitter API
X_RAPIDAPI_KEY=your_rapidapi_key_here
```

## Step 2: Create Twitter Collector

### 2.1 Create Collector File
Create `staticfruit_kit/collectors/twitter_collector.ts` with the following content:

```typescript
// Collector for Twitter trends data using RapidAPI
import https from 'https';

interface TwitterTrend {
  name: string;
  url: string;
  promoted_content: string | null;
  query: string;
  tweet_volume: number | null;
}

interface TwitterTrendsResponse {
  trends: TwitterTrend[];
  as_of: string;
  created_at: string;
  locations: {
    name: string;
    woeid: number;
  }[];
}

export async function getTwitterTrends(locationId: string = '-7608764736147602991', count: number = 20): Promise<TwitterTrendsResponse> {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: 'twitter135.p.rapidapi.com',
      port: null,
      path: `/v1.1/Trends/?location_id=${locationId}&count=${count}`,
      headers: {
        'x-rapidapi-key': process.env.X_RAPIDAPI_KEY || '',
        'x-rapidapi-host': 'twitter135.p.rapidapi.com'
      }
    };

    const req = https.request(options, function (res) {
      const chunks: any[] = [];

      res.on('data', function (chunk) {
        chunks.push(chunk);
      });

      res.on('end', function () {
        const body = Buffer.concat(chunks);
        try {
          const result = JSON.parse(body.toString());
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.end();
  });
}
```

## Step 3: Create Twitter Service

### 3.1 Create Service File
Create `staticfruit_kit/services/twitter_service.ts` with the following content:

```typescript
import { getTwitterTrends, TwitterTrend } from '../collectors/twitter_collector';

interface MarketTrend {
  id: string;
  title: string;
  yes: number;
  volume?: number;
}

interface BarTrend {
  user: string;
  text: string;
}

export class TwitterService {
  static async getMarketTrends(): Promise<MarketTrend[]> {
    try {
      const response = await getTwitterTrends();
      return response.trends.map(trend => ({
        id: trend.name,
        title: trend.name,
        yes: trend.tweet_volume ? Math.min(0.99, Math.max(0.01, trend.tweet_volume / 100000)) : 0.5,
        volume: trend.tweet_volume
      }));
    } catch (error) {
      console.error('Error fetching market trends:', error);
      return [];
    }
  }

  static getTopTrendsForHoroscope(trends: TwitterTrend[]): string[] {
    return trends.slice(0, 5).map(t => t.name);
  }

  static formatForBars(trends: TwitterTrend[]): BarTrend[] {
    return trends.slice(0, 10).map((trend, index) => ({
      user: `@trend${index}`,
      text: `#${trend.name} is trending with ${trend.tweet_volume || 'unknown'} tweets`
    }));
  }
}
```

## Step 4: Create API Routes

### 4.1 Create Route File
Create `staticfruit_kit/api/routes/twitter_trends.ts` with the following content:

```typescript
// /ai/twitter-trends
import { FastifyInstance } from 'fastify';
import { getTwitterTrends } from '../../collectors/twitter_collector';
import { TwitterService } from '../../services/twitter_service';

export default async function routes(app: FastifyInstance) {
  app.get('/twitter-trends', async (req, reply) => {
    try {
      const { locationId, count } = (req.query as any) ?? {};
      const trends = await getTwitterTrends(locationId, count);
      return reply.send(trends);
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to fetch Twitter trends' });
    }
  });
  
  app.get('/twitter-trends/markets', async (req, reply) => {
    try {
      const marketTrends = await TwitterService.getMarketTrends();
      return reply.send(marketTrends);
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to fetch Twitter trends for markets' });
    }
  });
  
  app.post('/twitter-trends/horoscope', async (req, reply) => {
    try {
      const { sign, date } = (req.body as any) ?? {};
      const trends = await getTwitterTrends();
      const topTrends = TwitterService.getTopTrendsForHoroscope(trends.trends);
      
      // This would be enhanced with actual AI processing
      const result = {
        sign,
        date,
        trends: topTrends,
        prediction: `With ${topTrends[0]} trending, your ${sign} energy is aligned with digital movements.`
      };
      
      return reply.send(result);
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to fetch Twitter trends for horoscope' });
    }
  });
}
```

### 4.2 Register Route in Server
Update `staticfruit_kit/api/server.ts` to include:

```typescript
// Add to imports at the top
import twitterTrends from './routes/twitter_trends';

// Add after other route registrations
server.register(twitterTrends, { prefix: '/ai' });
```

## Step 5: Update Frontend API Library

### 5.1 Update API Functions
Update `staticfruit_next_starter/lib/api.ts` to include:

```typescript
// Add new functions
export async function getTwitterTrends() {
  const res = await fetch(API("/ai/twitter-trends"), { method: "GET" });
  return res.json();
}

export async function getMarketTrends() {
  const res = await fetch(API("/ai/twitter-trends/markets"), { method: "GET" });
  return res.json();
}

export async function getHoroscopeWithTrends(sign: string, date: string) {
  const res = await fetch(API("/ai/twitter-trends/horoscope"), { 
    method: "POST", 
    headers: {"content-type":"application/json"}, 
    body: JSON.stringify({ sign, date }) 
  });
  return res.json();
}
```

## Step 6: Update Feature Implementations

### 6.1 Update Markets Feature
Update `staticfruit_next_starter/app/markets/page.tsx`:

```typescript
// Update the getMarkets function
export async function getMarkets() {
  // Use real API endpoint
  return getMarketTrends();
}
```

### 6.2 Update Horoscope Feature
Update `staticfruit_next_starter/app/horoscope/page.tsx`:

```typescript
// Update the getHoroscope function
export async function getHoroscope(sign: string, date: string) {
  // Use enhanced API endpoint
  return getHoroscopeWithTrends(sign, date);
}
```

### 6.3 Update Bars Feature
Update `staticfruit_next_starter/lib/api.ts` getTrendingBars function:

```typescript
export async function getTrendingBars() {
  try {
    const trends = await getTwitterTrends();
    // Transform Twitter trends into bar format
    return trends.trends.slice(0, 10).map((trend, index) => ({
      user: `@trend${index}`,
      text: `#${trend.name} is trending with ${trend.tweet_volume || 'unknown'} tweets`
    }));
  } catch (error) {
    console.error('Error fetching Twitter trends for bars:', error);
    // Fallback data
    return [{ user: "@luna", text: "On Base I move silent like gasless txns" }];
  }
}
```

## Step 7: Testing

### 7.1 Unit Tests
Create test files for each new component:
- `staticfruit_kit/collectors/twitter_collector.test.ts`
- `staticfruit_kit/services/twitter_service.test.ts`
- `staticfruit_kit/api/routes/twitter_trends.test.ts`

### 7.2 Integration Tests
Test the end-to-end flow for each feature:
1. Markets feature displays Twitter trends
2. Horoscope feature incorporates Twitter trends
3. Bars feature shows Twitter trend data

### 7.3 Manual Testing
1. Start the API server: `cd staticfruit_kit && npm run dev`
2. Start the frontend: `cd staticfruit_next_starter && npm run dev`
3. Visit each feature page to verify data is displayed correctly
4. Check browser console for any errors

## Step 8: Deployment

### 8.1 Environment Configuration
Ensure the production environment has the `X_RAPIDAPI_KEY` configured.

### 8.2 Monitoring
Set up monitoring for:
- API response times
- Error rates
- API usage quotas

## Troubleshooting

### Common Issues
1. **API Key Errors**: Verify `X_RAPIDAPI_KEY` is correctly set in environment variables
2. **Network Issues**: Check firewall settings and network connectivity to RapidAPI
3. **Rate Limiting**: Implement caching if hitting rate limits
4. **Data Formatting**: Ensure data transformation matches expected frontend formats

### Debugging Steps
1. Check API server logs for errors
2. Verify environment variables are loaded correctly
3. Test API endpoints directly with curl or Postman
4. Check browser developer tools for frontend errors