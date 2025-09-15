import React from 'react';

// Main Chatbot Component
export default function App() {
    // --- STATE MANAGEMENT ---
    const [messages, setMessages] = React.useState([
        {
            id: 1,
            author: 'bot',
            text: "What's up! I'm Artie, the digital brain at Artificial Labs. 🤖 I'm here to spill the tea on how we're shaking up the insurance game. What's the plan? Ask me about our workflow, projects, or just say hi!",
            timestamp: new Date()
        }
    ]);
    const [userInput, setUserInput] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const chatEndRef = React.useRef(null);

    // --- EFFECTS ---
    React.useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // --- CORE LOGIC ---
    // Call our Netlify backend function (OpenAI key is stored in Netlify env vars)
    const getBotResponse = async (input) => {
        try {
            const response = await fetch("/.netlify/functions/index", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });

            if (!response.ok) {
                console.error("API Error Response:", await response.text());
                return "Yikes, my brain just hit a 404 error. Could you try again?";
            }

            const result = await response.json();
            return result.message || "My circuits are tangled rn, try again?";
        } catch (error) {
            console.error("Failed to fetch bot response:", error);
            return "Oof, major lag. My connection to the digital universe just dropped. Try again in a sec.";
        }
    };

    // --- EVENT HANDLERS ---
    const handleSubmit = async (e, suggestedInput) => {
        e.preventDefault();
        const currentInput = suggestedInput || userInput;
        if (!currentInput.trim() || isLoading) return;

        // Add user message
        const userMessage = {
            id: Date.now(),
            author: 'user',
            text: currentInput,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setUserInput('');
        setIsLoading(true);

        // Fetch bot response
        const botResponseText = await getBotResponse(currentInput);
        const botMessage = {
            id: Date.now() + 1,
            author: 'bot',
            text: botResponseText,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
    };

    const handleSuggestionClick = (suggestion) => {
        handleSubmit({ preventDefault: () => {} }, suggestion);
    };

    // --- RENDER ---
    return (
        <div className="font-sans bg-gray-50 flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col h-[70vh]">
                {/* Header */}
                <div className="p-5 border-b border-gray-200 rounded-t-2xl bg-gray-100 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white text-xl font-bold">A</div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Artie at Artificial Labs</h1>
                        <p className="text-sm text-green-500 flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                            Online
                        </p>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-6 overflow-y-auto bg-white">
                    <div className="space-y-6">
                        {messages.map((message) => (
                            <div key={message.id} className={`flex gap-3 ${message.author === 'bot' ? 'justify-start' : 'justify-end'}`}>
                                {message.author === 'bot' && (
                                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm shrink-0">A</div>
                                )}
                                <div className={`max-w-xs md:max-w-md p-4 rounded-2xl ${
                                    message.author === 'bot'
                                        ? 'bg-gray-100 text-gray-800 rounded-bl-none'
                                        : 'bg-indigo-600 text-white rounded-br-none'
                                }`}>
                                    <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{message.text}</p>
                                    <p className={`text-xs mt-2 opacity-50 ${message.author === 'bot' ? 'text-right' : 'text-left'}`}>
                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex gap-3 justify-start">
                                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white text-sm shrink-0">A</div>
                                <div className="max-w-xs p-4 rounded-2xl bg-gray-100 text-gray-800 rounded-bl-none flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-0"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></span>
                                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-300"></span>
                                </div>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>
                </div>

                {/* Suggestion Chips */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                        <button onClick={() => handleSuggestionClick("Tell me about your workflow")} className="px-3 py-1 text-sm bg-gray-100 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors">
                            Explain your workflow
                        </button>
                        <button onClick={() => handleSuggestionClick("Show me some projects")} className="px-3 py-1 text-sm bg-gray-100 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors">
                            Show me some projects
                        </button>
                        <button onClick={() => handleSuggestionClick("Tell me a joke")} className="px-3 py-1 text-sm bg-gray-100 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors">
                            Tell me a joke
                        </button>
                    </div>
                </div>

                {/* Input Form */}
                <div className="p-5 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                    <form onSubmit={handleSubmit} className="flex items-center space-x-4">
                        <input
                            type="text"
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            placeholder="Send a message..."
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed transition-all transform hover:scale-110"
                            disabled={isLoading || !userInput.trim()}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
