"use client"

import React, { use, useState } from "react";

export default function LoginForm(){
    const [email, setEmail] = useState("");

    const handleLogin = async(e: React.FormEvent) => {
        e.preventDefault();
        // API call logic
        console.log("Logging in with:", email);
    };

    return (
        <div className="flex flex-col gap-4 p-8 border rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold">FocusFlow</h1>
            <form onSubmit={handleLogin} className="flex flex-col gap-2">
                <input
                    type="email"
                    placeholder="Email"
                    className="p-2 border rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Sign In
                </button>
            </form>
        </div>
    );
}

