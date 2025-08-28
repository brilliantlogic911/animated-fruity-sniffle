// Test Bars Moderation API
// Run with: node test-bars-moderation.js

const testCases = [
  // Clean content (should pass)
  {
    text: "On Base I move silent like gasless txns",
    expected: { ok: true, toxicity: 0.0 }
  },
  {
    text: "Stacking sats, building wealth slow",
    expected: { ok: true, toxicity: 0.0 }
  },

  // Mild profanity (should pass with low toxicity)
  {
    text: "Damn, this market is crazy",
    expected: { ok: true, toxicity: 0.3 }
  },
  {
    text: "This sucks, but we'll bounce back",
    expected: { ok: true, toxicity: 0.4 }
  },

  // Excessive caps (should pass with low toxicity)
  {
    text: "THIS IS AN AMAZING OPPORTUNITY!!!",
    expected: { ok: true, toxicity: 0.2 }
  },

  // Character repetition (should pass with low toxicity)
  {
    text: "Woooooo, moon incoming!!!",
    expected: { ok: true, toxicity: 0.15 }
  },

  // Sexual content (should fail)
  {
    text: "Fuck this market manipulation",
    expected: { ok: false, toxicity: 0.8 }
  },
  {
    text: "This shit is getting ridiculous",
    expected: { ok: false, toxicity: 0.8 }
  },

  // Hate speech (should fail)
  {
    text: "Kill all the bears",
    expected: { ok: false, toxicity: 0.95 }
  },

  // Harassment (should fail)
  {
    text: "Let's dox the whales",
    expected: { ok: false, toxicity: 0.9 }
  },

  // Slurs (should fail with max toxicity)
  {
    text: "This nigger market is rigged",
    expected: { ok: false, toxicity: 1.0 }
  },

  // Too short (should fail)
  {
    text: "Hi",
    expected: { ok: false, toxicity: 0.2 }
  },

  // Too long (should fail)
  {
    text: "A".repeat(300),
    expected: { ok: false, toxicity: 0.3 }
  },

  // Empty content (should fail)
  {
    text: "",
    expected: { ok: false, toxicity: 1.0 }
  },

  // Complex case with multiple issues
  {
    text: "FUCK THIS SHIT MARKET MANIPULATION BY THOSE NIGGERS!!!",
    expected: { ok: false, toxicity: 1.0 }
  }
];

async function testModerationAPI(text) {
  try {
    const response = await fetch('http://localhost:8787/ai/bar_guard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
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

async function runTests() {
  console.log('🧪 Testing StaticFruit Bars Moderation API...\n');
  console.log('=' .repeat(60));

  let passed = 0;
  let failed = 0;

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\nTest ${i + 1}: "${testCase.text.substring(0, 50)}${testCase.text.length > 50 ? '...' : ''}"`);

    const result = await testModerationAPI(testCase.text);

    if (!result) {
      console.log('❌ API call failed');
      failed++;
      continue;
    }

    // Check if result matches expectations
    const okMatch = result.ok === testCase.expected.ok;
    const toxicityMatch = Math.abs(result.toxicity - testCase.expected.toxicity) < 0.1;

    if (okMatch && toxicityMatch) {
      console.log('✅ PASSED');
      passed++;
    } else {
      console.log('❌ FAILED');
      console.log(`   Expected: ok=${testCase.expected.ok}, toxicity≈${testCase.expected.toxicity}`);
      console.log(`   Got:      ok=${result.ok}, toxicity=${result.toxicity}`);
      failed++;
    }

    // Show details
    console.log(`   Result: ${JSON.stringify(result, null, 2)}`);
  }

  console.log('\n' + '='.repeat(60));
  console.log(`🎯 Test Results: ${passed} passed, ${failed} failed`);

  if (failed === 0) {
    console.log('🎉 All tests passed! Bars moderation is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Check the implementation.');
  }

  console.log('\n📝 Test Coverage:');
  console.log('   ✅ Clean content');
  console.log('   ✅ Mild profanity');
  console.log('   ✅ Excessive caps');
  console.log('   ✅ Character repetition');
  console.log('   ✅ Sexual content');
  console.log('   ✅ Hate speech');
  console.log('   ✅ Harassment');
  console.log('   ✅ Slurs');
  console.log('   ✅ Content length validation');
  console.log('   ✅ Empty content handling');
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
  await runTests();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testModerationAPI, testCases };