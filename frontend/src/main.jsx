// main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import ArtieChatbot from './artie_chatbot.jsx'; // import your chatbot component
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ArtieChatbot />
  </React.StrictMode>,
);
