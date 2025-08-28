# StaticFruit Graph Generation

Automated graph generation system for StaticFruit prediction markets.

## Features

- 📊 **Market Pool Charts**: YES vs NO comparison across all markets
- 🏆 **Leaderboard Charts**: Top bettors by total stake
- 🥧 **Pool Distribution**: Overall YES/NO distribution pie chart
- 📄 **PDF Reports**: Comprehensive reports with all charts
- ☁️ **Supabase Storage**: Automatic upload to cloud storage
- ⏰ **Automated**: Hourly generation via GitHub Actions

## Setup

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Environment Variables
Set the following environment variables:
```bash
export SUPABASE_URL="https://hhogymibdgsuwdlpfebs.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
export SUPABASE_STORAGE_BUCKET="staticfruit-graphs"
```

### 3. Create Storage Bucket
In your Supabase dashboard:
1. Go to Storage
2. Create bucket named `staticfruit-graphs`
3. Set to public access

## Usage

### Manual Generation
```bash
python generate_graphs_supabase.py
```

### Automated (GitHub Actions)
The system runs automatically every hour via GitHub Actions. To set up:

1. **Add Repository Secrets** in GitHub:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key

2. **Enable GitHub Actions** in your repository settings

3. **The workflow will:**
   - Run every hour on the hour
   - Generate fresh graphs from current data
   - Upload to Supabase Storage
   - Create timestamped files

## Generated Files

The system generates the following files in Supabase Storage:

- `market_pools.png` - Market comparison chart
- `leaderboard.png` - Top bettors chart
- `pool_distribution.png` - Distribution pie chart
- `staticfruit_report.pdf` - Complete PDF report

Files are timestamped: `YYYYMMDD_HHMMSS_filename.ext`

## Data Sources

Graphs are generated from:
- **Market Pools**: `market_pools` table in Supabase
- **Leaderboard**: `leaderboard` table in Supabase

Ensure your database has current data before running generation.

## Chart Types

### 1. Market Pools Chart
- Side-by-side bars showing YES/NO pools for each market
- Color-coded (red for NO, teal for YES)
- Market IDs on x-axis

### 2. Leaderboard Chart
- Horizontal bar chart of top 10 bettors
- Truncated wallet addresses for readability
- Total stake values on bars

### 3. Pool Distribution Chart
- Pie chart showing overall YES/NO distribution
- Percentage labels
- Color-coded segments

## Troubleshooting

### Common Issues

1. **No data in charts**
   - Check if database tables have data
   - Verify Supabase connection

2. **Upload failures**
   - Check storage bucket permissions
   - Verify service role key has storage permissions

3. **Missing dependencies**
   - Run `pip install -r requirements.txt`
   - Ensure Python 3.9+ is installed

### Manual Testing
```bash
# Test data loading
python -c "from generate_graphs_supabase import load_from_supabase; print(load_from_supabase())"

# Test single chart generation
python -c "from generate_graphs_supabase import generate_market_pools_chart; import pandas as pd; df = pd.DataFrame({'market_id': [1,2], 'pool_yes': [100,200], 'pool_no': [50,150]}); fig = generate_market_pools_chart(df); fig.savefig('test.png')"
```

## Integration

### Frontend Usage
```typescript
// Get latest graph URLs
const { data } = await supabase.storage
  .from('staticfruit-graphs')
  .list('', {
    sortBy: { column: 'name', order: 'desc' },
    limit: 10
  });

// Display in your app
<img src={getGraphUrl('market_pools.png')} alt="Market Pools" />
```

### API Endpoints
Consider adding these endpoints to your API:

```typescript
// GET /api/graphs/latest
// Returns URLs for the latest generated graphs

// GET /api/graphs/history
// Returns list of all generated graph files
```

## Customization

### Adding New Charts
1. Create a new function following the pattern of existing chart functions
2. Add the chart generation to `generate_and_upload_graphs()`
3. Update the PDF generation section

### Modifying Chart Styles
- Colors: Update the color arrays in chart functions
- Sizes: Modify `figsize` parameters
- Fonts: Add font specifications to `plt.title()` and `plt.xlabel()`

## Performance

- **Generation Time**: ~30-60 seconds for typical datasets
- **File Sizes**: PNGs ~50-200KB, PDF ~500KB-2MB
- **Storage**: Minimal storage usage with timestamped files
- **Rate Limiting**: Consider implementing if running very frequently