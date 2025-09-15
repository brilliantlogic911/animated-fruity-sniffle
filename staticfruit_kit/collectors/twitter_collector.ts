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

// WOEID mappings for common locations
const WOEID_MAPPINGS = {
  United_States: 23424977,
  Global: 1,
  New_York_City: 2459115,
  Los_Angeles: 2442047,
  Miami: 2450022,
  Dallas: 2388929,
  Detroit: 2391585
};

export async function getTwitterTrends(locationId: string = '-7608764736147602991', count: number = 8): Promise<TwitterTrendsResponse> {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: 'twitter135.p.rapidapi.com',
      port: null,
      path: `/v1.1/Trends/?location_id=${locationId}&count=${count}`,
      headers: {
        'x-rapidapi-key': process.env.X_RAPIDAPI_KEY || 'a49f135d8cmsh547ccd0272a3b80p150b23jsn1623c6be959e',
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

// Example usage function for Detroit trends
export async function getDetroitTrends(count: number = 20): Promise<TwitterTrend[]> {
  const res = await fetch(
    `https://twitter135.p.rapidapi.com/v1.1/Trends/?location_id=2391585&count=${count}`,
    {
      headers: {
        "x-rapidapi-host": "twitter135.p.rapidapi.com",
        "x-rapidapi-key": process.env.X_RAPIDAPI_KEY || 'a49f135d8cmsh547ccd0272a3b80p150b23jsn1623c6be959e'
      }
    }
  );
  const data: any = await res.json();
  return data.trends;
}

// Additional function to get available locations
export async function getTwitterLocations(): Promise<any> {
  return new Promise((resolve, reject) => {
    const options = {
      method: 'GET',
      hostname: 'twitter135.p.rapidapi.com',
      port: null,
      path: '/v1.1/Locations/',
      headers: {
        'x-rapidapi-key': process.env.X_RAPIDAPI_KEY || 'a49f135d8cmsh547ccd0272a3b80p150b23jsn1623c6be959e',
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