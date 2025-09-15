// api/index.js
const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  try {
    const body = JSON.parse(event.body || "{}");
    const userMessage = body.message || "";

    console.log(`Received message: ${userMessage}`);

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are Artie, the AI assistant for Artificial Labs. Be witty, Gen Z–style, and answer questions about Artificial Labs' services, projects, and contact details.`,
          },
          { role: "user", content: userMessage },
        ],
      }),
    });

    const data = await response.json();

    if (!data.choices || data.error) {
      console.error("OpenAI Error:", data);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: data.error?.message || "OpenAI API error" }),
      };
    }

    const botReply = data.choices[0].message.content;

    return {
      statusCode: 200,
      body: JSON.stringify({ message: botReply }),
    };
  } catch (err) {
    console.error("Handler error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
