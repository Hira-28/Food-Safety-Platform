import type { Metadata } from "next";
import Script from "next/script";
import { Fraunces, Inter } from "next/font/google";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Campus Eats — Student Food Safety Platform",
  description: "Find and review restaurants near your university, honestly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fraunces.variable} ${inter.variable} antialiased`}>
        <Script id="theme-init" strategy="beforeInteractive">
          {`try {
  var savedTheme = localStorage.getItem("campus-eats-theme");
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle("dark", savedTheme ? savedTheme === "dark" : prefersDark);
} catch (error) {
  console.error("Unable to initialize the saved color theme.", error);
}`}
        </Script>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}