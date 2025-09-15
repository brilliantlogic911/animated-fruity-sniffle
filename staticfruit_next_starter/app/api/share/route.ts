import { NextResponse } from 'next/server';

// Mock database to track shares
const sharesDB: Record<string, number> = {};

export async function POST(request: Request) {
  try {
    const { predictionId, platform } = await request.json();
    
    if (!predictionId || !platform) {
      return NextResponse.json({ error: 'Prediction ID and platform are required' }, { status: 400 });
    }
    
    // Initialize shares count if it doesn't exist
    if (!sharesDB[predictionId]) {
      sharesDB[predictionId] = 0;
    }
    
    // Increment share count
    sharesDB[predictionId] += 1;
    
    return NextResponse.json({ 
      success: true, 
      shares: sharesDB[predictionId],
      predictionId 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process share' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const predictionId = searchParams.get('predictionId');
    
    if (!predictionId) {
      return NextResponse.json({ error: 'Prediction ID is required' }, { status: 400 });
    }
    
    return NextResponse.json({ 
      shares: sharesDB[predictionId] || 0,
      predictionId 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch shares' }, { status: 500 });
  }
}