import Link from "next/link";
import "./mainpage.css";
import { auth0 } from "@/lib/auth0";
import {DownloadButton, UploadPage} from "@/app/upload/page";
export default  async function Home() {
    const session = await auth0.getSession();
    const user = session?.user;
        return (
            <>
                {user ?(
                    <>
                        <p>Welcome to the page of vvitu</p>

                        <a href="/auth/logout" className="button logout">
                            Log Out
                        </a>

                        <UploadPage />

                        <DownloadButton fileName="afrikaans_church_interior_1k.exr" />

                    </>

                ):(
                    <>

                        <div className="page-background">
                            <div id="topbar">
                               <h1>VVITU REPOSITORY</h1>
                                <Link href="/auth/login?returnTo=/" className="pink-orange-btn">
                                    Log In
                                </Link>
                            </div>
                        </div>
                    </>


                )}

            </>

        );

}
