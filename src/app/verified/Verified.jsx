"use client";

import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import Image from "next/image";
import "./verified.css";

export default function VerifiedProjects() {
  const [verifiedProjects, setVerifiedProjects] = useState([]);

  useEffect(() => {
    fetchVerifiedProjects();
  }, []);

  async function fetchVerifiedProjects() {
    const { data, error } = await supabase
      .from("verified_projects")
      .select("project_name");

    if (error) {
      console.error("Error fetching verified projects:", error);
      return;
    }

    setVerifiedProjects(data || []);
  }

  return (
    <div className="vp-container">
      <div className="vp-inner">
        <div className="vp-header">
          <Image
            src="/VVIT.png"
            alt="VVIT Logo"
            width={80}
            height={80}
            className="vp-image"
          />
          <h2>Verifited Project Floders By Admin</h2>
        </div>

        <div className="vp-list">
          {verifiedProjects.length === 0 && (
            <div className="vp-row vp-no-projects">
              <span className="vp-folder">📁</span>
              <span>No verified projects</span>
            </div>
          )}

          {verifiedProjects.map((project, index) => (
            <div key={index} className="vp-row">
              <div className="vp-left">
                <span className="vp-folder">📁</span>
                <span className="vp-name">{project.project_name}</span>
              </div>
              <span className="vp-tick">Verified</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}