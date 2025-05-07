import React, { useState } from "react";
import axios from "axios";
import { Paperclip, Send } from "lucide-react";

export default function RaiseTicket({ onTicketRaised }) {
  const [query, setQuery] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const userData = JSON.parse(localStorage.getItem("profile"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query) return setStatus({ type: "error", message: "Enter a query." });

    const formData = new FormData();
    formData.append("query", query);
    formData.append("userId", userData.userId);
    if (file) formData.append("attachment", file);

    try {
      await axios.post(
        `${import.meta.env.VITE_CS_SERVER_BASE_URL}/tickets`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setStatus({ type: "success", message: "Ticket raised!" });
      setQuery("");
      setFile(null);
      onTicketRaised();
    } catch (err) {
      const msg = err.response?.data?.error || "Something went wrong.";
      setStatus({ type: "error", message: msg });
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Raise a Ticket</h2>
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-400"
          rows={4}
          placeholder="Describe your issue..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          required
        />
        <label className="flex items-center space-x-2 cursor-pointer">
          <Paperclip size={18} />
          <span>Attach (optional)</span>
          <input
            type="file"
            className="sr-only"
            accept="image/*,.pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </label>
        {file && <p className="text-sm text-gray-600">{file.name}</p>}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Submit <Send size={16} />
        </button>
      </form>
    </div>
  );
}
