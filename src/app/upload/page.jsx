"use client";

import "./page.css";
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import JSZip from "jszip";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function UploadPage() {
  const { user, isLoading } = useUser();

  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);

  const handleFolderUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (!files.length || !user) return;

    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);

    if (totalSize > MAX_FILE_SIZE) {
      alert("File size must be less than 50 MB");
      return;
    }
  const rootFolder = files[0].webkitRelativePath.split("/")[0];
    setUploading(true);
    setMessage("");
    setProgress(0);

    let uploaded = 0;
    const total = files.length;

    const zip = new JSZip();

    try {
      for (const file of files) {
        const filePath = `${user.name}/${file.webkitRelativePath}`;

        const { error } = await supabase.storage
          .from("root")
          .upload(filePath, file, { upsert: true });

        if (error) throw error;

        zip.file(file.webkitRelativePath, file);

        uploaded++;
        setProgress(Math.round((uploaded / total) * 100));
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });

      const zipPath = `${rootFolder}.zip`;

      const { error: zipError } = await supabase.storage
        .from("zipstorage")
        .upload(zipPath, zipBlob, { upsert: true });

      if (zipError) throw zipError;

      setProgress(100);
      setMessage("✅ Files uploaded successfully");
    } catch (err) {
      console.error(err);
      setMessage("❌ " + err.message);
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (!user) return <p>Please login first</p>;

  return (
    <div className="upload-wrapper">
      <div className="upload-card">
        <label className="drop-zone">
          <input
            type="file"
            webkitdirectory="true"
            directory="true"
            multiple
            onChange={handleFolderUpload}
            hidden
          />

          <div className="drop-content">
            <div className="upload-icon">📁</div>
            <h3>Upload Folder</h3>
            <p>Drag & Drop your folder here</p>
            <span>or click to browse</span>
          </div>
        </label>

        {uploading && (
          <>
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="status uploading">
              Uploading... {progress}%
            </p>
          </>
        )}

        {message && <p className="status success">{message}</p>}
      </div>
    </div>
  );
}