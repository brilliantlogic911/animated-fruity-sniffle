import { NextResponse } from 'next/server';

// Mock database to store likes
const likesDB: Record<string, number> = {};

export async function POST(request: Request) {
  try {
    const { predictionId } = await request.json();
    
    if (!predictionId) {
      return NextResponse.json({ error: 'Prediction ID is required' }, { status: 400 });
    }
    
    // Update like count
    likesDB[predictionId] = (likesDB[predictionId] || 0) + 1;
    
    return NextResponse.json({ 
      success: true, 
      likes: likesDB[predictionId],
      predictionId 
    });
  } catch (error: unknown) {
    console.error('Error processing like:', error);
    return NextResponse.json({ error: 'Failed to process like' }, { status: 500 });
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
      likes: likesDB[predictionId] || 0,
      predictionId 
    });
  } catch (error: unknown) {
    console.error('Error fetching likes:', error);
    return NextResponse.json({ error: 'Failed to fetch likes' }, { status: 500 });
  }
}