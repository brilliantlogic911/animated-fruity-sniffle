import { NextResponse } from 'next/server';

// Mock database to store stakes
const stakesDB: Record<string, {yes: number, no: number}> = {};

export async function POST(request: Request) {
  try {
    const { predictionId, amount, side } = await request.json();
    
    if (!predictionId || !amount || !side) {
      return NextResponse.json({ error: 'Prediction ID, amount, and side are required' }, { status: 400 });
    }
    
    if (side !== 'yes' && side !== 'no') {
      return NextResponse.json({ error: 'Side must be either "yes" or "no"' }, { status: 400 });
    }
    
    if (amount <= 0) {
      return NextResponse.json({ error: 'Amount must be greater than 0' }, { status: 400 });
    }
    
    // Initialize stakes if they don't exist
    if (!stakesDB[predictionId]) {
      stakesDB[predictionId] = { yes: 0, no: 0 };
    }
    
    // Update stake amount
    if (side === 'yes') {
      stakesDB[predictionId].yes += amount;
    } else {
      stakesDB[predictionId].no += amount;
    }
    
    return NextResponse.json({ 
      success: true, 
      stakes: stakesDB[predictionId],
      predictionId 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process stake' }, { status: 500 });
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
      stakes: stakesDB[predictionId] || { yes: 0, no: 0 },
      predictionId 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stakes' }, { status: 500 });
  }
}