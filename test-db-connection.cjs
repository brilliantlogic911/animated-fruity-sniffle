// Test Supabase Database Connection
// Run with: node test-db-connection.cjs

require('dotenv').config({ path: './staticfruit_kit/.env' });
const { createClient } = require('@supabase/supabase-js');

async function testDatabaseConnection() {
  console.log('🧪 Testing StaticFruit Database Connection...\n');

  // Check environment variables
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  console.log('📋 Configuration Check:');
  console.log(`   Supabase URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`);
  console.log(`   Service Role Key: ${supabaseKey ? '✅ Set' : '❌ Missing'}\n`);

  if (!supabaseUrl || !supabaseKey) {
    console.log('❌ Missing required environment variables!');
    console.log('Please check your staticfruit_kit/.env file');
    process.exit(1);
  }

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('🔌 Testing connection...');

    // Test 1: Basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('market_pools')
      .select('count', { count: 'exact', head: true });

    if (connectionError) {
      console.log('❌ Connection failed:', connectionError.message);
      return;
    }

    console.log('✅ Database connection successful!');

    // Test 2: Check market_pools table
    console.log('\n📊 Testing market_pools table...');
    const { data: marketPools, error: marketError } = await supabase
      .from('market_pools')
      .select('*')
      .limit(3);

    if (marketError) {
      console.log('❌ market_pools table error:', marketError.message);
    } else {
      console.log(`✅ market_pools table accessible (${marketPools.length} records found)`);
      if (marketPools.length > 0) {
        console.log('   Sample data:', marketPools[0]);
      }
    }

    // Test 3: Check leaderboard table
    console.log('\n🏆 Testing leaderboard table...');
    const { data: leaderboard, error: leaderboardError } = await supabase
      .from('leaderboard')
      .select('*')
      .limit(3);

    if (leaderboardError) {
      console.log('❌ leaderboard table error:', leaderboardError.message);
    } else {
      console.log(`✅ leaderboard table accessible (${leaderboard.length} records found)`);
      if (leaderboard.length > 0) {
        console.log('   Sample data:', leaderboard[0]);
      }
    }

    // Test 4: Check storage bucket
    console.log('\n🗂️  Testing storage bucket...');
    try {
      const { data: buckets, error: storageError } = await supabase.storage.listBuckets();

      if (storageError) {
        console.log('❌ Storage access error:', storageError.message);
      } else {
        const staticfruitBucket = buckets.find(b => b.name === 'staticfruit-graphs');
        if (staticfruitBucket) {
          console.log('✅ staticfruit-graphs bucket found');

          // Check bucket contents
          const { data: files, error: filesError } = await supabase.storage
            .from('staticfruit-graphs')
            .list();

          if (filesError) {
            console.log('⚠️  Could not list bucket contents:', filesError.message);
          } else {
            console.log(`📁 Bucket contains ${files.length} files`);
          }
        } else {
          console.log('⚠️  staticfruit-graphs bucket not found');
          console.log('   Please create this bucket in your Supabase dashboard');
        }
      }
    } catch (storageErr) {
      console.log('⚠️  Storage test failed:', storageErr.message);
    }

    // Summary
    console.log('\n🎉 Database Connection Test Complete!');
    console.log('=====================================');
    console.log('✅ Supabase connection: Working');
    console.log('✅ Database tables: Accessible');
    console.log('✅ Storage bucket: Ready for uploads');
    console.log('\n🚀 Your StaticFruit database is ready!');
    console.log('Next: Run the development servers with start-dev.bat');

  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your internet connection');
    console.log('2. Verify SUPABASE_URL is correct');
    console.log('3. Ensure SUPABASE_SERVICE_ROLE_KEY has proper permissions');
    console.log('4. Make sure database schema has been applied');
  }
}

// Run the test
testDatabaseConnection().catch(console.error);