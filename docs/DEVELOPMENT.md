# StaticFruit Development Guide

## Overview
This guide covers the complete development environment setup for the StaticFruit project.

## Project Structure
```
Static_Fruit/
├── docs/                    # Documentation
│   ├── ARCHITECTURE.md     # System architecture
│   ├── prompts.md          # AI prompts and configurations
│   └── DEVELOPMENT.md      # This file
├── staticfruit_next_starter/  # Next.js frontend
├── staticfruit_kit/          # Fastify API server & tools
├── contracts/               # Smart contracts (Hardhat)
└── staticfruit_kit.zip      # Pre-built kit (optional)
```

## Prerequisites
- Node.js 18+
- npm or yarn
- Git
- A code editor (VS Code recommended)

## Environment Setup

### 1. Frontend (Next.js)
```bash
cd staticfruit_next_starter
npm install
cp .env.local.example .env.local
# Edit .env.local with your API keys
npm run dev
```
Access at: http://localhost:3000

### 2. API Server (Fastify)
```bash
cd staticfruit_kit
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```
API available at: http://localhost:8787

### 3. Smart Contracts (Hardhat)
```bash
cd contracts
npm install
cp .env.example .env
# Edit .env with your private keys and API keys
npx hardhat compile
npx hardhat test
```

### 4. Supabase Setup
1. Create a new project at https://supabase.com
2. Run the SQL schema from `staticfruit_kit/supabase/sql/schema.sql`
3. Update environment variables with your Supabase credentials

## Development Workflow

### Local Development
1. Start the API server: `cd staticfruit_kit && npm run dev`
2. Start the frontend: `cd staticfruit_next_starter && npm run dev`
3. Start contract development: `cd contracts && npx hardhat node`

### Testing
```bash
# Frontend tests
cd staticfruit_next_starter && npm test

# Contract tests
cd contracts && npx hardhat test

# API tests (if implemented)
cd staticfruit_kit && npm test
```

### Deployment

#### Smart Contracts
```bash
cd contracts
npx hardhat run scripts/deploy.ts --network base
```

#### Frontend
```bash
cd staticfruit_next_starter
npm run build
npm start
```

#### API Server
```bash
cd staticfruit_kit
npm run build
npm start
```

## Key Features

### Horoscope Generation
- Endpoint: `POST /ai/horoscope`
- Generates hip-hop themed horoscopes based on zodiac signs
- Integrates with OpenAI/Anthropic for content generation

### Bars Moderation
- Endpoint: `POST /ai/bar_guard`
- Moderates user-generated content for appropriateness
- Safe for work content filtering

### Market Discovery
- Endpoint: `POST /ai/market_discover`
- AI-powered market trend analysis
- Social media sentiment integration

### Graph Generation
- Automated hourly graph generation
- Supabase Storage integration
- PDF and PNG outputs

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE=http://localhost:8787
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### API Server (.env)
```env
PORT=8787
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_key
OPENAI_API_KEY=your_openai_key
ALCHEMY_URL=https://base-mainnet.g.alchemy.com/v2/your_key
```

### Smart Contracts (.env)
```env
ALCHEMY_URL=https://base-mainnet.g.alchemy.com/v2/your_key
PRIVATE_KEY=your_private_key
BASESCAN_API_KEY=your_basescan_key
```

## Troubleshooting

### Common Issues
1. **Port conflicts**: Ensure ports 3000, 8787 are available
2. **Environment variables**: Double-check all required env vars are set
3. **Dependencies**: Run `npm install` in each directory
4. **Network issues**: Verify internet connection and API endpoints

### Getting Help
- Check the logs in terminal for error messages
- Verify environment variables are correctly set
- Ensure all services are running before testing integrations

## Next Steps
1. Set up your Supabase project
2. Configure API keys for external services
3. Deploy smart contracts to Base testnet
4. Test the complete flow from frontend to blockchain
5. Set up CI/CD pipelines for automated deployment