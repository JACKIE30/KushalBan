import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Proxying FRA export to backend:', { 
      type: body.type, 
      filename: body.filename,
      dataLength: body.data?.length 
    });
    
    const response = await fetch(`${BACKEND_URL}/api/fra-atlas/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log('Backend response:', data);
    
    if (!response.ok) {
      console.error('Backend returned error:', response.status, data);
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('FRA Atlas export proxy error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to export FRA Atlas data',
        message: 'Proxy error - check backend connection'
      },
      { status: 500 }
    );
  }
}
