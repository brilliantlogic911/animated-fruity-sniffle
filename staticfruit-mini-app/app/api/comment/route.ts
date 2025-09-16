import { NextResponse } from 'next/server';

// Mock database to store comments
const commentsDB: Record<string, Array<{id: string, text: string, user: string, timestamp: number}>> = {};

export async function POST(request: Request) {
  try {
    const { predictionId, text, user } = await request.json();
    
    if (!predictionId || !text || !user) {
      return NextResponse.json({ error: 'Prediction ID, text, and user are required' }, { status: 400 });
    }
    
    // Initialize comments array if it doesn't exist
    if (!commentsDB[predictionId]) {
      commentsDB[predictionId] = [];
    }
    
    // Add new comment
    const newComment = {
      id: Math.random().toString(36).substring(7),
      text,
      user,
      timestamp: Date.now()
    };
    
    commentsDB[predictionId].push(newComment);
    
    return NextResponse.json({ 
      success: true, 
      comment: newComment
    });
  } catch (error: unknown) {
    console.error('Error adding comment:', error);
    return NextResponse.json({ error: 'Failed to add comment' }, { status: 500 });
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
      comments: commentsDB[predictionId] || []
    });
  } catch (error: unknown) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}