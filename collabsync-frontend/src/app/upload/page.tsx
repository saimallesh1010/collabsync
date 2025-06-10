"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Redirect to login if not authenticated
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setError("");
    setSummary("");
  };

  const handleUpload = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in.");
      toast.error("You must be logged in.");
      return;
    }

    if (!file) {
      setError("Please select a file to upload.");
      toast.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:5000/api/upload-summary", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
        credentials: "include", // ✅ Ensure Authorization header is preserved
      });

      if (response.status === 401) {
        toast.error("Unauthorized. Please log in again.");
        setError("Unauthorized access.");
        return;
      }

      if (!response.ok) {
        toast.error("Upload failed or server error.");
        setError("Upload failed or server error.");
        return;
      }

      const data = await response.json();
      setSummary(data.summary);
      toast.success("Summary generated successfully!");
    } catch (err) {
      console.error("❌ Upload error:", err);
      setError("Upload failed or server error.");
      toast.error("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📎 Upload Meeting Notes</h2>

      <input
        type="file"
        accept=".txt,.pdf,.docx"
        onChange={handleFileChange}
        className="mb-4 block w-full p-2 border rounded"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Summarizing..." : "Upload & Summarize"}
      </button>

      {error && <p className="text-red-600 mt-4">{error}</p>}

      {summary && (
        <div className="mt-6 bg-gray-100 p-4 rounded shadow">
          <h3 className="font-semibold mb-2">🧠 AI Summary:</h3>
          <p className="whitespace-pre-wrap">{summary}</p>
        </div>
      )}
    </div>
  );
}
