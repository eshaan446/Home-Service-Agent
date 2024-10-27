"use client";
import React, { useState, useEffect } from "react";
import localFont from "next/font/local";
import "./globals.css";

import ChatWidget from "./ChatWidget";
import Login from "./Login";
import Image from "next/image";
import { Toaster } from "sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showWidget, setShowWidget] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}
      >
        {isAuthenticated ? (
          <>
            {children}

            {!showWidget && (
              <button
                onClick={() => setShowWidget(true)}
                className="fixed bottom-5 right-5 w-16 h-16 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 flex items-center justify-center"
              >
                <Image
                  src="/avoca_ai_logo.jpeg"
                  alt="Chat Widget"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              </button>
            )}

            {showWidget && (
              <ChatWidget
                isDarkMode={true}
                onClose={() => setShowWidget(false)}
              />
            )}
          </>
        ) : (
          <Login
            onLogin={() => setIsAuthenticated(true)}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        )}
      </body>

      <Toaster position="bottom-right" richColors expand={true} />
    </html>
  );
}
