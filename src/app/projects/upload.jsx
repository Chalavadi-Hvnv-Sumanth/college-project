"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import "./projects.css";
import { useUser } from "@auth0/nextjs-auth0/client";

async function retrieveData(folderName) {
  if (!folderName) return [];

  const { data, error } = await supabase
    .storage
    .from("root")
    .list(folderName);

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}

export default function CallingFunction() {
  const [data, setData] = useState([]);
  const [path, setPath] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);

  const { user, isLoading } = useUser();

  useEffect(() => {
    if (user) {
      setPath(user.name);
    }
  }, [user]);

  useEffect(() => {
    if (path) {
      loadData(path);
    }
  }, [path]);

  async function loadData(folderName) {
    const result = await retrieveData(folderName);
    setData(result);
  }

  function handleClick(item) {
    if (!item.metadata) {
      const newPath = `${path}/${item.name}`;
      setPath(newPath);
      setFileUrl(null);
    } else {
      const filePath = `${path}/${item.name}`;

      const { data } = supabase
        .storage
        .from("root")
        .getPublicUrl(filePath);

      setFileUrl(data.publicUrl);
    }
  }

  function goBack() {
    if (!path) return;

    const parts = path.split("/");

    if (parts.length > 1) {
      parts.pop();
      setPath(parts.join("/"));
      setFileUrl(null);
    }
  }

  if (isLoading) return <p>Loading...</p>;
  if (!user) return <p>Please login first</p>;

  return (
    <div className="file">
      <div className="file-in">

        <div className="path-bar">
          <button onClick={goBack}>⬅ Back</button>
          <span>{path}</span>
        </div>

        <div className="file-list">
          {data.length === 0 ? (
            <p className="empty-message">📂 No projects uploaded</p>
          ) : (
            data.map((item, index) => (
              <div
                key={index}
                className="file-row"
                onClick={() => handleClick(item)}
              >
                <span className="icon">
                  {item.metadata ? "📄" : "📁"}
                </span>

                <span className="file-name">
                  {item.name}
                </span>
              </div>
            ))
          )}
        </div>

        {fileUrl && (
          <div className="preview">
            <h3>File Preview</h3>

            <iframe
              src={fileUrl}
              title="file preview"
              width="100%"
              height="500px"
            />

            <a href={fileUrl} target="_blank" rel="noreferrer">
              Open in new tab
            </a>
          </div>
        )}

      </div>
    </div>
  );
}