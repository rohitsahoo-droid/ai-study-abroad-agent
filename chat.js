export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    return res.status(500).json({
      error: { message: 'Missing GEMINI_API_KEY in Vercel.' }
    });
  }

  try {
    const body = req.body;

    const userMessage =
      body.messages?.map(m => m.content).join(" ") || "Hello";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userMessage }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    return res.status(200).json({
      content: [
        {
          text:
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "No response generated."
        }
      ]
    });

  } catch (err) {
    return res.status(500).json({
      error: { message: err.message }
    });
  }
}
