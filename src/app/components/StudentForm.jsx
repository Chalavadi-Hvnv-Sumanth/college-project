"use client";

import Image from "next/image";
import "./componentscss.css";
import { useUser } from "@auth0/nextjs-auth0";
import supabase from "../../lib/supabaseClient";
import { useState } from "react";

export default function StudentForm() {
    const [log,logset]=useState("");
    const { user, error: userError, isLoading } = useUser();
   
    const handleSubmit = async (e) => {

        if (!user) {
            console.error("User not logged in!");
            return;
        }

        const roll = e.target.roll.value.trim();
        const name = e.target.name.value.trim();
        const year = e.target.year.value;
        const branch = e.target.branch.value;

        try {
            const { data, error } = await supabase
                .from("userdata") // table name must match exactly
                .insert([
                    {
                        id: user.sub,
                        roll,
                        name,
                        year,
                        branch,
                    },
                ])
                .select();

            if (error) {
                // console.error("Insert error:", error);
                logset("user already exist");
            } else {
                
                logset("connecting to the server ✅");
                e.target.reset();
            }
        } catch (err) {
            // console.error("Unexpected error:", err);
            logset("Unexpected error:",err);
        }
    };

    if (isLoading) return <div>Loading user...</div>;
    if (userError) return <div>Error loading user: {userError.message}</div>;

    return (
        <div className="Datafrom">
            <Image
                src="/VVIT.png"
                alt="VVIT Logo"
                width={104}
                height={104}
            />

            <form className="student-form" onSubmit={handleSubmit}>
                <input type="text" name="roll" placeholder="Roll Number" required />
                <input type="text" name="name" placeholder="Student Name" required />

                <select name="year" required>
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                </select>

                <select name="branch" required>
                    <option value="">Select Branch</option>
                    <option value="CSE">CSE</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                    <option value="CIVIL">CIVIL</option>
                </select>

                <button type="submit">Submit</button>
            </form>
            <div className="loginfo">{log}</div>
        </div>
        
    );
}
