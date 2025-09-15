import { NextResponse } from 'next/server';

// Mock database of predictions
const predictionsDB = [
  { id: 1, title: "Nicki surprise collab by Oct 31?", yes: 0.62, createdAt: Date.now() - 100000 },
  { id: 2, title: "TikTok sound hits 100k in 7 days?", yes: 0.44, createdAt: Date.now() - 200000 },
  { id: 3, title: "Eminem new album drops this month?", yes: 0.78, createdAt: Date.now() - 300000 },
  { id: 4, title: "Drake collaborates with J. Cole?", yes: 0.55, createdAt: Date.now() - 400000 },
  { id: 5, title: "Kendrick Lamar wins Grammy this year?", yes: 0.82, createdAt: Date.now() - 500000 },
  { id: 6, title: "Travis Scott Astroworld reunion?", yes: 0.35, createdAt: Date.now() - 600000 },
  { id: 7, title: "Beyoncé releases surprise album?", yes: 0.67, createdAt: Date.now() - 700000 },
  { id: 8, title: "Taylor Swift re-recording completed?", yes: 0.91, createdAt: Date.now() - 800000 },
  { id: 9, title: "Post Malone's next tour sold out?", yes: 0.48, createdAt: Date.now() - 900000 },
  { id: 10, title: "The Weeknd tops Billboard charts?", yes: 0.73, createdAt: Date.now() - 1000000 },
  { id: 11, title: "Billie Eilish new single breaks records?", yes: 0.59, createdAt: Date.now() - 1100000 },
  { id: 12, title: "Coldplay's next album goes platinum?", yes: 0.64, createdAt: Date.now() - 1200000 },
  { id: 13, title: "Dua Lipa collaborates with DaBaby?", yes: 0.41, createdAt: Date.now() - 1300000 },
  { id: 14, title: "Ed Sheeran's tour breaks attendance records?", yes: 0.77, createdAt: Date.now() - 1400000 },
  { id: 15, title: "Ariana Grande's next album #1 on release?", yes: 0.85, createdAt: Date.now() - 1500000 }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get('cursor');
    const limit = parseInt(searchParams.get('limit') || '5');
    
    // Find starting index based on cursor
    let startIndex = 0;
    if (cursor) {
      const cursorId = parseInt(cursor);
      const cursorIndex = predictionsDB.findIndex(p => p.id === cursorId);
      startIndex = cursorIndex >= 0 ? cursorIndex + 1 : 0;
    }
    
    // Get predictions slice
    const predictions = predictionsDB.slice(startIndex, startIndex + limit);
    
    // Determine if there are more predictions
    const nextCursor = predictions.length > 0 ? predictions[predictions.length - 1].id.toString() : null;
    const hasMore = startIndex + limit < predictionsDB.length;
    
    return NextResponse.json({ 
      predictions,
      nextCursor,
      hasMore
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch predictions' }, { status: 500 });
  }
}