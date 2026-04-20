import HTML from './index.html';

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Proxy quote form submissions to ScanTracker
    if (url.pathname === '/api/public-quote' && request.method === 'POST') {
      return fetch('https://scantracker.scancore.ai/api/public-quote', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: request.body,
      });
    }

    // Serve the site for all other routes
    return new Response(HTML, {
      headers: {
        'content-type': 'text/html; charset=UTF-8',
        'cache-control': 'no-store',
      },
    });
  },
};
