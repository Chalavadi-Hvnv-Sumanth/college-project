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
  description: "",
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
/></head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
