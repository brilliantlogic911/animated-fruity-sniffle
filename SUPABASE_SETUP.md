# StaticFruit Supabase Setup Guide

## 🚀 Quick Setup Overview

Your StaticFruit project has been cloned and all dependencies installed! Now you need to set up Supabase and configure the database.

## 📋 Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **API Keys**: You'll need your Supabase keys
3. **Storage Bucket**: For graph storage

## 🗄️ Step 1: Set Up Database Schema

### 1.1 Create New Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: `staticfruit` (or your choice)
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users

### 1.2 Run Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy and paste the entire contents of: `staticfruit_kit/supabase/sql/schema.sql`
3. Click **Run** to execute the schema

This will create:
- ✅ `market_pools` table
- ✅ `leaderboard` table
- ✅ Database functions for updates
- ✅ Row Level Security policies
- ✅ Sample data

## 🗂️ Step 2: Set Up Storage

### 2.1 Create Storage Bucket
1. In Supabase dashboard, go to **Storage**
2. Click **Create Bucket**
3. Bucket Details:
   - **Name**: `staticfruit-graphs`
   - **Public bucket**: ✅ Enable
4. Click **Create bucket**

### 2.2 Configure Bucket Policies (Optional)
The bucket is already public, but you can add additional policies if needed.

## 🔑 Step 3: Get Your API Keys

### 3.1 Get Project URL and Keys
1. In Supabase dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon/public key**: For frontend
   - **service_role key**: For backend (keep secret!)

## ⚙️ Step 4: Configure Environment Variables

### 4.1 Backend Configuration (`staticfruit_kit/.env`)
```bash
# Replace with your actual keys
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
```

### 4.2 Frontend Configuration (`staticfruit_next_starter/.env.local`)
```bash
# Replace with your actual keys
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
```

## 🧪 Step 5: Test the Setup

### 5.1 Test Database Connection
```bash
# Navigate to the API server directory
cd staticfruit_kit

# Test Supabase connection
node -e "
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://hhogymibdgsuwdlpfebs.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);
supabase.from('market_pools').select('*').then(console.log);
"
```

### 5.2 Start Development Servers
```bash
# Terminal 1: Start API server
cd staticfruit_kit && npm run dev

# Terminal 2: Start frontend
cd staticfruit_next_starter && npm run dev
```

### 5.3 Test Graph Generation
```bash
# Install Python dependencies
cd staticfruit_kit/graphs
pip install -r requirements.txt

# Test graph generation
python test_graphs.py
```

## 📊 Step 6: Verify Everything Works

### 6.1 Check Database Tables
In Supabase dashboard → **Table Editor**:
- ✅ `market_pools` should have sample data
- ✅ `leaderboard` should have sample data

### 6.2 Check Storage Bucket
In Supabase dashboard → **Storage**:
- ✅ `staticfruit-graphs` bucket should exist
- ✅ Should be public

### 6.3 Test API Endpoints
Visit these URLs to test:
- **Frontend**: http://localhost:3000
- **API Server**: http://localhost:8787

## 🚀 Step 7: Deploy to Production (Optional)

### 7.1 GitHub Actions Setup
1. Go to your GitHub repository settings
2. Navigate to **Secrets and variables** → **Actions**
3. Add these repository secrets:
   ```
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

### 7.2 Enable Automated Graph Generation
The GitHub Actions workflow will automatically:
- Generate graphs every hour
- Upload to Supabase Storage
- Keep your dashboard updated

## 🔧 Troubleshooting

### Issue: Database Connection Failed
**Solution**: Double-check your API keys in `.env` files

### Issue: Storage Upload Failed
**Solution**: Ensure the `staticfruit-graphs` bucket exists and is public

### Issue: Graph Generation Errors
**Solution**: Check that Python dependencies are installed:
```bash
cd staticfruit_kit/graphs
pip install -r requirements.txt
```

### Issue: Environment Variables Not Loading
**Solution**: Make sure you're in the correct directory when running commands

## 📞 Need Help?

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure your Supabase project is active
4. Check that all dependencies are installed

## 🎉 Success Checklist

- ✅ Supabase project created
- ✅ Database schema applied
- ✅ Storage bucket configured
- ✅ API keys configured
- ✅ Environment variables set
- ✅ Development servers running
- ✅ Graph generation tested

**Your StaticFruit development environment is now fully operational!** 🚀

Next steps:
1. Start building features
2. Deploy smart contracts to Base testnet
3. Customize the UI and branding
4. Add more prediction markets