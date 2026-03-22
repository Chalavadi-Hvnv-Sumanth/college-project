"use client";

import { useState, useEffect } from "react";
import supabase from "@/lib/supabaseClient";
import Image from "next/image";
import "./projects.css";

// Viewer component
function Viewer({ folderName, onBack }) {
  const [data, setData] = useState([]);
  const [path, setPath] = useState(folderName);
  const [fileUrl, setFileUrl] = useState(null);

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

  function handleClick(item) {
    const newPath = `${path}/${item.name}`;

    if (!item.metadata) {
      setPath(newPath);
      setFileUrl(null);
    } else {
      const { data } = supabase
        .storage
        .from("root")
        .getPublicUrl(newPath);

      setFileUrl(data.publicUrl);
    }
  }

  function goBack() {
    const a = path.lastIndexOf("/");
    if (a === -1) {
      onBack(); // go back to search if at root
      return;
    }
    setPath(path.substring(0, a));
    setFileUrl(null);
  }

  return (
    <>
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
                <div
                  key={index}
                  className="file-row"
                  onClick={() => handleClick(item)}
                  style={{ cursor: "pointer" }}
                >
                  {item.metadata ? "📄" : "📁"} {item.name}
                </div>
              ))
            )}
          </div>

          {fileUrl && (
            <div className="preview">
              <h3>File Preview</h3>
              <iframe
                src={fileUrl}
                title="preview"
                width="100%"
                height="500px"
                style={{ border: "none" }}
              />
              <a href={fileUrl} target="_blank" rel="noreferrer">
                Open in new tab
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Search component
function Search({ onSelectFolder }) {
  const [query, setQuery] = useState("");
  const [folders, setFolders] = useState([]);
  const [searched, setSearched] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSearch() {
    if (!query.trim()) {
      setMessage("First enter the folder name");
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

    if (onlyFolders.length === 0) {
      setMessage("No folder exists");
      setFolders([]);
      setSearched(true);
      return;
    }

    const filtered = onlyFolders.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );

    if (filtered.length === 0) setMessage("No matching folders");

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
                style={{ cursor: "pointer" }}
                onClick={() => onSelectFolder(item.name)}
              >
                📁 {item.name}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// Parent component controlling conditional rendering
export default function RepositoryManager() {
  const [selectedFolder, setSelectedFolder] = useState(null);

  function handleBack() {
    setSelectedFolder(null);
  }

  return (
    <>
      {!selectedFolder ? (
        <Search onSelectFolder={setSelectedFolder} />
      ) : (
        <Viewer folderName={selectedFolder} onBack={handleBack} />
      )}
    </>
  );
}