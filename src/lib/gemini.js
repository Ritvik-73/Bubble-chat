const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`

export const askGemini = async (prompt) => {
  try {
    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are Bubble AI, a helpful assistant inside a chat app called Bubble Chat. Keep responses concise and conversational. User asked: ${prompt}`
              }
            ]
          }
        ]
      })
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Gemini API error:', data)
      if (response.status === 429) {
        return 'I am a little overwhelmed right now. Try again in a moment! 😅'
      }
      return 'Sorry, I could not generate a response.'
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response.'

  } catch (error) {
    console.error('Gemini error:', error)
    return 'Sorry, something went wrong. Try again!'
  }
}