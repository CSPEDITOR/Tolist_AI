import React, { useState } from "react";
import axios from "axios";

export default function GeminiPopup({ onAddTask, onDeleteAll }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "ai", text: "Hi! How can I help with your todos?" },
  ]);
  const [input, setInput] = useState("");

  const togglePopup = () => setIsOpen(!isOpen);

  const handleSend = async () => {
    if (!input.trim()) return;    //if the input is "  "  or empty then it retuns  ture then not excute it

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const result = await axios.post("http://localhost:4000/chat", {
        prompt: input,
      });

      const aiText = result?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (aiText) {
        handleAICommand(aiText.toLowerCase());
        setMessages((prev) => [...prev, { from: "ai", text: aiText }]);
      }
    } catch (err) {
      console.error("Gemini API Error:", err);
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: "❌ Error contacting Gemini API" },
      ]);
    }
  };

  // ✅ AI Command Handler (Add, Delete)
 const handleAICommand = (response) => {
  const lower = response.toLowerCase();
  const lines = response.split("\n");
  let addedAny = false;

  // ✅ 1. Numbered list like "1. Task"
  lines.forEach((line) => {
    const match = line.match(/^\d+\.\s*(.+)/);
    if (match) {
      onAddTask(match[1].trim());
      addedAny = true;
    }
  });

  // ✅ 2. Bullet list like "* Task"
  lines.forEach((line) => {
    const match = line.match(/^\*\s*(.+)/);
    if (match) {
      onAddTask(match[1].trim());
      addedAny = true;
    }
  });

  // ✅ 3. Comma-separated plain text fallback
  if (!addedAny && /add.+(task|hero|heroes)/.test(lower)) {
    const cleaned = response
      .replace(/add|task[s]?|hero(es)?/gi, "")
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    cleaned.forEach((item) => onAddTask(item));
    if (cleaned.length) addedAny = true;
  }

  // ✅ 4. Delete all logic
  const deleteKeywords = [
    "delete all",
    "remove all",
    "clearing tasks",
    "delete everything",
    "remove everything",
    "delete todos",
    "remove todos",
    "cleared",
    "removed",
  ];

  if (deleteKeywords.some((kw) => lower.includes(kw))) {
    onDeleteAll();
  }
};


  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div>
      <button
        onClick={togglePopup}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-full shadow-xl z-50"
      >
        💬 Add task by AI
      </button>

      {isOpen && (
        <div className="fixed bottom-20 right-6 w-80 bg-white text-black rounded-xl shadow-xl overflow-hidden flex flex-col h-[400px] z-50">
          <div className="bg-blue-600 text-white p-3 font-bold text-center relative">
            Gemini AI Chat
            <button
              onClick={togglePopup}
              className="absolute right-3 top-3 text-white text-xl"
            >
              ×
            </button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.from === "user"
                    ? "bg-blue-100 self-end text-right ml-auto"
                    : "bg-gray-200 text-left"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <div className="p-2 border-t flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Gemini to control tasks..."
              className="flex-1 px-3 py-1 rounded-lg border border-gray-300"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-3 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
