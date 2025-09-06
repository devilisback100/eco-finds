// Chatbot.jsx
import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css";

const API_BASE_URL = process.env.REACT_APP_MODEL_API_URL || "http://localhost:5000";

export default function Chatbot({ userId = "guest" }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMsg = { sender: "user", text: input };
        setMessages((prev) => [...prev, newMsg]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: input,
                    user_id: userId,
                    images: []
                }),
            });

            const data = await res.json();
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: data.response || "No response" }
            ]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { sender: "bot", text: "⚠️ Error: " + err.message }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            <button
                className="chatbot-toggle"
                onClick={() => setIsOpen(!isOpen)}
            >
                💬
            </button>

            {isOpen && (
                <div className="chatbot-window">
                    <div className="chatbot-header">EcoFinds Assistant</div>
                    <div className="chatbot-messages">
                        {messages.map((msg, i) => (
                            <div key={i} className={`chat-msg ${msg.sender}`}>
                                {msg.text}
                            </div>
                        ))}
                        {loading && <div className="chat-msg bot">⏳ Thinking...</div>}
                        <div ref={messagesEndRef} />
                    </div>
                    <div className="chatbot-input">
                        <input
                            type="text"
                            value={input}
                            placeholder="Ask me anything..."
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        />
                        <button onClick={sendMessage}>➤</button>
                    </div>
                </div>
            )}
        </div>
    );
}
