const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());

// A simple knowledge base for Artificial Labs
const knowledgeBase = {
  "about": "Artificial Labs is INDIA'S FIRST & MOST POWERFUL AI FILM PRODUCTION HOUSE. We specialize in using Generative AI tools to create films and ads.",
  "services": "We offer AI-powered film and ad production, including services like performance editing, localization, and creating virtual avatars. We aim to make storytelling more efficient and creative.",
  "projects": "Our notable projects include the 'Genius mat Bano, Supercoins Chuno' campaign for Cleartrip, which was India's first AI-generated ad in the travel sector.",
  "contact": "You can contact Artificial Labs by emailing us at contact@artificiallabs.in or by calling +91-9036100018.",
  "who are you": "I am Artie, the official chatbot of Artificial Labs. I'm here to answer your questions about the company and our services.",
  "hello": "Hello! How can I help you today?",
  "hi": "Hi there! I'm ready to assist you. What would you like to know?",
  "joke": "Did you want to hear a joke?"
};

// Function to find the best response from the knowledge base
function findResponse(message) {
  const lowercaseMessage = message.toLowerCase();

  // Check for direct keywords
  for (const keyword in knowledgeBase) {
    if (lowercaseMessage.includes(keyword)) {
      return knowledgeBase[keyword];
    }
  }

  // Fallback to a default response if no keyword is found
  return "I'm sorry, I don't have information on that. Can you please ask about our services, projects, or how to contact us?";
}

// Change this line:
// app.post('/api', (req, res) => {

// To this line:
app.post('/', (req, res) => {
  const userMessage = req.body.message;
  console.log(`Received message: ${userMessage}`);

  // ... rest of your code ...
});
  const botReply = findResponse(userMessage);

  res.json({ message: botReply });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
