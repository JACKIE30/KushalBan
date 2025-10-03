import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Processing asset mapping:', body);
    
    const response = await fetch(`${BACKEND_URL}/api/asset-mapping/process`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('Asset mapping result:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Asset mapping proxy error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to process asset mapping',
        message: 'Proxy error - check backend connection'
      },
      { status: 500 }
    );
  }
}
