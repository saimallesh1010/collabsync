"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";

export default function UploadAndSummarize() {
  const [file, setFile] = useState<File | null>(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setSummary("");
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must be logged in.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:5000/api/upload-summary", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload file");

      const data = await response.json();
      setSummary(data.summary || "No summary returned.");
    } catch (err) {
      toast.error("Error uploading file.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-semibold mb-4">Upload and Summarize</h2>

      <Input type="file" onChange={handleFileChange} className="mb-4" />

      <Button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload & Summarize"}
      </Button>

      {summary && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <h3 className="font-medium mb-2">Summary:</h3>
          <p className="text-sm whitespace-pre-wrap">{summary}</p>
        </div>
      )}
    </div>
  );
}
