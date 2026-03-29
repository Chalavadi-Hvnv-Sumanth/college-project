"use client"
import './componentscss.css'
import Link from "next/link";
import React, { useState } from "react";
import Account from './Account'
import Image from "next/image";
import Upload from "../upload/page";
import Projects from "../projects/Projects";
import User from "../home/Projects";
import Verified from '../verified/Verified';
export default function Userprofile() {

    const [index, setIndex] = useState(-1); 

    return (
        <>
        <Image
                      className="imgh"
                        src="/VVIT.png"
                        alt="VVIT Logo"
                        width={50}
                        height={50}
                    />
            <div className="navbar">

                <div className="logo-section">
                    <Image   
                    className="imgh1"        
                        src="/VVIT.png"
                        alt="VVIT Logo"
                        width={50}
                        height={50}
                    />
                    <span className="logo-text">VVITU Repository</span>
                </div>

                
                {/* {index === -1 && (
                    <input
                        type="text"
                        placeholder="Search..."
                        className="search-bar"
                    />
                )} */}

                <div className="nav-icons">

                    <div
                        className={`nav-item ${index === -1 ? "active" : ""}`}
                        onClick={() => setIndex(-1)}
                    >
                        <Image  src="/Home.gif" alt="" className="nav-img" width={32} height={32}  />
                        <span>Home</span>
                    </div> 

                    <div
                        className={`nav-item ${index === 0 ? "active" : ""}`}
                        onClick={() => setIndex(0)}
                    >
                        <Image src="/projects.gif" alt="" className="nav-img" width={32} height={32} />
                        <span>Projects</span>
                    </div>
                    
                     <div
                        className={`nav-item ${index === 1 ? "active" : ""}`}
                        onClick={() => setIndex(1)}
                    >
                        <Image src="/loadtick.gif" alt="" className="nav-img" width={32} height={32} />
                        <span>verified Projects</span>
                    </div>



                    <div
                        className={`nav-item ${index === 2 ? "active" : ""}`}
                        onClick={() => setIndex(2)}
                    >
                        <Image src="/upload.gif" alt="" className="nav-img" width={34} height={34} />
                        <span>Upload</span>
                    </div>

                    <div
                        className={`nav-item ${index === 3 ? "active" : ""}`}
                        onClick={() => setIndex(3)}
                    >
                        <Image src="/useraccount.gif" alt="" className="nav-img" width={30} height={30} />
                        <span>Details</span>
                    </div>

                    <div className="nav-item logout">
                        <a href="/auth/logout">
                       
                            <Image src="/userlogout1.gif" alt="" className="nav-img" width={30} height={30} />
                        </a>
                        <span>Logout</span>
                    </div>

                </div>
            </div>

            <div className="line2"></div>

            {/* 🔥 Page Rendering */}
            {index === -1 && <User />}
            {index === 0 && <Projects />}
            {index === 1 && <Verified />}
            {index === 2 && <Upload />}
            {index === 3 && <Account />}
        </>
    )
}