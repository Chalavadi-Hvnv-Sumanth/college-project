"use client";

import "./page.css"
import { createClient } from "@supabase/supabase-js";
import { useState } from "react";

const supabase = createClient(
    "https://azzxcjxmbcpimyjgldgt.supabase.co",
    "sb_secret_wN58kJTLrvGlEIbC9QlC2Q_8sjrGWeU"
);

export function UploadPage() {
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");

    const handleFolderUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;
        setUploading(true);
        setMessage("");

        for (const file of files) {
            // preserves folder structure
            const filePath = `uploads/${file.webkitRelativePath}`;

            const { error } = await supabase.storage
                .from("upload") // bucket name
                .upload(filePath, file, {
                    upsert: true,
                });

            if (error) {
                console.error(error);
                setMessage("❌ Some files failed to upload");
                setUploading(false);
                return;
            }
        }

        setMessage("✅ Folder uploaded successfully");
        setUploading(false);
    };

    return (
        <div style={{ padding: 40 }}>
            <h2 className="text">Upload Folder</h2>

            <input
                type="file"
                webkitdirectory="true"
                directory="true"
                multiple
                onChange={handleFolderUpload}
            />

            {<p className="text">uploading</p> && <p className="text">Uploading folder...</p>}
            {<p className="text">message</p> && <p className="text">{message}</p>}
        </div>
    );
}

export function DownloadButton({ fileName }) {
    const handleDownload = async () => {
        console.log("Downloading:", fileName);

        if (!fileName) {
            alert("fileName is missing");
            return;
        }

        const filePath = `uploads/hj/${fileName}`;

        const { data, error } = await supabase.storage
            .from("upload")
            .download(filePath);

        if (error) {
            console.error(error);
            return;
        }

        const url = URL.createObjectURL(data);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    };

    return <button onClick={handleDownload}>⬇️ Download</button>;
}

