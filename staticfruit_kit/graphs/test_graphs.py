#!/usr/bin/env python3
"""
Test script for StaticFruit graph generation
Usage: python test_graphs.py
"""

import os
import sys
import pandas as pd
import matplotlib.pyplot as plt

# Add current directory to path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def create_test_data():
    """Create sample test data"""
    market_pools_data = {
        'market_id': [1, 2, 3, 4, 5],
        'pool_yes': [1250, 890, 2100, 650, 1750],
        'pool_no': [750, 1110, 900, 1350, 1250],
        'market_title': [
            'Will ETH reach $5k by EOY?',
            'BTC ETF approval this quarter?',
            'DeFi TVL > $100B by June?',
            'Layer 2 dominance in 2025?',
            'AI crypto projects surge?'
        ]
    }

    leaderboard_data = {
        'address': [
            '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
            '0x1234567890123456789012345678901234567890',
            '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
            '0x9876543210987654321098765432109876543210',
            '0xfedcba0987654321fedcba0987654321fedcba09'
        ],
        'total_staked': [5000, 3200, 2800, 2100, 1800]
    }

    return pd.DataFrame(market_pools_data), pd.DataFrame(leaderboard_data)

def test_market_pools_chart():
    """Test market pools chart generation"""
    print("🧪 Testing market pools chart...")

    market_pools, _ = create_test_data()

    fig = plt.figure(figsize=(12, 8))
    x = range(len(market_pools))
    width = 0.35

    plt.bar([i - width/2 for i in x], market_pools['pool_no'],
            width, label='NO', color='#ff6b6b', alpha=0.8)
    plt.bar([i + width/2 for i in x], market_pools['pool_yes'],
            width, label='YES', color='#4ecdc4', alpha=0.8)

    plt.xlabel('Market')
    plt.ylabel('Total FRUIT Staked')
    plt.title('Market Pools - YES vs NO Comparison (Test Data)', fontsize=16, fontweight='bold')
    plt.xticks(x, [f'Market {i+1}' for i in x], rotation=45, ha='right')
    plt.legend()
    plt.grid(True, alpha=0.3)
    plt.tight_layout()

    # Save test chart
    fig.savefig('test_market_pools.png', dpi=150, bbox_inches='tight')
    plt.close(fig)

    print("✅ Market pools chart saved as test_market_pools.png")

def test_leaderboard_chart():
    """Test leaderboard chart generation"""
    print("🧪 Testing leaderboard chart...")

    _, leaderboard = create_test_data()

    fig = plt.figure(figsize=(12, 8))

    # Create shortened addresses for display
    labels = [f"{addr[:6]}...{addr[-4:]}" for addr in leaderboard['address']]

    bars = plt.barh(labels, leaderboard['total_staked'],
                   color='#45b7d1', alpha=0.8)
    plt.xlabel('Total FRUIT Staked')
    plt.ylabel('User Address')
    plt.title('Top Bettors by Total Stake (Test Data)', fontsize=16, fontweight='bold')
    plt.grid(True, alpha=0.3)

    # Add value labels on bars
    for bar, value in zip(bars, leaderboard['total_staked']):
        plt.text(bar.get_width() + max(leaderboard['total_staked']) * 0.01,
                bar.get_y() + bar.get_height()/2,
                f'{value:,.0f}',
                ha='left', va='center', fontweight='bold')

    plt.tight_layout()

    # Save test chart
    fig.savefig('test_leaderboard.png', dpi=150, bbox_inches='tight')
    plt.close(fig)

    print("✅ Leaderboard chart saved as test_leaderboard.png")

def test_pool_distribution_chart():
    """Test pool distribution pie chart"""
    print("🧪 Testing pool distribution chart...")

    market_pools, _ = create_test_data()

    total_yes = market_pools['pool_yes'].sum()
    total_no = market_pools['pool_no'].sum()

    fig = plt.figure(figsize=(10, 8))
    plt.pie([total_no, total_yes],
            labels=['NO', 'YES'],
            colors=['#ff6b6b', '#4ecdc4'],
            autopct='%1.1f%%',
            startangle=90,
            explode=(0.05, 0.05),
            shadow=True,
            textprops={'fontsize': 14, 'fontweight': 'bold'})

    plt.title('Overall Pool Distribution (Test Data)', fontsize=16, fontweight='bold')
    plt.axis('equal')
    plt.tight_layout()

    # Save test chart
    fig.savefig('test_pool_distribution.png', dpi=150, bbox_inches='tight')
    plt.close(fig)

    print("✅ Pool distribution chart saved as test_pool_distribution.png")

def run_all_tests():
    """Run all chart generation tests"""
    print("🚀 Starting StaticFruit graph generation tests...\n")

    try:
        test_market_pools_chart()
        test_leaderboard_chart()
        test_pool_distribution_chart()

        print("\n🎉 All tests completed successfully!")
        print("📁 Test charts saved in current directory:")
        print("   - test_market_pools.png")
        print("   - test_leaderboard.png")
        print("   - test_pool_distribution.png")

    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_all_tests()