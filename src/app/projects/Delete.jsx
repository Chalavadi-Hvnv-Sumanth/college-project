"use client";

import { useState } from "react";
import supabase from "@/lib/supabaseClient";
import "./projects.css";

export default function Delete() {
  const [folder, setFolder] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const BUCKET = "root";

  const deleteFolderRecursive = async (path) => {
    let filesToDelete = [];

    const traverse = async (currentPath) => {
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .list(currentPath, { limit: 1000 });

      if (error) throw error;
      if (!data || data.length === 0) return;

      for (const item of data) {
        const fullPath = currentPath
          ? `${currentPath}/${item.name}`
          : item.name;

        if (item.metadata === null) {
          await traverse(fullPath);
        } else {
          filesToDelete.push(fullPath);
        }
      }
    };

    await traverse(path);

    if (filesToDelete.length === 0) {
      throw new Error("Folder is empty or does not exist");
    }

    const { error } = await supabase.storage
      .from(BUCKET)
      .remove(filesToDelete);

    if (error) throw error;

    // ✅ GET SECOND PART
    const parts = path.split("/");
    const subFolder = parts[1]; // "kkkkk"

    if (!subFolder) {
      throw new Error("Invalid folder format. Use: parent/subfolder");
    }

    const zipFile = `${subFolder}.zip`;

    const { error: zipError } = await supabase.storage
      .from("zipstorage")
      .remove([zipFile]);

    if (zipError) throw zipError;
  };

  const handleDelete = async () => {
    if (!folder.trim()) {
      setMessage("❌ Please enter folder name");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await deleteFolderRecursive(folder.trim());

      setMessage("✅ Folder deleted successfully");
      setFolder("");
    } catch (err) {
      console.error(err);
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="deletecontainer">
      <h2>Delete Yours VVITU Repository Folders</h2>

      <input
        type="text"
        placeholder="Enter folder (Ex: ch sumanth/kkkkk)"
        value={folder}
        onChange={(e) => setFolder(e.target.value)}
      />

      <button onClick={handleDelete} disabled={loading}>
        {loading ? "Deleting..." : "Delete"}
      </button>

      {message && <p className="message">{message}</p>}
    </div>
  );
}