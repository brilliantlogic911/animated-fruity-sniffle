#!/usr/bin/env python3
"""
StaticFruit Supabase Graph Generator
Generates graphs from Supabase data and uploads to Supabase Storage
Usage:
  python generate_graphs_supabase.py
Environment variables:
  SUPABASE_URL=https://hhogymibdgsuwdlpfebs.supabase.co
  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
  SUPABASE_STORAGE_BUCKET=staticfruit-graphs
"""

import os
import sys
import datetime as dt
from io import BytesIO
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages
from supabase import create_client, Client

# Supabase configuration
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
STORAGE_BUCKET = os.environ.get("SUPABASE_STORAGE_BUCKET", "staticfruit-graphs")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise SystemExit("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def load_from_supabase():
    """Load markets and bets data from Supabase"""
    try:
        # Get market pools data
        response = supabase.table('market_pools').select('*').execute()
        market_pools = pd.DataFrame(response.data)

        # Get leaderboard data
        response = supabase.table('leaderboard').select('*').execute()
        leaderboard = pd.DataFrame(response.data)

        # For now, we'll use the aggregated data
        # In a full implementation, you'd also fetch raw bets data
        print(f"Loaded {len(market_pools)} market pools and {len(leaderboard)} leaderboard entries")
        return market_pools, leaderboard

    except Exception as e:
        print(f"Error loading data from Supabase: {e}")
        return pd.DataFrame(), pd.DataFrame()

def generate_market_pools_chart(market_pools_df):
    """Generate market pools comparison chart"""
    if market_pools_df.empty:
        return None

    fig = plt.figure(figsize=(12, 8))
    x = np.arange(len(market_pools_df))
    width = 0.35

    plt.bar(x - width/2, market_pools_df['pool_no'], width, label='NO', color='#ff6b6b', alpha=0.8)
    plt.bar(x + width/2, market_pools_df['pool_yes'], width, label='YES', color='#4ecdc4', alpha=0.8)

    plt.xlabel('Market ID')
    plt.ylabel('Total FRUIT Staked')
    plt.title('Market Pools - YES vs NO Comparison', fontsize=16, fontweight='bold')
    plt.xticks(x, [f'Market {int(mid)}' for mid in market_pools_df['market_id']], rotation=45, ha='right')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.tight_layout()

    return fig

def generate_leaderboard_chart(leaderboard_df):
    """Generate leaderboard chart"""
    if leaderboard_df.empty:
        return None

    # Take top 10
    top_10 = leaderboard_df.nlargest(10, 'total_staked')

    fig = plt.figure(figsize=(12, 8))

    # Create shortened addresses for display
    labels = [f"{addr[:6]}...{addr[-4:]}" for addr in top_10['address']]

    bars = plt.barh(labels, top_10['total_staked'], color='#45b7d1', alpha=0.8)
    plt.xlabel('Total FRUIT Staked')
    plt.ylabel('User Address')
    plt.title('Top 10 Bettors by Total Stake', fontsize=16, fontweight='bold')
    plt.grid(True, alpha=0.3)

    # Add value labels on bars
    for bar, value in zip(bars, top_10['total_staked']):
        plt.text(bar.get_width() + max(top_10['total_staked']) * 0.01,
                bar.get_y() + bar.get_height()/2,
                f'{value:,.0f}',
                ha='left', va='center', fontweight='bold')

    plt.tight_layout()
    return fig

def generate_pool_distribution_chart(market_pools_df):
    """Generate pool distribution pie chart"""
    if market_pools_df.empty:
        return None

    total_yes = market_pools_df['pool_yes'].sum()
    total_no = market_pools_df['pool_no'].sum()

    if total_yes + total_no == 0:
        return None

    fig = plt.figure(figsize=(10, 8))
    plt.pie([total_no, total_yes],
            labels=['NO', 'YES'],
            colors=['#ff6b6b', '#4ecdc4'],
            autopct='%1.1f%%',
            startangle=90,
            explode=(0.05, 0.05),
            shadow=True,
            textprops={'fontsize': 14, 'fontweight': 'bold'})

    plt.title('Overall Pool Distribution', fontsize=16, fontweight='bold')
    plt.axis('equal')
    plt.tight_layout()

    return fig

def upload_to_supabase_storage(filename, fig):
    """Upload matplotlib figure to Supabase Storage"""
    try:
        # Save figure to BytesIO buffer
        buf = BytesIO()
        fig.savefig(buf, format='png', dpi=150, bbox_inches='tight')
        buf.seek(0)

        # Upload to Supabase Storage
        timestamp = dt.datetime.now().strftime("%Y%m%d_%H%M%S")
        storage_filename = f"{timestamp}_{filename}"

        response = supabase.storage.from_(STORAGE_BUCKET).upload(
            storage_filename,
            buf.getvalue(),
            {"content-type": "image/png", "upsert": "true"}
        )

        if response.status_code == 200:
            print(f"✅ Uploaded {filename} to Supabase Storage")
            return storage_filename
        else:
            print(f"❌ Failed to upload {filename}: {response}")
            return None

    except Exception as e:
        print(f"❌ Error uploading {filename}: {e}")
        return None

def generate_and_upload_graphs():
    """Main function to generate and upload all graphs"""
    print("🚀 Starting StaticFruit graph generation...")

    # Load data from Supabase
    market_pools, leaderboard = load_from_supabase()

    if market_pools.empty:
        print("⚠️  No market pools data found")
        return

    uploaded_files = []

    # Generate and upload market pools chart
    print("📊 Generating market pools chart...")
    pools_fig = generate_market_pools_chart(market_pools)
    if pools_fig:
        filename = upload_to_supabase_storage("market_pools.png", pools_fig)
        if filename:
            uploaded_files.append(filename)
        plt.close(pools_fig)

    # Generate and upload leaderboard chart
    if not leaderboard.empty:
        print("🏆 Generating leaderboard chart...")
        leaderboard_fig = generate_leaderboard_chart(leaderboard)
        if leaderboard_fig:
            filename = upload_to_supabase_storage("leaderboard.png", leaderboard_fig)
            if filename:
                uploaded_files.append(filename)
            plt.close(leaderboard_fig)

    # Generate and upload pool distribution chart
    print("🥧 Generating pool distribution chart...")
    distribution_fig = generate_pool_distribution_chart(market_pools)
    if distribution_fig:
        filename = upload_to_supabase_storage("pool_distribution.png", distribution_fig)
        if filename:
            uploaded_files.append(filename)
        plt.close(distribution_fig)

    # Generate PDF with all charts
    print("📄 Generating PDF report...")
    pdf_buffer = BytesIO()
    with PdfPages(pdf_buffer) as pdf:
        # Add each chart to PDF
        if pools_fig := generate_market_pools_chart(market_pools):
            pdf.savefig(pools_fig)
            plt.close(pools_fig)

        if not leaderboard.empty and (leaderboard_fig := generate_leaderboard_chart(leaderboard)):
            pdf.savefig(leaderboard_fig)
            plt.close(leaderboard_fig)

        if distribution_fig := generate_pool_distribution_chart(market_pools):
            pdf.savefig(distribution_fig)
            plt.close(distribution_fig)

    # Upload PDF
    pdf_filename = upload_to_supabase_storage("staticfruit_report.pdf", plt.figure())
    if pdf_filename:
        uploaded_files.append(pdf_filename)

    print(f"✅ Graph generation complete! Uploaded {len(uploaded_files)} files:")
    for filename in uploaded_files:
        print(f"   📁 {filename}")

    return uploaded_files

if __name__ == "__main__":
    try:
        generate_and_upload_graphs()
        print("🎉 StaticFruit graph generation completed successfully!")
    except Exception as e:
        print(f"❌ Error during graph generation: {e}")
        sys.exit(1)