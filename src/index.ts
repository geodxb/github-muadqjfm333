export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Obtener IP del cliente
    const clientIP = request.headers.get('CF-Connecting-IP') ||
                     request.headers.get('X-Forwarded-For') ||
                     'unknown';

    // Lista blanca de IPs autorizadas
    const authorizedIPs = [
      '189.203.12.82',
      '193.186.4.212',
      '2806:2f0:74a0:c161:4dd6:d710:be4:61c8',
      '2806:2f0:74a0:c161:9d72:302a:ba4a:364e',
      '192.168.100.168',
      '127.0.0.1', '::1', 'localhost'
    ];

    const isAuthorized = authorizedIPs.includes(clientIP) ||
                         clientIP.startsWith('192.168.') ||
                         clientIP.startsWith('10.') ||
                         clientIP.startsWith('172.');

    try {
      // Proxy de API para IPs autorizadas
      if (isAuthorized && pathname.startsWith('/api/')) {
        const backendURL = 'https://YOUR_BACKEND_URL'; // Cambiar a tu backend
        const targetURL = `${backendURL}${pathname}${url.search}`;
        const proxyRequest = new Request(targetURL, {
          method: request.method,
          headers: request.headers,
          body: request.body
        });
        return await fetch(proxyRequest);
      }

      // Servir archivos estáticos primero
      let assetResponse = await env.ASSETS.fetch(request);

      // ✅ Si el archivo existe y tiene extensión (favicon, js, css, png) devuélvelo sin cambios
      if (assetResponse.ok && pathname.includes('.')) return assetResponse;

      // ✅ Si no existe y no es un archivo → fallback a index.html (SPA)
      if (assetResponse.status === 404 && !pathname.includes('.')) {
        const indexRequest = new Request(new URL('/index.html', request.url), request);
        assetResponse = await env.ASSETS.fetch(indexRequest);
      }

      // ✅ Inyectar script solo en index.html para IPs no autorizadas
      if (!isAuthorized && assetResponse.ok && (pathname === '/' || pathname === '/index.html' || !pathname.includes('.'))) {
        let html = await assetResponse.text();
        const injectionScript = `
          <script>
            window.ipAccessDenied = {
              status: true,
              ip: "${clientIP}",
              timestamp: "${new Date().toISOString()}"
            };
          </script>
        `;
        html = html.replace('</head>', `${injectionScript}</head>`);
        return new Response(html, {
          headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache'
          }
        });
      }

      return assetResponse;
    } catch (error) {
      return new Response('Service Temporarily Unavailable', { 
        status: 503,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};

interface Env {
  ASSETS: Fetcher;
}
