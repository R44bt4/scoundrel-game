// Cloudflare Worker — counter API for Scoundrel
// Deploy via Cloudflare Dashboard → Workers → Create Worker
// Then create a KV namespace called "COUNTERS" and bind it

export default {
  async fetch(request, env) {
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Content-Type': 'application/json',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    const url = new URL(request.url);

    // GET /stats — return both counters
    if (url.pathname === '/stats') {
      const games = parseInt(await env.COUNTERS.get('games') || '0');
      const players = parseInt(await env.COUNTERS.get('players') || '0');
      return new Response(JSON.stringify({ games, players }), { headers });
    }

    // POST /game — increment games counter
    if (url.pathname === '/game' && request.method === 'POST') {
      const current = parseInt(await env.COUNTERS.get('games') || '0');
      await env.COUNTERS.put('games', String(current + 1));
      return new Response(JSON.stringify({ games: current + 1 }), { headers });
    }

    // POST /visit — increment players counter
    if (url.pathname === '/visit' && request.method === 'POST') {
      const current = parseInt(await env.COUNTERS.get('players') || '0');
      await env.COUNTERS.put('players', String(current + 1));
      return new Response(JSON.stringify({ players: current + 1 }), { headers });
    }

    return new Response('Not found', { status: 404, headers });
  }
};
