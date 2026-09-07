/**
 * Next.js API Route - Blockchain Service Proxy
 * Proxies requests to the blockchain service on EC2 to avoid CORS issues
 */

const BLOCKCHAIN_SERVICE_URL = 'http://13.203.55.241:8000';

export async function GET(request, { params }) {
  const path = params.path.join('/');
  const url = `${BLOCKCHAIN_SERVICE_URL}/${path}`;
  
  console.log('[Blockchain Proxy] GET:', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    
    return Response.json(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[Blockchain Proxy] Error:', error);
    return Response.json(
      { detail: error.message || 'Failed to fetch from blockchain service' },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  const path = params.path.join('/');
  const url = `${BLOCKCHAIN_SERVICE_URL}/${path}`;
  
  console.log('[Blockchain Proxy] POST:', url);

  try {
    const body = await request.json();
    console.log('[Blockchain Proxy] Body:', body);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    return Response.json(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[Blockchain Proxy] Error:', error);
    return Response.json(
      { detail: error.message || 'Failed to post to blockchain service' },
      { status: 500 }
    );
  }
}
