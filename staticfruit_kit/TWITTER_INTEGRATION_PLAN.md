# Twitter API Integration Plan for StaticFruit

## Overview
This document outlines the plan for integrating Twitter trends data into the StaticFruit application using the X-RapidAPI-Key. The integration will enhance three existing features:
1. Markets feature - Using Twitter trends as market sentiment data
2. AI Horoscope feature - Incorporating Twitter trends as input for predictions
3. Bars feature - Using Twitter trends as a local area data source

## Architecture Components

### 1. Twitter Collector
Location: `staticfruit_kit/collectors/twitter_collector.ts`

This collector will be responsible for fetching Twitter trends data from the RapidAPI service.

```typescript
// collectors/twitter_collector.ts
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

### 2. Environment Configuration
Add the following to `.env` files:
```
X_RAPIDAPI_KEY=a49f135d8cmsh547ccd0272a3b80p150b23jsn1623c6be959e
```

### 3. API Route
Location: `staticfruit_kit/api/routes/twitter_trends.ts`

```typescript
// /ai/twitter-trends
import { FastifyInstance } from 'fastify';
import { getTwitterTrends } from '../../collectors/twitter_collector';

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
      const { locationId, count } = (req.query as any) ?? {};
      const trends = await getTwitterTrends(locationId, count);
      
      // Transform trends for markets feature
      const marketTrends = trends.trends.map(trend => ({
        id: trend.name,
        title: trend.name,
        yes: trend.tweet_volume ? Math.min(0.99, Math.max(0.01, trend.tweet_volume / 100000)) : 0.5,
        volume: trend.tweet_volume
      }));
      
      return reply.send(marketTrends);
    } catch (error) {
      return reply.status(500).send({ error: 'Failed to fetch Twitter trends for markets' });
    }
  });
  
  app.post('/twitter-trends/horoscope', async (req, reply) => {
    try {
      const { sign, date } = (req.body as any) ?? {};
      const trends = await getTwitterTrends();
      
      // Use top 5 trends as input for horoscope
      const topTrends = trends.trends.slice(0, 5).map(t => t.name);
      
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

### 4. API Server Registration
Update `staticfruit_kit/api/server.ts` to register the new route:

```typescript
// Add to imports
import twitterTrends from './routes/twitter_trends';

// Register the route
server.register(twitterTrends, { prefix: '/ai' });
```

### 5. Frontend API Integration
Update `staticfruit_next_starter/lib/api.ts`:

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

### 6. Feature Updates

#### Markets Feature
Update `staticfruit_next_starter/app/markets/page.tsx` to use Twitter trends data:

```typescript
// In the getMarkets function
export async function getMarkets() {
  // Use real API endpoint
  return getMarketTrends();
}
```

#### Horoscope Feature
Update `staticfruit_next_starter/app/horoscope/page.tsx` to incorporate trends:

```typescript
// In the getHoroscope function
export async function getHoroscope(sign: string, date: string) {
  // Use enhanced API endpoint
  return getHoroscopeWithTrends(sign, date);
}
```

#### Bars Feature
Update `staticfruit_next_starter/lib/api.ts` getTrendingBars function to use Twitter trends:

```typescript
export async function getTrendingBars() {
  const trends = await getTwitterTrends();
  // Transform Twitter trends into bar format
  return trends.trends.slice(0, 10).map((trend, index) => ({
    user: `@trend${index}`,
    text: `#${trend.name} is trending with ${trend.tweet_volume || 'unknown'} tweets`
  }));
}
```

## Implementation Steps
1. Create Twitter collector in `staticfruit_kit/collectors/twitter_collector.ts`
2. Add X_RAPIDAPI_KEY to environment variables
3. Create new API route in `staticfruit_kit/api/routes/twitter_trends.ts`
4. Register the new route in `staticfruit_kit/api/server.ts`
5. Update frontend API library in `staticfruit_next_starter/lib/api.ts`
6. Modify Markets feature to use Twitter trends
7. Enhance Horoscope feature with Twitter trends input
8. Update Bars feature to use Twitter trends as data source
9. Test all integrations

## Security Considerations
- Store API key in environment variables, never in code
- Implement rate limiting to prevent API abuse
- Add error handling for API failures
- Validate and sanitize all input data

## Performance Considerations
- Cache Twitter trends data to reduce API calls
- Implement background data refresh
- Use pagination for large datasets
- Monitor API usage and costs