"use client"
import './componentscss.css';
import { useUser } from "@auth0/nextjs-auth0";
import Image from 'next/image';
import Dashboard from './Dashboard'
import Userprofile from './Userprofile'
import { useState } from 'react'
export default function Main(){
    const { user, isLoading } = useUser();
    const [toggle, setToggle] = useState(false)
    if (isLoading) {
        return (
            <div className="loading-state">
                <div className="loading-text">Loading user profile...</div>
            </div>
        );
    }

    if (!user) return null;

    return(
        <>
            {/*<Image*/}
            {/*    src={user.picture}*/}
            {/*    alt={user.name}*/}
            {/*    width={40}*/}
            {/*    height={40}*/}
            {/*    className="authtimg"*/}
            {/*    onClick={()=>setToggle(prev => !prev)}*/}
            {/*/>*/}
            {toggle ? <Dashboard />:<Userprofile />}
        </>
    )
}
