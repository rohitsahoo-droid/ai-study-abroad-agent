// api/chat.js  —  Vercel Serverless Proxy for Anthropic API
// Your secret API key lives here on the server — users never see it.

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // CORS headers — allow your frontend to call this
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!ANTHROPIC_API_KEY) {
    return res.status(500).json({
      error: { message: 'API key not configured on server. Please set ANTHROPIC_API_KEY in Vercel environment variables.' }
    });
  }

  try {
    const body = req.body;

    // Forward the request to Anthropic
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: body.model || 'claude-haiku-4-5-20251001',
        max_tokens: body.max_tokens || 1000,
        system: body.system || undefined,
        messages: body.messages,
      }),
    });

    const data = await response.json();

    // Pass through status + data from Anthropic
    return res.status(response.status).json(data);

  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({
      error: { message: 'Proxy server error: ' + err.message }
    });
  }
}
