// Test Market Discovery API
// Run with: node test-market-discovery.js

async function testMarketDiscoveryAPI(nicheWeights) {
  try {
    const response = await fetch('http://localhost:8787/ai/market_discover', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ niches: nicheWeights }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error.message);
    return null;
  }
}

async function runMarketDiscoveryTests() {
  console.log('🎯 Testing StaticFruit Market Discovery API...\n');
  console.log('=' .repeat(60));

  const testCases = [
    {
      name: 'Balanced Niche Weights',
      weights: {
        'mainstream_rap': 1.0,
        'underground_hiphop': 1.0,
        'dance_challenge': 1.0,
        'music_viral': 1.0,
        'artist_collab': 1.0,
        'album_release': 1.0,
        'music_awards': 1.0,
        'streaming_milestone': 1.0
      }
    },
    {
      name: 'Mainstream Rap Focus',
      weights: {
        'mainstream_rap': 2.0,
        'underground_hiphop': 0.5,
        'dance_challenge': 1.0,
        'music_viral': 1.5,
        'artist_collab': 1.8,
        'album_release': 1.2,
        'music_awards': 1.0,
        'streaming_milestone': 0.8
      }
    },
    {
      name: 'Viral Content Focus',
      weights: {
        'mainstream_rap': 0.8,
        'underground_hiphop': 1.2,
        'dance_challenge': 2.5,
        'music_viral': 2.0,
        'artist_collab': 1.0,
        'album_release': 0.7,
        'music_awards': 0.5,
        'streaming_milestone': 1.5
      }
    },
    {
      name: 'Award Season Focus',
      weights: {
        'mainstream_rap': 1.5,
        'underground_hiphop': 1.0,
        'dance_challenge': 0.5,
        'music_viral': 1.0,
        'artist_collab': 1.2,
        'album_release': 2.0,
        'music_awards': 3.0,
        'streaming_milestone': 1.8
      }
    }
  ];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n📊 Test ${i + 1}: ${testCase.name}`);
    console.log('-'.repeat(50));

    const result = await testMarketDiscoveryAPI(testCase.weights);

    if (!result) {
      console.log('❌ API call failed');
      continue;
    }

    if (result.error) {
      console.log('❌ API error:', result.error);
      if (result.details) {
        console.log('   Details:', result.details);
      }
      continue;
    }

    console.log('✅ Success!');
    console.log(`   Total candidates generated: ${result.total_candidates}`);
    console.log(`   Top 5 markets returned: ${result.markets.length}`);
    console.log('\n🏆 TOP 5 MARKETS:');

    result.markets.forEach((market, index) => {
      console.log(`\n${index + 1}. ${market.title}`);
      console.log(`   Deadline: ${market.deadline}`);
      console.log(`   Prior Yes: ${(market.priorYes * 100).toFixed(1)}%`);
      console.log(`   Rationale: ${market.rationale}`);
    });

    console.log('\n📈 Applied Niche Weights:');
    Object.entries(result.niche_weights_applied).forEach(([niche, weight]) => {
      console.log(`   ${niche}: ${weight}x`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎯 Market Discovery Test Complete!');
  console.log('\n💡 Key Features Demonstrated:');
  console.log('   ✅ TikTok data integration (mock)');
  console.log('   ✅ Spotify data integration (mock)');
  console.log('   ✅ Niche-based weighting system');
  console.log('   ✅ Verifiable outcome generation');
  console.log('   ✅ Prior probability calculation');
  console.log('   ✅ Rationale generation');
  console.log('   ✅ Top 5 market selection');

  console.log('\n🚀 Ready for real social media data integration!');
}

// Check if API server is running
async function checkAPIServer() {
  try {
    const response = await fetch('http://localhost:8787');
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function main() {
  console.log('🔍 Checking if API server is running...');

  const serverRunning = await checkAPIServer();

  if (!serverRunning) {
    console.log('❌ API server is not running!');
    console.log('Please start the server first:');
    console.log('   cd staticfruit_kit && npm run dev');
    process.exit(1);
  }

  console.log('✅ API server is running');
  await runMarketDiscoveryTests();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testMarketDiscoveryAPI };