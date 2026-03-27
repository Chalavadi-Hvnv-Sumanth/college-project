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
      <head><link
  rel="apple-touch-icon"
  href="/VVIT.png"
  type="image/<generated>"
  sizes="<generated>"
/>
<meta name="google-site-verification" content="q-fgCC4xlwkadgO_7dblSqDph8vmrBhT_sBuP6M0VmY" />
</head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
