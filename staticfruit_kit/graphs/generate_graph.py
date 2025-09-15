#!/usr/bin/env python3
"""
Simple graph generator for StaticFruit
"""
import sys
import argparse
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import os

def generate_pools_graph(data_file, output_file):
    """Generate pools graph from CSV data"""
    try:
        # Read data
        data = pd.read_csv(data_file)
        
        # Create graph
        fig = plt.figure(figsize=(10, 6))
        x = np.arange(len(data))
        width = 0.35
        
        plt.bar([i - width/2 for i in x], data['pool_no'], 
                width, label='NO', color='#ff6b6b', alpha=0.8)
        plt.bar([i + width/2 for i in x], data['pool_yes'], 
                width, label='YES', color='#4ecdc4', alpha=0.8)
        
        plt.xlabel('Market')
        plt.ylabel('Total FRUIT Staked')
        plt.title('Market Pools - YES vs NO Comparison', fontsize=16, fontweight='bold')
        
        # Use market titles if available, otherwise market IDs
        if 'market_title' in data.columns:
            labels = [title[:20] + '...' if len(str(title)) > 20 else str(title) 
                     for title in data['market_title']]
        else:
            labels = [f'Market {mid}' for mid in data['market_id']]
            
        plt.xticks(x, labels, rotation=45, ha='right')
        plt.legend()
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        
        # Save graph
        fig.savefig(output_file, dpi=150, bbox_inches='tight')
        plt.close(fig)
        return True
    except Exception as e:
        print(f"Error generating pools graph: {e}", file=sys.stderr)
        return False

def generate_odds_graph(data_file, output_file):
    """Generate odds graph from CSV data"""
    try:
        # Read data
        data = pd.read_csv(data_file)
        
        # Create graph
        fig = plt.figure(figsize=(10, 6))
        x = range(len(data))
        
        plt.plot(x, data['odds_yes'], marker='o', linewidth=2, markersize=8, label='YES', color='#4ecdc4')
        plt.plot(x, data['odds_no'], marker='s', linewidth=2, markersize=8, label='NO', color='#ff6b6b')
        
        plt.xlabel('Market')
        plt.ylabel('Odds')
        plt.title('Market Odds Comparison', fontsize=16, fontweight='bold')
        plt.ylim(0, 1)
        plt.grid(True, alpha=0.3)
        
        # Use market titles if available, otherwise market IDs
        if 'market_title' in data.columns:
            labels = [title[:20] + '...' if len(str(title)) > 20 else str(title) 
                     for title in data['market_title']]
        else:
            labels = [f'Market {mid}' for mid in data['market_id']]
            
        plt.xticks(x, labels, rotation=45, ha='right')
        plt.legend()
        plt.tight_layout()
        
        # Save graph
        fig.savefig(output_file, dpi=150, bbox_inches='tight')
        plt.close(fig)
        return True
    except Exception as e:
        print(f"Error generating odds graph: {e}", file=sys.stderr)
        return False

def generate_leaderboard_graph(data_file, output_file):
    """Generate leaderboard graph from CSV data"""
    try:
        # Read data
        data = pd.read_csv(data_file)
        
        # Create graph
        fig = plt.figure(figsize=(12, 8))
        
        # Create shortened addresses for display
        if 'address' in data.columns:
            labels = [f"{addr[:6]}...{addr[-4:]}" if len(addr) > 10 else addr 
                     for addr in data['address']]
        else:
            labels = [f'User {i+1}' for i in range(len(data))]
        
        bars = plt.barh(labels, data['total_staked'], color='#45b7d1', alpha=0.8)
        plt.xlabel('Total FRUIT Staked')
        plt.ylabel('User Address')
        plt.title('Top Bettors by Total Stake', fontsize=16, fontweight='bold')
        plt.grid(True, alpha=0.3)
        
        # Add value labels on bars
        for bar, value in zip(bars, data['total_staked']):
            plt.text(bar.get_width() + max(data['total_staked']) * 0.01,
                    bar.get_y() + bar.get_height()/2,
                    f'{value:,.0f}',
                    ha='left', va='center', fontweight='bold')
        
        plt.tight_layout()
        
        # Save graph
        fig.savefig(output_file, dpi=150, bbox_inches='tight')
        plt.close(fig)
        return True
    except Exception as e:
        print(f"Error generating leaderboard graph: {e}", file=sys.stderr)
        return False

def main():
    parser = argparse.ArgumentParser(description='Generate StaticFruit graphs')
    parser.add_argument('--type', required=True, choices=['pools', 'odds', 'leaderboard'], 
                       help='Type of graph to generate')
    parser.add_argument('--data', required=True, help='Path to CSV data file')
    parser.add_argument('--output', required=True, help='Output PNG file path')
    
    args = parser.parse_args()
    
    # Create output directory if it doesn't exist
    output_dir = os.path.dirname(args.output)
    if output_dir and not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    if args.type == 'pools':
        success = generate_pools_graph(args.data, args.output)
    elif args.type == 'odds':
        success = generate_odds_graph(args.data, args.output)
    elif args.type == 'leaderboard':
        success = generate_leaderboard_graph(args.data, args.output)
    else:
        print(f"Unknown graph type: {args.type}", file=sys.stderr)
        sys.exit(1)
    
    if success:
        print(f"Graph saved to {args.output}")
        sys.exit(0)
    else:
        print(f"Failed to generate {args.type} graph", file=sys.stderr)
        sys.exit(1)

if __name__ == '__main__':
    main()