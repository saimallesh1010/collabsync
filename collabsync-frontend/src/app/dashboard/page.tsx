"use client";

import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function DashboardPage() {
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = { sender: "You", content: input.trim() };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Fake bot reply
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "Bot", content: "Got it!" }]);
    }, 500);
  };

  const handleFileUpload = async () => {
    if (!file) return toast.error("Please choose a file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/upload-summary", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const summary = res.data.summary;
      setMessages((prev) => [...prev, { sender: "CollabBot", content: summary }]);
      toast.success("Summary received from AI!");
    } catch (err) {
      toast.error("Upload failed or server error.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 py-10 px-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-2xl">
        <div className="border-b p-4 font-semibold text-lg flex items-center gap-2">
          <span>💬</span> CollabSync Chat
        </div>
        <div className="p-4 h-[400px] overflow-y-auto space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`max-w-[75%] px-4 py-2 rounded-lg text-sm ${
                msg.sender === "You"
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <strong>{msg.sender === "You" ? "You: " : ""}</strong>
              {msg.content}
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 border-t p-4">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend}>Send</Button>
        </div>

        <div className="flex items-center gap-2 border-t p-4 bg-gray-50">
          <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <Button onClick={handleFileUpload} disabled={loading}>
            {loading ? "Summarizing..." : "Upload & Summarize"}
          </Button>
        </div>
      </div>
    </div>
  );
}
