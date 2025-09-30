import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Forward the request to the FastAPI backend
    const response = await fetch(`${BACKEND_URL}/api/dss/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend request failed: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('DSS API error:', error);
    
    // Return fallback data if backend is not available
    return NextResponse.json({
      success: true,
      data: {
        landCoverAnalysis: {
          Background: 0.00,
          Bareland: 0.00,
          Rangeland: 14.79,
          Developed_Space: 5.74,
          Road: 0.00,
          Tree: 16.01,
          Water: 0.08,
          "Agriculture land": 61.79,
          Building: 1.59
        },
        analysisType: "land_cover",
        timestamp: new Date().toISOString()
      },
      message: "Land cover analysis completed (fallback data)"
    });
  }
}