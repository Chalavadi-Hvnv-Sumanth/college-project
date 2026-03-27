import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "VVITU Repository",
  description: "The VVIT Repository website is a web-based platform designed to provide students with easy access to academic resources, project materials, and useful information related to their college studies. It acts as a centralized hub where users can explore, organize, and retrieve content efficiently.",
  icons: {
    icon: [
      { url: "https://www.vvitu.ac.in/src/assets/images/VVIT_logo.pn" }
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
<meta name="google-site-verification" content="q-fgCC4xlwkadgO_7dblSqDph8vmrBhT_sBuP6M0VmY" />
<meta name="title" content="VVITU Repository" />
<meta name="description" content="Access academic resources, notes, and project materials easily." />
<meta property="og:title" content="VVITU Repository" />
<meta property="og:description" content="A platform for students to access academic resources." />
<meta property="og:url" content="https://vviturepository.vercel.app" />
<link rel="icon" type="image/png" href="/VVIT.png" />
<link rel="apple-touch-icon" href="/VVIT.png" />
<link rel="shortcut icon" href="/VVIT.png" />
<meta property="og:image" content="https://vviturepository.vercel.app/VVIT.png" />
</head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
