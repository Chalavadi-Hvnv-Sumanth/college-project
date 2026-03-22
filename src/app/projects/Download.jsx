"use client";

import "./projects.css";
import { useState } from "react";
import supabase from "@/lib/supabaseClient";

export default function Download() {
  const [folder, setFolder] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!folder.trim()) {
      setMessage("❌ Please enter folder name");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const fileName = `${folder.trim()}.zip`;

      const { data, error } = await supabase.storage
        .from("zipstorage")
        .download(fileName);

      if (error) throw error;

      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();

      setMessage("✅ Download started");
    } catch (err) {
      
      setMessage("❌ Folder Does Not Exist In Server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="deletecontainer">
      <h2>Download Yours VVITU Repository Folders</h2>

      <input
        type="text"
        placeholder="Enter folder name (Ex: myFolder)"
        value={folder}
        onChange={(e) => setFolder(e.target.value)}
      />

      <button onClick={handleDownload} disabled={loading}>
        {loading ? "Downloading..." : "Download"}
      </button>

      {message && <p className="message">{message}</p>}
    </div>
  );
}