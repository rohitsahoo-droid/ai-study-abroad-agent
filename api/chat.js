export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GEMINI_KEY    = process.env.GEMINI_API_KEY;
  const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

  if (!GEMINI_KEY && !ANTHROPIC_KEY) {
    return res.status(500).json({
      content: [{ text: '⚠️ No API key configured. Add GEMINI_API_KEY in Vercel Environment Variables.' }]
    });
  }

  const body = req.body;

  try {
    if (GEMINI_KEY) {
      const systemPrompt = body.system || '';
      const messages = body.messages || [];

      const contents = [];
      for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        let text = msg.content;
        if (i === 0 && msg.role === 'user' && systemPrompt) {
          text = systemPrompt + '\n\nUser: ' + text;
        }
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text }]
        });
      }

      // v1beta + gemini-2.5-flash = correct combination per Google docs
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;

      const geminiResp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: { maxOutputTokens: body.max_tokens || 500 }
        })
      });

      const geminiData = await geminiResp.json();

      if (geminiData.error) {
        return res.status(400).json({
          content: [{ text: '⚠️ Gemini error: ' + geminiData.error.message }]
        });
      }

      const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.';
      return res.status(200).json({ content: [{ type: 'text', text }] });
    }

    if (ANTHROPIC_KEY) {
      const anthropicResp = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: body.max_tokens || 500,
          system: body.system,
          messages: body.messages,
        }),
      });
      const data = await anthropicResp.json();
      return res.status(anthropicResp.status).json(data);
    }

  } catch (err) {
    return res.status(500).json({ content: [{ text: '⚠️ Server error: ' + err.message }] });
  }
}
