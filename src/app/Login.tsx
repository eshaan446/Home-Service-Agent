"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Lock, Moon, Sun } from "lucide-react";
import { toast } from "sonner";

interface LoginProps {
  onLogin: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Login({
  onLogin,
  isDarkMode,
  toggleDarkMode,
}: LoginProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const loginPassword = process.env.NEXT_PUBLIC_LOGIN_PASSWORD;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === loginPassword) {
      onLogin();
      toast.success("Login successful!", {
        position: "bottom-right",
        duration: 2000,
      });
    } else {
      setError("Incorrect password. Please try again.");
      toast.error("Incorrect password. Please try again.", {
        position: "bottom-right",
        duration: 2000,
      });
    }
  };

  return (
    <div
      className={`flex items-center justify-center h-screen ${isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-500 to-purple-600"
        }`}
    >
      <div className="absolute top-5 right-5">
        <button
          onClick={toggleDarkMode}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isDarkMode
              ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-80">
        <div className="flex justify-center mb-6">
          <Image
            src="/avoca_ai_logo.jpeg"
            alt="Logo"
            width={80}
            height={80}
            className="rounded-full"
          />
        </div>
        <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-gray-200">
          Welcome Back
        </h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 dark:text-gray-300 mb-2"
            >
              Enter Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 dark:text-gray-200"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
              />
              <Lock
                size={20}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-semibold transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
