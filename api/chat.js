// api/chat.js — Universal AI Proxy (supports Gemini + Anthropic)
// Set ONE of these env vars in Vercel:
//   GEMINI_API_KEY   → uses Google Gemini (free tier available)
//   ANTHROPIC_API_KEY → uses Anthropic Claude

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GEMINI_KEY    = process.env.GEMINI_API_KEY;
  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

  if (!GEMINI_KEY && !ANTHROPIC_KEY) {
    return res.status(500).json({
      content: [{ text: '⚠️ No API key configured. Add GEMINI_API_KEY or ANTHROPIC_API_KEY in Vercel Environment Variables.' }]
    });
  }

  const body = req.body;

  try {
    // ── GEMINI PATH ──────────────────────────────────────────────
    if (GEMINI_KEY) {
      const systemPrompt = body.system || '';
      const messages = body.messages || [];

      const contents = [];
      for (const msg of messages) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      }

      const geminiBody = {
        system_instruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
        contents: contents,
        generationConfig: {
          maxOutputTokens: body.max_tokens || 1000,
          temperature: 0.7,
        }
      };
      if (!geminiBody.system_instruction) delete geminiBody.system_instruction;

      const model = 'gemini-1.5-flash-latest';
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`;

      const geminiResp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiBody)
      });

      const geminiData = await geminiResp.json();

      if (geminiData.error) {
        return res.status(400).json({
          content: [{ text: '⚠️ Gemini error: ' + geminiData.error.message }]
        });
      }

      const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
      return res.status(200).json({
        content: [{ type: 'text', text }]
      });
    }

    // ── ANTHROPIC PATH ───────────────────────────────────────────
    if (ANTHROPIC_KEY) {
      const anthropicResp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: body.model || 'claude-haiku-4-5-20251001',
          max_tokens: body.max_tokens || 1000,
          system: body.system || undefined,
          messages: body.messages,
        }),
      });
      const data = await anthropicResp.json();
      return res.status(anthropicResp.status).json(data);
    }

  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({
      content: [{ text: '⚠️ Server error: ' + err.message }]
    });
  }
}
