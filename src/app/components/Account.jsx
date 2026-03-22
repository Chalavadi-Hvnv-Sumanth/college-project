"use client";

import "./componentscss.css";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";
import Image from "next/image";
import AccountEdit from "./AccountEdit";

export default function Accounthelper() {
  const { user, isLoading } = useUser();
  const [data, setData] = useState(null);
   const [showForm, setShowForm] = useState(false); 
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      const { data, error } = await supabase
        .from("userdata")
        .select("name, roll, year, branch") 
        .eq("id", user.sub)
        .maybeSingle();

      if (error) {
        console.error("Supabase error:", error);
      } else {
        setData(data);
      }
    };

    fetchData();
  }, [user]);

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;
  if (!data) return <div>Loading profile...</div>;
  
  return (
    <div className="AccountRoot">
    {!showForm &&<> <Image
        src={user.picture}
        alt={user.name}
        width={80}
        height={80}
        className="Accountpicture"
      />
       <div  className="edit" onClick={()=>setShowForm(true)}> <Image src="/pencil4.gif" alt="" width={42} height={42} /></div>
      </> }
     
      {showForm ? (<><div className="closebutton" onClick={()=>setShowForm(false)}> <Image src="/close5.gif" alt="" width={52} height={52} /></div> <AccountEdit /> </>):
     
      (<div className="AccountDetails">
        <p className="AccountDetailsChild">Name -: {data.name || user.name}</p>
        <p className="AccountDetailsChild">Gmail -: {user.email}</p>
        <p className="AccountDetailsChild">Rollnumber -: {data.roll}</p>
        <p className="AccountDetailsChild">Branch -: {data.branch}</p>
        <p className="AccountDetailsChild">Year -: {data.year}</p>
      </div>)
    }
    </div>
  );
}