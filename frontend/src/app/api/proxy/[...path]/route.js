import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:5000';

/**
 * API Proxy Route Handler
 * Proxies all requests to the hosted backend to avoid CORS issues
 */
export async function POST(request, context) {
  try {
    // Get the API path from the route params
    const params = await context.params;
    const pathSegments = params.path || [];
    const apiPath = '/' + (Array.isArray(pathSegments) ? pathSegments.join('/') : pathSegments);
    
    // Get request body safely
    let body = {};
    try {
      body = await request.json();
    } catch (e) {
      // Body might be empty for some requests
      console.log('[Proxy] No JSON body in request');
    }
    
    // Get authorization header if present
    const authHeader = request.headers.get('authorization');
    
    // Build headers for backend request
    const headers = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true', // Skip ngrok browser warning
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    // Make request to actual backend
    const backendUrl = `${BACKEND_URL}${apiPath}`;
    console.log('[Proxy] POST:', backendUrl);
    console.log('[Proxy] Headers:', { ...headers, Authorization: authHeader ? 'Bearer ***' : 'none' });
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers,
      body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
    });
    
    console.log('[Proxy] Response status:', response.status);
    
    // Get response data
    const contentType = response.headers.get('content-type');
    let data;
    
    try {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        // Try to parse as JSON even if content-type isn't set correctly
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }
      }
    } catch (parseError) {
      console.error('[Proxy] Parse error:', parseError);
      return NextResponse.json(
        { detail: 'Failed to parse backend response' },
        { status: 500 }
      );
    }
    
    console.log('[Proxy] Response data:', data);
    
    // Return response with same status code
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('[Proxy] Error:', error);
    return NextResponse.json(
      { detail: error.message || 'Proxy error occurred' },
      { status: 500 }
    );
  }
}

export async function GET(request, context) {
  try {
    // Get the API path from the route params
    const params = await context.params;
    const pathSegments = params.path || [];
    const apiPath = '/' + (Array.isArray(pathSegments) ? pathSegments.join('/') : pathSegments);
    
    // Get query string if present
    const { search } = new URL(request.url);
    
    // Get authorization header if present
    const authHeader = request.headers.get('authorization');
    
    // Build headers for backend request
    const headers = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    // Make request to actual backend
    const backendUrl = `${BACKEND_URL}${apiPath}${search}`;
    console.log('[Proxy] GET:', backendUrl);
    console.log('[Proxy] Headers:', { ...headers, Authorization: authHeader ? 'Bearer ***' : 'none' });
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers,
    });
    
    console.log('[Proxy] Response status:', response.status);
    
    // Get response data
    const contentType = response.headers.get('content-type');
    let data;
    
    try {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        // Try to parse as JSON even if content-type isn't set correctly
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }
      }
    } catch (parseError) {
      console.error('[Proxy] Parse error:', parseError);
      return NextResponse.json(
        { detail: 'Failed to parse backend response' },
        { status: 500 }
      );
    }
    
    console.log('[Proxy] Response data:', data);
    
    // Return response with same status code
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('[Proxy] Error:', error);
    return NextResponse.json(
      { detail: error.message || 'Proxy error occurred' },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  try {
    // Get the API path from the route params
    const params = await context.params;
    const pathSegments = params.path || [];
    const apiPath = '/' + (Array.isArray(pathSegments) ? pathSegments.join('/') : pathSegments);
    
    let body = {};
    try {
      body = await request.json();
    } catch (e) {
      console.log('[Proxy] No JSON body in PUT request');
    }
    
    const authHeader = request.headers.get('authorization');
    
    const headers = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const backendUrl = `${BACKEND_URL}${apiPath}`;
    console.log('[Proxy] PUT:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'PUT',
      headers,
      body: Object.keys(body).length > 0 ? JSON.stringify(body) : undefined,
    });
    
    console.log('[Proxy] Response status:', response.status);
    
    const contentType = response.headers.get('content-type');
    let data;
    
    try {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }
      }
    } catch (parseError) {
      console.error('[Proxy] Parse error:', parseError);
      return NextResponse.json(
        { detail: 'Failed to parse backend response' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('[Proxy] Error:', error);
    return NextResponse.json(
      { detail: error.message || 'Proxy error occurred' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  try {
    // Get the API path from the route params
    const params = await context.params;
    const pathSegments = params.path || [];
    const apiPath = '/' + (Array.isArray(pathSegments) ? pathSegments.join('/') : pathSegments);
    const authHeader = request.headers.get('authorization');
    
    const headers = {
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
    };
    
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    const backendUrl = `${BACKEND_URL}${apiPath}`;
    console.log('[Proxy] DELETE:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers,
    });
    
    console.log('[Proxy] Response status:', response.status);
    
    const contentType = response.headers.get('content-type');
    let data;
    
    try {
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { message: text };
        }
      }
    } catch (parseError) {
      console.error('[Proxy] Parse error:', parseError);
      return NextResponse.json(
        { detail: 'Failed to parse backend response' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data, { status: response.status });
    
  } catch (error) {
    console.error('[Proxy] Error:', error);
    return NextResponse.json(
      { detail: error.message || 'Proxy error occurred' },
      { status: 500 }
    );
  }
}
