import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

import { useUser } from "@auth0/nextjs-auth0/client";
async function retrieveData(folderName) {
  const { data, error } = await supabase
    .storage
    .from("root")
    .list(folderName);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export default function CallingFunction() {
 
  const [data, setData] = useState([]);
  const [path, setPath] = useState("");
    const { user, isLoading } = useUser();
  const [fileUrl, setFileUrl] = useState(null);
  useEffect(() => {
    setPath("");
  }, []);
  useEffect(() => {
    loadData(path);
  }, [path]);

  async function loadData(folderName) {
    const result = await retrieveData(folderName);
    setData(result);
  }

  function handleClick(item) {
    
   
    if (!item.metadata) {
      let newPath =path ? `${path}/${item.name}`:item.name;
     
      
      setPath(newPath);
      setFileUrl(null);
    }

   
    else {
      const filePath = path ? `${path}/${item.name}`:item.name;

      const { data } = supabase
        .storage
        .from("root")
        .getPublicUrl(filePath);

      setFileUrl(data.publicUrl);
    }
  }

  function goBack() {
    
    if(!path) return;
    let a=path.lastIndexOf("/");
   if(a===-1){
    setPath("");
   }else{
     setPath(path.substring(0, a));
   }
   setFileUrl(null);
  }

  return (
    <div className="file-containe">

      <div className="file-inne">

        <div className="path-bar">
          <button onClick={goBack}>⬅ Back</button>
          <span>{path}</span>
          
        </div>

        <div className="file-list">
          {data.map((item, index) => (
            <div
              key={index}
              className="file-row"
              onClick={() => handleClick(item)}
            >
              <span className="icon">
                {item.metadata ? "📄" : "📁"}
              </span>

              <span className="file-name">
                {item.name}
              </span>
            </div>
          ))}
        </div>

        {fileUrl && (
          <div className="preview">
            <h3>File Preview</h3>

            <iframe
              src={fileUrl}
              title="file preview"
              width="100%"
              height="500px"
            />

            <a href={fileUrl} target="_blank" rel="noreferrer">
              Open in new tab
            </a>
          </div>
        )}

      </div>

    </div>
  );
}