// /graphs/:marketId
import { FastifyInstance } from 'fastify';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execPromise = promisify(exec);

// Mock data for demonstration
interface MarketData {
  pools: {
    yes: number;
    no: number;
  };
  odds: {
    yes: number;
    no: number;
  };
  leaderboard: Array<{
    address: string;
    staked: number;
  }>;
}

function getMockMarketData(marketId: number): MarketData {
  // Generate mock data based on market ID
  const baseValue = marketId * 100;
  
  return {
    pools: {
      yes: baseValue + Math.floor(Math.random() * 500),
      no: baseValue + Math.floor(Math.random() * 300)
    },
    odds: {
      yes: parseFloat((0.4 + Math.random() * 0.3).toFixed(2)),
      no: parseFloat((0.3 + Math.random() * 0.4).toFixed(2))
    },
    leaderboard: [
      { address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', staked: baseValue + 500 },
      { address: '0x1234567890123456789012345678901234567890', staked: baseValue + 400 },
      { address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd', staked: baseValue + 300 },
      { address: '0x9876543210987654321098765432109876543210', staked: baseValue + 200 },
      { address: '0xfedcba0987654321fedcba0987654321fedcba09', staked: baseValue + 100 }
    ]
  };
}

async function generateGraphs(marketId: number, marketData: MarketData): Promise<{ pools: string; odds: string; leaderboard: string }> {
  // Create a temporary directory for graphs if it doesn't exist
  const graphsDir = path.join(__dirname, '..', '..', 'graphs', 'generated');
  if (!fs.existsSync(graphsDir)) {
    fs.mkdirSync(graphsDir, { recursive: true });
  }
  
  // Generate unique filenames for each graph
  const timestamp = Date.now();
  const poolsFile = `pools_${marketId}_${timestamp}.png`;
  const oddsFile = `odds_${marketId}_${timestamp}.png`;
  const leaderboardFile = `leaderboard_${marketId}_${timestamp}.png`;
  
  // Generate graphs using Python script
  try {
    // Create temporary CSV files with market data
    const dataDir = path.join(__dirname, '..', '..', 'graphs', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Write market pools data
    const poolsCsv = path.join(dataDir, `pools_${marketId}.csv`);
    const poolsContent = `market_id,pool_yes,pool_no,market_title\n${marketId},${marketData.pools.yes},${marketData.pools.no},Market #${marketId}`;
    fs.writeFileSync(poolsCsv, poolsContent);
    
    // Write odds data
    const oddsCsv = path.join(dataDir, `odds_${marketId}.csv`);
    const oddsContent = `market_id,odds_yes,odds_no\n${marketId},${marketData.odds.yes},${marketData.odds.no}`;
    fs.writeFileSync(oddsCsv, oddsContent);
    
    // Write leaderboard data
    const leaderboardCsv = path.join(dataDir, `leaderboard_${marketId}.csv`);
    let leaderboardContent = 'address,total_staked\n';
    marketData.leaderboard.forEach(entry => {
      leaderboardContent += `${entry.address},${entry.staked}\n`;
    });
    fs.writeFileSync(leaderboardCsv, leaderboardContent);
    
    // Run Python scripts to generate graphs
    const pythonPath = 'python'; // Assuming Python is in PATH
    const graphsScript = path.join(__dirname, '..', '..', 'graphs', 'generate_graph.py');
    
    // Generate pools chart
    await execPromise(`${pythonPath} ${graphsScript} --type pools --data ${poolsCsv} --output ${path.join(graphsDir, poolsFile)}`);
    
    // Generate odds chart
    await execPromise(`${pythonPath} ${graphsScript} --type odds --data ${oddsCsv} --output ${path.join(graphsDir, oddsFile)}`);
    
    // Generate leaderboard chart
    await execPromise(`${pythonPath} ${graphsScript} --type leaderboard --data ${leaderboardCsv} --output ${path.join(graphsDir, leaderboardFile)}`);
    
    // Return URLs to the generated graphs
    const baseUrl = '/graphs/generated'; // This should match the static file serving setup
    return {
      pools: `${baseUrl}/${poolsFile}`,
      odds: `${baseUrl}/${oddsFile}`,
      leaderboard: `${baseUrl}/${leaderboardFile}`
    };
  } catch (error) {
    console.error('Graph generation error:', error);
    
    // Return placeholder URLs if generation fails
    return {
      pools: '/graphs/placeholder/pools.png',
      odds: '/graphs/placeholder/odds.png',
      leaderboard: '/graphs/placeholder/leaderboard.png'
    };
  }
}

export default async function routes(app: FastifyInstance) {
  // Serve generated graphs as static files
  app.register(require('@fastify/static'), {
    root: path.join(__dirname, '..', '..', 'graphs', 'generated'),
    prefix: '/graphs/generated/',
    decorateReply: false
  });
  
  // Serve placeholder graphs as static files
  app.register(require('@fastify/static'), {
    root: path.join(__dirname, '..', '..', 'graphs', 'placeholder'),
    prefix: '/graphs/placeholder/',
    decorateReply: false
  });
  
  app.get('/graphs/:marketId', async (req, reply) => {
    const { marketId } = req.params as { marketId: string };
    const idNum = parseInt(marketId, 10);
    
    if (isNaN(idNum) || idNum <= 0) {
      return reply.code(400).send({ error: 'Invalid market ID' });
    }
    
    try {
      // Get market data (in a real implementation, this would come from a database)
      const marketData = getMockMarketData(idNum);
      
      // Generate graphs
      const graphUrls = await generateGraphs(idNum, marketData);
      
      return reply.send({
        marketId: idNum,
        urls: graphUrls
      });
    } catch (error) {
      console.error('Graphs endpoint error:', error);
      return reply.code(500).send({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}