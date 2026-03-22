"use client"

import Download from './Download'
import './projects.css'
import Upload from './upload'
import { useState } from 'react'
import Image from "next/image";
import Delete from './Delete'
export  default  function Projects(){
const [index, setIndex] = useState(0);
     
    return(
        <>
          <div className="featurescontainer">
            <div className="nav-icon">
             <div
                                    className={`nav-ite ${index === 0 ? "active" : ""}`}
                                    onClick={() => setIndex(0)}
                                >
                                    <Image src="/description.gif" alt="" width={22} height={22} />
                                    <span>Projects</span>
                                </div>
                                  <div
                                    className={`nav-ite ${index === 1 ? "active" : ""}`}
                                    onClick={() => setIndex(1)}
                                >
                                    <Image src="/download1.gif" alt="" width={22} height={22} />
                                    <span>Download</span>
                                </div>
                                  <div
                                    className={`nav-ite ${index === 2 ? "active" : ""}`}
                                    onClick={() => setIndex(2)}
                                >
                                    <Image src="/bin.gif" alt="" width={22} height={22} />
                                    <span>Delete</span>
                                </div>
                                </div>
                                
                                            {index === 0 && <Upload />}
                                            {index === 1 && <Download />}
                                            {index === 2 && <Delete />}
          </div>
        </>
    )
}
