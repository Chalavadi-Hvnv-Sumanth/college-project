import { auth0 } from "@/lib/auth0";
import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import Profile from "@/components/Profile";

export default async function Home() {
    const session = await auth0.getSession();
    const user = session?.user;

    return (
        <div className="min-h-screen bg-[#f6f8fa] text-[#24292f]">

            {/* Top Navigation Bar */}
            <header className="bg-[#24292f] text-white px-8 py-3 flex justify-between items-center">
                <h1 className="text-lg font-semibold">
                    VVITU College Repository
                </h1>

                <div>
                    {user ? <LogoutButton /> : <LoginButton />}
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-5xl mx-auto px-6 mt-10">

                {/* Welcome Section */}
                <div className="bg-white border border-[#d0d7de] rounded-md p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-2">
                        Welcome to the Repository
                    </h2>
                    <p className="text-sm text-gray-600">
                        A secure academic repository for VVITU students and faculty.
                        Access resources, manage profiles, and collaborate efficiently.
                    </p>
                </div>

                {/* Auth / Profile Section */}
                {user ? (
                    <div className="bg-white border border-[#d0d7de] rounded-md p-6">
                        <p className="text-sm text-green-700 mb-4">
                            ✅ Logged in successfully
                        </p>
                        <Profile />
                    </div>
                ) : (
                    <div className="bg-white border border-[#d0d7de] rounded-md p-6">
                        <p className="text-sm text-gray-700 mb-4">
                            Please sign in to access the college repository.
                        </p>
                        <LoginButton />
                    </div>
                )}

            </main>

            {/* Footer */}
            <footer className="text-center text-xs text-gray-500 mt-16 pb-6">
                © {new Date().getFullYear()} VVITU College Repository
            </footer>
        </div>
    );
}
