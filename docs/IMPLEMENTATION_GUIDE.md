# Implementation Guide: Twitter API Integration

## Overview
This guide provides instructions for implementing the Twitter API integration in the StaticFruit application. The integration has been architected to enhance three existing features: Markets, Horoscope, and Bars.

## Architecture Summary

The implementation follows a collector-service-api-client pattern:

1. **Twitter Collector** - Fetches raw data from Twitter via RapidAPI
2. **Twitter Service** - Processes data for specific use cases
3. **API Routes** - Exposes endpoints for frontend consumption
4. **Frontend API Client** - Consumes data in frontend components

## Implementation Steps

### Step 1: Environment Setup
Add your RapidAPI key to the environment:
```bash
# In staticfruit_kit/.env
X_RAPIDAPI_KEY=your_actual_rapidapi_key_here
```

### Step 2: Create Backend Components

#### 2.1 Twitter Collector
Create `staticfruit_kit/collectors/twitter_collector.ts` with the code from the technical specification.

#### 2.2 Twitter Service
Create `staticfruit_kit/services/twitter_service.ts` with the data processing functions.

#### 2.3 API Routes
Create `staticfruit_kit/api/routes/twitter_trends.ts` with the endpoint handlers.

#### 2.4 Register Routes
Update `staticfruit_kit/api/server.ts` to register the new routes.

### Step 3: Update Frontend

#### 3.1 API Client
Update `staticfruit_next_starter/lib/api.ts` with the new API functions.

#### 3.2 Feature Components
Update the Markets, Horoscope, and Bars components to use the new API functions.

### Step 4: Testing
Run the test suite to verify all components work correctly:
```bash
# Test backend components
cd staticfruit_kit
npm test

# Test frontend components
cd staticfruit_next_starter
npm test
```

## Switching to Implementation Mode

To implement this architecture, switch to the Code mode:

```xml
<switch_mode>
<mode_slug>code</mode_slug>
<reason>Implementation of Twitter API integration components</reason>
</switch_mode>
```

## Files to be Created

1. `staticfruit_kit/collectors/twitter_collector.ts`
2. `staticfruit_kit/services/twitter_service.ts`
3. `staticfruit_kit/api/routes/twitter_trends.ts`

## Files to be Updated

1. `staticfruit_kit/api/server.ts` - Register new routes
2. `staticfruit_next_starter/lib/api.ts` - Add new API functions
3. Feature component files in `staticfruit_next_starter/app/`

## Testing Checklist

- [ ] Twitter collector fetches data successfully
- [ ] Twitter service transforms data correctly
- [ ] API routes return expected responses
- [ ] Frontend API client functions work
- [ ] Markets feature displays Twitter trends
- [ ] Horoscope feature incorporates Twitter trends
- [ ] Bars feature shows Twitter trend data
- [ ] Error handling works correctly
- [ ] Caching functions properly
- [ ] Rate limiting is respected

## Deployment Checklist

- [ ] API key configured in production environment
- [ ] All dependencies installed
- [ ] Tests passing
- [ ] Monitoring configured
- [ ] Documentation updated

## Troubleshooting

### Common Issues

1. **API Key Errors**
   - Verify `X_RAPIDAPI_KEY` is set in environment variables
   - Check key has access to Twitter API endpoint

2. **Network Issues**
   - Verify connectivity to RapidAPI
   - Check firewall settings

3. **Data Formatting Issues**
   - Ensure data transformation matches frontend expectations
   - Validate API response formats

### Debugging Steps

1. Test collector independently:
   ```bash
   node -e "require('./staticfruit_kit/collectors/twitter_collector').getTwitterTrends().then(console.log).catch(console.error)"
   ```

2. Test API routes with curl:
   ```bash
   curl http://localhost:8787/ai/twitter-trends
   ```

3. Check browser developer tools for frontend errors

## Conclusion

This implementation guide provides a roadmap for integrating Twitter trends into the StaticFruit application. By following the collector-service-api-client pattern, we ensure a maintainable and scalable solution that enhances user experience across multiple features.

To begin implementation, switch to Code mode using the switch_mode tool.