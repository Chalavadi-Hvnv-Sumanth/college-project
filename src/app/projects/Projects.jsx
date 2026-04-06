"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import "./projects.css";
import { useUser } from "@auth0/nextjs-auth0/client";
import JSZip from "jszip";

export default function CallingFunction() {
  const [data, setData] = useState([]);
  const [path, setPath] = useState(null);

  const [previewType, setPreviewType] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [fileContent, setFileContent] = useState("");

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const { user, isLoading } = useUser();

  useEffect(() => {
    if (user) setPath(user.name);
  }, [user]);

  useEffect(() => {
    if (path) loadData(path);
  }, [path]);

  async function loadData(folder) {
    const { data } = await supabase.storage.from("root").list(folder);
    setData(data || []);
  }

  function isRoot() {
    return path && path.split("/").length === 1;
  }

  // ================= CLICK =================
  async function handleClick(item) {
    if (!item.metadata) {
      setPath(`${path}/${item.name}`);
      setPreviewType(null);
      return;
    }

    const { data } = supabase.storage
      .from("root")
      .getPublicUrl(`${path}/${item.name}`);

    const url = data.publicUrl;
    const ext = item.name.split(".").pop().toLowerCase();

    const codeExt = [
      "js","ts","java","cpp","c","py","json","xml","yml","yaml","html","css"
    ];

    // ✅ CODE FILES → show inside app only
    if (codeExt.includes(ext)) {
      try {
        const res = await fetch(url);
        const text = await res.text();
        setFileContent(text);
        setPreviewType("code");
        setFileUrl(null);
      } catch {
        setPreviewType("unsupported");
      }
      return;
    }

    // ✅ IMAGE / PDF → iframe + open button
    if (["jpg","jpeg","png","gif","webp","pdf"].includes(ext)) {
      setFileUrl(url);
      setPreviewType("iframe");
      return;
    }

    // ❌ OTHER
    setPreviewType("unsupported");
  }

  function goBack() {
    const parts = path.split("/");
    if (parts.length > 1) {
      parts.pop();
      setPath(parts.join("/"));
      setPreviewType(null);
    }
  }

  // ================= DOWNLOAD =================
  async function downloadFolder(name) {
    const { data } = await supabase.storage
      .from("zipstorage")
      .download(`${name}.zip`);

    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.zip`;
    a.click();
  }

  // ================= DELETE =================
  async function deleteFolder(name) {
    const folderPath = `${path}/${name}`;
    const { data } = await supabase.storage.from("root").list(folderPath);

    let files = [];
    for (const item of data) {
      if (item.metadata) files.push(`${folderPath}/${item.name}`);
    }

    if (files.length) {
      await supabase.storage.from("root").remove(files);
    }

    await supabase.storage.from("zipstorage").remove([`${name}.zip`]);
    loadData(path);
  }

  // ================= UPLOAD =================
  async function handleUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length || !user) return;

    const rootFolder = files[0].webkitRelativePath.split("/")[0];

    setUploading(true);
    setProgress(0);

    let uploaded = 0;
    const total = files.length;
    const zip = new JSZip();

    for (const file of files) {
      const filePath = `${user.name}/${file.webkitRelativePath}`;

      await supabase.storage
        .from("root")
        .upload(filePath, file, { upsert: true });

      zip.file(file.webkitRelativePath, file);

      uploaded++;
      setProgress(Math.round((uploaded / total) * 100));
    }

    const blob = await zip.generateAsync({ type: "blob" });

    await supabase.storage
      .from("zipstorage")
      .upload(`${rootFolder}.zip`, blob, { upsert: true });

    setUploading(false);
    loadData(path);
    e.target.value = "";
  }

  if (isLoading) return <p>Loading...</p>;
  if (!user) return <p>Login first</p>;

  return (
    <div className="file">

      {/* UPLOAD */}
      <div className="upload-top">
        {!uploading ? (
          <button
            className="upload-btn"
            onClick={() => document.getElementById("uploadInput").click()}
          >
            <img src="/upload.gif" />
            Upload
          </button>
        ) : (
          <div className="upload-progress-btn">
            <div
              className="upload-progress-bar"
              style={{ width: `${progress}%` }}
            />
            <span>{progress}%</span>
          </div>
        )}
      </div>

      <div className="file-in">

        <input
          type="file"
          webkitdirectory="true"
          multiple
          hidden
          id="uploadInput"
          onChange={handleUpload}
        />

        {/* PATH */}
        <div className="path-bar">
          <button onClick={goBack}>⬅ Back</button>
          <span>{path}</span>
        </div>

        {/* FILE LIST */}
        <div className="file-list">
          {data.length === 0 ? (
            <p className="empty-message">📂 No projects</p>
          ) : (
            data.map((item, i) => (
              <div
                key={i}
                className="file-row"
                onClick={() => handleClick(item)}
              >
                <span className="icon">
                  {item.metadata ? "📄" : "📁"}
                </span>

                <span className="file-name">{item.name}</span>

                {isRoot() && !item.metadata && (
                  <div className="actions">

                    <div
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        downloadFolder(item.name);
                      }}
                    >
                      <img src="/download1.gif" />
                      <span>Download</span>
                    </div>

                    <div
                      className="action-btn delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteFolder(item.name);
                      }}
                    >
                      <img src="/bin.gif" />
                      <span>Delete</span>
                    </div>

                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* ================= PREVIEW ================= */}
        <div className="preview">

          {/* IMAGE / PDF */}
          {previewType === "iframe" && (
            <>
              <iframe src={fileUrl}></iframe>

              {/* ✅ OPEN IN NEW TAB */}
              <a
  href={fileUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="open-btn"
  onClick={(e) => e.stopPropagation()}
  style={{ textDecoration: "none" }}
>
  <img src="" />
  Open in New Tab
</a>
            </>
          )}

          {/* CODE */}
          {previewType === "code" && (
            <pre
              style={{
                background: "#111",
                color: "#00ffcc",
                padding: "15px",
                borderRadius: "10px",
                maxHeight: "400px",
                overflow: "auto",
                fontSize: "14px"
              }}
            >
              {fileContent}
            </pre>
          )}

          {/* OTHER */}
          {previewType === "unsupported" && (
            <p className="empty-message">
              ❌ Preview not supported
            </p>
          )}

        </div>

      </div>
    </div>
  );
}