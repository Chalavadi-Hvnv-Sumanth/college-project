"use client";
import Image from "next/image";
import './componentscss.css';
export default function Dashboard() {
    return (
        <>
            <div className="header">
                <Image
                    src="https://www.vvitu.ac.in/src/assets/images/VVIT_logo.png"
                    alt="VVIT Logo"
                    width={65}
                    height={65}
                    className="collegeimg"
                />
                <input
                    type="text"
                    placeholder="Search..."
                    className="search-bar"
                />


            </div>
            <div className="line"></div>
        </>
    );
}

