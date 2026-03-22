
import Link from "next/link";
import "./mainpage.css";
import { auth0 } from "@/lib/auth0";
import React from "react";
import supabase from "../lib/supabaseClient";
import StudentForm from "@/app/components/StudentForm";
import Main from "@/app/components/Main.page";

export default async function Home() {
    const session = await auth0.getSession();
    const user = session?.user;
    
   
    if (!user) {
        return (
            <div className="page-background">
                <div id="topbar">
                    <h1>VVITU REPOSITORY</h1>
                    <a href="/auth/login?returnTo=/" className="pink-orange-btn">
                        Log In
                    </a>
                </div>
            </div>
        );
    }

    // Check if user exists in userdata table
    const checkUserIdExists = async (auth0Id) => {
        const { data, error } = await supabase
            .from("userdata")
            .select("id")
            .eq("id", auth0Id)
            .maybeSingle();;

        if (error && error.code !== "PGRST116") {
            console.error("Error checking ID:", error);
            return false;
        }

        return !!data;
    };

    const userExists = await checkUserIdExists(user.sub);

    // Show Main if user exists, otherwise show StudentForm
    return <>{userExists ? <Main />:<StudentForm /> }</>;
}
