export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Add security headers
    const securityHeaders = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self';",
    };

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
          ...securityHeaders,
        },
      });
    }

    // API routes
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(request, env, url);
    }

    // Serve static assets with security headers
    const response = await env.ASSETS.fetch(request);
    const newResponse = new Response(response.body, response);
    
    // Add security headers to all responses
    Object.entries(securityHeaders).forEach(([key, value]) => {
      newResponse.headers.set(key, value);
    });

    return newResponse;
  },
};

async function handleApiRequest(request, env, url) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };

  try {
    // Health check endpoint
    if (url.pathname === '/api/health') {
      return new Response(JSON.stringify({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        environment: env.ENVIRONMENT || 'production'
      }), {
        status: 200,
        headers: corsHeaders,
      });
    }

    // Auth status endpoint
    if (url.pathname === '/api/auth/status') {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ authenticated: false }), {
          status: 401,
          headers: corsHeaders,
        });
      }

      // In a real implementation, you'd verify the JWT token here
      return new Response(JSON.stringify({ 
        authenticated: true,
        message: 'Token validation would happen here'
      }), {
        status: 200,
        headers: corsHeaders,
      });
    }

    // User profile endpoint (protected)
    if (url.pathname === '/api/user/profile') {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: corsHeaders,
        });
      }

      // Mock user data - in real implementation, fetch from database
      return new Response(JSON.stringify({
        id: 'user123',
        name: 'Julie Huchet',
        email: 'julie@example.com',
        role: 'admin'
      }), {
        status: 200,
        headers: corsHeaders,
      });
    }

    // 404 for unknown API routes
    return new Response(JSON.stringify({ error: 'API endpoint not found' }), {
      status: 404,
      headers: corsHeaders,
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
