// src/app/history/page.tsx

"use client";

import React from "react";

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Prediction History</h1>
        <div className="bg-white shadow-lg rounded-xl p-6">
          <p className="text-gray-500 text-center">
            This is a placeholder for your upload and summary history. In a future version, you’ll be able to view your previously uploaded files and AI-generated meeting summaries.
          </p>
        </div>
      </div>
    </div>
  );
}
