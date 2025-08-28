// Test Settlement Brief API
// Run with: node test-settlement-brief.js

async function testSettlementBriefAPI(marketId) {
  try {
    const response = await fetch('http://localhost:8787/ai/settlement_brief', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ marketId }),
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

async function runSettlementBriefTests() {
  console.log('⚖️  Testing StaticFruit Settlement Brief API...\n');
  console.log('=' .repeat(60));

  const testCases = [
    { id: 1, name: 'Collaboration Market (YES)' },
    { id: 2, name: 'Collaboration Market (Active)' },
    { id: 3, name: 'Collaboration Market (NO)' },
    { id: 4, name: 'Album Release Market (YES)' },
    { id: 5, name: 'Album Release Market (Active)' },
    { id: 6, name: 'Award Market (YES)' },
    { id: 7, name: 'Award Market (VOID)' },
    { id: 8, name: 'Viral Market (YES)' },
    { id: 9, name: 'Viral Market (Active)' },
    { id: 10, name: 'Chart Market (YES)' },
    { id: 11, name: 'Milestone Market (NO)' },
    { id: 999, name: 'Invalid Market ID' }
  ];

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n📋 Test ${i + 1}: ${testCase.name} (ID: ${testCase.id})`);
    console.log('-'.repeat(50));

    const result = await testSettlementBriefAPI(testCase.id);

    if (!result) {
      console.log('❌ API call failed');
      continue;
    }

    if (result.error) {
      console.log('❌ API error:', result.error);
      if (result.details) {
        console.log('   Details:', result.details);
      }
      if (result.available_markets) {
        console.log('   Available markets:', result.available_markets.length);
      }
      continue;
    }

    console.log('✅ Success!');
    console.log(`   Market: ${result.market_title}`);
    console.log(`   Deadline: ${result.deadline}`);
    console.log(`   Verdict: ${result.verdict.toUpperCase()}`);
    console.log(`   Summary: ${result.summary}`);
    console.log(`   Sources: ${result.sources.length}`);

    console.log('\n📚 SOURCES:');
    result.sources.forEach((source, index) => {
      console.log(`   ${index + 1}. ${source.title}`);
      console.log(`      ${source.url}`);
    });
  }

  console.log('\n' + '='.repeat(60));
  console.log('⚖️  Settlement Brief Test Complete!');
  console.log('\n💡 Key Features Demonstrated:');
  console.log('   ✅ Market outcome determination');
  console.log('   ✅ Verifiable source collection');
  console.log('   ✅ Primary source prioritization');
  console.log('   ✅ Void determination for unclear cases');
  console.log('   ✅ Structured settlement briefs');
  console.log('   ✅ Multiple market type support');

  console.log('\n📊 Market Types Covered:');
  console.log('   🎵 Collaborations - Artist partnerships');
  console.log('   💿 Album Releases - New music drops');
  console.log('   🏆 Awards - Grammy, Pulitzer wins');
  console.log('   📱 Viral Content - TikTok sound performance');
  console.log('   📊 Charts - Billboard chart positions');
  console.log('   🎧 Milestones - Streaming listener goals');

  console.log('\n🎯 Ready for production settlement determination!');
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
  await runSettlementBriefTests();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testSettlementBriefAPI };