import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sub = searchParams.get('sub');
  
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    let endpoint = `${BACKEND_URL}/api/v1/verification/my-requests`;
    
    if (sub === 'types') {
      endpoint = `${BACKEND_URL}/api/v1/verification/types`;
    } else if (sub === 'documents') {
      const request_id = searchParams.get('request_id');
      endpoint = `${BACKEND_URL}/api/v1/verification/requests/${request_id}/documents`;
    }

    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch verification data');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching verification data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verification data' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { searchParams, pathname } = new URL(request.url);
    const sub = searchParams.get('sub');
    
    let endpoint = `${BACKEND_URL}/api/v1/verification/requests`;
    
    // Handle documents/upload endpoint
    if (pathname.includes('/verification/documents/upload') || sub === 'upload') {
      endpoint = `${BACKEND_URL}/api/v1/verification/documents`;
    } else if (sub === 'documents') {
      const request_id = searchParams.get('request_id');
      endpoint = `${BACKEND_URL}/api/v1/verification/requests/${request_id}/documents`;
    }

    // For file uploads, we need to forward the FormData as-is
    const contentType = request.headers.get('content-type');
    const isFormData = contentType && contentType.includes('multipart/form-data');
    
    let bodyData;
    if (isFormData) {
      bodyData = await request.formData();
    } else {
      bodyData = await request.json();
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      },
      body: isFormData ? bodyData : JSON.stringify(bodyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to create verification request');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating verification request:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create verification request' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const request_id = searchParams.get('request_id');
    
    const endpoint = `${BACKEND_URL}/api/v1/verification/requests/${request_id}`;

    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to update verification request');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating verification request:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update verification request' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const document_id = searchParams.get('document_id');
    
    const endpoint = `${BACKEND_URL}/api/v1/verification/documents/${document_id}`;

    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to delete document');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete document' },
      { status: 500 }
    );
  }
}
