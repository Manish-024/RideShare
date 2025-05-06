import React, { useState } from "react";
import axios from "axios";
import { Paperclip, Send } from "lucide-react";

export default function CustomerSupport() {
  const [query, setQuery] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query) {
      setStatus({ type: "error", message: "Please enter your query." });
      return;
    }

    const formData = new FormData();
    formData.append("query", query);
    if (file) formData.append("attachment", file);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_CS_SERVER_BASE_URL}/tickets`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setStatus({ type: "success", message: res.data.message });
      setQuery("");
      setFile(null);
    } catch (err) {
      const msg = err.response?.data?.error || "Something went wrong.";
      setStatus({ type: "error", message: msg });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Raise a Support Ticket
        </h2>

        {status && (
          <div
            className={`mb-4 p-3 rounded text-sm font-medium ${
              status.type === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Your Query</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={5}
              placeholder="Describe your issue in detail..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-gray-700 mb-2 cursor-pointer">
              <Paperclip size={18} />
              <span>Attachment (optional)</span>
              <input
                type="file"
                className="sr-only"
                onChange={(e) => setFile(e.target.files[0])}
                accept="image/*,.pdf,.doc,.docx"
              />
            </label>
            {file && <p className="text-gray-600 text-sm">{file.name}</p>}
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all"
          >
            Submit Ticket
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
