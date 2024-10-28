"use client";
import React, { useState, useEffect } from "react";
import localFont from "next/font/local";
import "./globals.css";
import { v4 as uuidv4 } from "uuid";
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

interface AuthToken {
  token: string;
  expiry: number;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showWidget, setShowWidget] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const checkAuthStatus = () => {
    const authData = localStorage.getItem("auth_token");
    if (authData) {
      const { token, expiry }: AuthToken = JSON.parse(authData);
      if (expiry > Date.now()) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("auth_token");
        setIsAuthenticated(false);
      }
    }
  };

  const handleLogin = () => {
    const token: AuthToken = {
      token: uuidv4(),
      expiry: Date.now() + 15 * 60 * 1000, // 15 minutes from now
    };
    localStorage.setItem("auth_token", JSON.stringify(token));
    setIsAuthenticated(true);
  };

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
                className="fixed bottom-20 md:bottom-5 right-2 md:right-5 w-12 h-12 md:w-16 md:h-16 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 flex items-center justify-center z-50"
              >
                <Image
                  src="/avoca_ai_logo.jpeg"
                  alt="Chat Widget"
                  width={36}
                  height={36}
                  className="rounded-full md:w-12 md:h-12"
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
            onLogin={handleLogin}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        )}
      </body>
      <Toaster position="bottom-right" richColors expand={true} />
    </html>
  );
}
