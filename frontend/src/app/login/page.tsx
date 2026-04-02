"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    console.log("Login clicked", email, password);
    // will connect to supabase later
  };

  const handleSignup = async () => {
    console.log("Signup clicked", email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-6 border rounded-lg space-y-4 w-80">
        <h1 className="text-xl font-bold">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Login
        </button>

        <button
          onClick={handleSignup}
          className="w-full border p-2 rounded"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}