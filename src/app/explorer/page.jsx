"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

/* ------------------ Supabase client ------------------ */
const supabase = createClient(
    "https://azzxcjxmbcpimyjgldgt.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6enhjanhtYmNwaW15amdsZGd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxOTQzNzMsImV4cCI6MjA4Mzc3MDM3M30.HFXQJCRCSizwDuO8s_kOhprb9MwxPYYVP__UnCOpfeU"
);

/* ------------------ Build tree ------------------ */
function buildTree(files) {
    const root = {};
    files.forEach((file) => {
        const parts = file.name.split("/");
        let current = root;
        parts.forEach((part, idx) => {
            if (!current[part]) current[part] = { __files: [], __open: false, __preview: null };
            if (idx === parts.length - 1) current[part].__files.push(file);
            current = current[part];
        });
    });
    return root;
}

/* ------------------ Main Component ------------------ */
export default function GithubStyleExplorer() {
    const [tree, setTree] = useState({});

    useEffect(() => {
        async function loadFiles() {
            const { data, error } = await supabase.storage.from("upload").list("", { limit: 100 });
            if (error) return console.error(error);
            setTree(buildTree(data));
        }
        loadFiles();
    }, []);

    /* Toggle folder open/close */
    const toggleFolder = (node) => {
        node.__open = !node.__open;
        setTree({ ...tree });
    };

    /* Open file preview inside the card */
    const openFile = async (node, file) => {
        const { data, error } = supabase.storage.from("upload").getPublicUrl(file.name);
        if (error) return console.error(error);
        node.__preview = { url: data.publicUrl, type: file.metadata?.mimetype, name: file.name };
        setTree({ ...tree });
    };

    /* Recursive renderer */
    const renderNode = (node, level = 0) =>
        Object.entries(node).map(([key, value]) => {
            if (key.startsWith("__")) return null;

            return (
                <div
                    key={key}
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: 6,
                        padding: 12,
                        margin: 8,
                        backgroundColor: "#fafafa",
                        marginLeft: level * 16,
                    }}
                >
                    {/* Folder Header */}
                    <div
                        style={{ cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center" }}
                        onClick={() => toggleFolder(value)}
                    >
                        {value.__open ? "📂" : "📁"} {key}
                    </div>

                    {/* Files */}
                    {value.__open &&
                        value.__files.map((file) => (
                            <div
                                key={file.name}
                                style={{
                                    cursor: "pointer",
                                    margin: "4px 0",
                                    padding: 6,
                                    border: "1px dashed #ccc",
                                    borderRadius: 4,
                                    backgroundColor: "#fff",
                                }}
                                onClick={() => openFile(value, file)}
                            >
                                📄 {file.name.split("/").pop()}
                            </div>
                        ))}

                    {/* Nested folders */}
                    {value.__open && renderNode(value, level + 1)}

                    {/* Preview inside the card */}
                    {value.__preview && (
                        <div style={{ marginTop: 8, padding: 8, borderTop: "1px solid #ccc" }}>
                            {value.__preview.type?.startsWith("image/") && <img src={value.__preview.url} width="100%" />}
                            {value.__preview.type?.startsWith("video/") && <video src={value.__preview.url} controls width="100%" />}
                            {value.__preview.type === "application/pdf" && <iframe src={value.__preview.url} width="100%" height="300" />}
                            {!value.__preview.type?.startsWith("image/") &&
                                !value.__preview.type?.startsWith("video/") &&
                                value.__preview.type !== "application/pdf" && (
                                    <a href={value.__preview.url} target="_blank" rel="noopener noreferrer">
                                        Open File
                                    </a>
                                )}
                        </div>
                    )}
                </div>
            );
        });

    return (
        <div style={{ display: "flex", flexDirection: "column", padding: 20 }}>
            <h2>GitHub-Style File Explorer</h2>
            <div style={{ display: "flex", flexWrap: "wrap" }}>{renderNode(tree)}</div>
        </div>
    );
}
