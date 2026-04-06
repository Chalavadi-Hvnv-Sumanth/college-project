"use client";

import { useState, useEffect } from "react";
import supabase from "@/lib/supabaseClient";
import "./projects.css";

// ================= VIEWER =================
function Viewer({ folderName, onBack }) {
  const [data, setData] = useState([]);
  const [path, setPath] = useState(folderName);

  const [fileUrl, setFileUrl] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [previewType, setPreviewType] = useState(null);

  useEffect(() => {
    if (path) loadData(path);
  }, [path]);

  async function loadData(folderName) {
    const { data, error } = await supabase
      .storage
      .from("root")
      .list(folderName, { limit: 1000 });

    if (error) {
      console.error(error);
      return;
    }

    setData(data || []);
  }

  // ✅ UPDATED CLICK LOGIC
  async function handleClick(item) {
    const newPath = `${path}/${item.name}`;

    if (!item.metadata) {
      setPath(newPath);
      setFileUrl(null);
      setPreviewType(null);
    } else {
      const { data } = supabase
        .storage
        .from("root")
        .getPublicUrl(newPath);

      const url = data.publicUrl;
      const ext = item.name.split(".").pop().toLowerCase();

      const codeExt = [
        "js","ts","java","cpp","c","py","json","xml","yml","yaml","html","css"
      ];

      // ✅ CODE FILES
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

      // ✅ IMAGE / PDF
      if (["jpg","jpeg","png","gif","webp","pdf"].includes(ext)) {
        setFileUrl(url);
        setPreviewType("iframe");
        return;
      }

      // ❌ OTHER
      setPreviewType("unsupported");
      setFileUrl(null);
    }
  }

  function goBack() {
    const a = path.lastIndexOf("/");
    if (a === -1) {
      onBack();
      return;
    }
    setPath(path.substring(0, a));
    setFileUrl(null);
    setPreviewType(null);
  }

  // DOWNLOAD
  async function downloadFolder(name) {
    const { data } = await supabase
      .storage
      .from("zipstorage")
      .download(`${name}.zip`);

    if (!data) return;

    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.zip`;
     document.body.appendChild(a); 
    a.click();
     document.body.removeChild(a); 
     URL.revokeObjectURL(url);
  }

  const isTopLevel = path === folderName;

  return (
    <div className="file-containe">
      <div className="file-inne">

        <div className="path-bar">
          <button onClick={goBack}>⬅ Back</button>
          <span>{path}</span>
        </div>

        <div className="file-list">
          {data.length === 0 ? (
            <p className="empty-message">No files</p>
          ) : (
            data.map((item, index) => (
              <div key={index} className="file-row">

                <div
                  style={{ cursor: "pointer", flex: 1 }}
                  onClick={() => handleClick(item)}
                >
                  {item.metadata ? "📄" : "📁"} {item.name}
                </div>

                {isTopLevel && !item.metadata && (
                  <div
                    className="action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadFolder(item.name);
                    }}
                  >
                    ⬇ Download
                  </div>
                )}

              </div>
            ))
          )}
        </div>

        {/* ================= PREVIEW ================= */}
        {(previewType || fileUrl) && (
          <div className="preview">
            <h3>File Preview</h3>

            {/* IMAGE / PDF */}
            {previewType === "iframe" && (
              <>
                <iframe
                  src={fileUrl}
                  width="100%"
                  height="500px"
                  style={{ border: "none" }}
                />

                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  Open in new tab
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
        )}

      </div>
    </div>
  );
}

// ================= SEARCH =================
function Search({ onSelectFolder }) {
  const [query, setQuery] = useState("");
  const [folders, setFolders] = useState([]);
  const [searched, setSearched] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSearch() {
    if (!query.trim()) {
      setMessage("First enter folder name");
      setFolders([]);
      setSearched(true);
      return;
    }

    setMessage("");

    const { data, error } = await supabase
      .storage
      .from("root")
      .list("", { limit: 1000 });

    if (error) {
      console.error(error);
      setMessage("Error fetching folders");
      return;
    }

    const onlyFolders = (data || []).filter(item => item.metadata === null);

    const filtered = onlyFolders.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase().trim())
    );

    if (filtered.length === 0) {
      setMessage("No matching folders");
    }

    setFolders(filtered);
    setSearched(true);
  }

  return (
    <div className="deletecontaine">
      <h2>Search Your Friends VVITU Repositories</h2>

      <input
        type="text"
        placeholder="Search Other Repositories"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {searched && (
        <div className="file-list">
          {message ? (
            <p className="empty-message">{message}</p>
          ) : (
            folders.map((item, index) => (
              <div
                key={index}
                className="file-row"
                onClick={() => onSelectFolder(item.name)}
                style={{ cursor: "pointer" }}
              >
               <img src="/man.gif" width={27} height={27} /> {item.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ================= MAIN =================
export default function RepositoryManager() {
  const [selectedFolder, setSelectedFolder] = useState(null);

  return (
    <>
      {!selectedFolder ? (
        <Search onSelectFolder={setSelectedFolder} />
      ) : (
        <Viewer
          folderName={selectedFolder}
          onBack={() => setSelectedFolder(null)}
        />
      )}
    </>
  );
}