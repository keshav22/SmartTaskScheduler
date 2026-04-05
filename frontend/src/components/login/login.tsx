"use client"

// import React, { use, useState } from "react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

// export default function LoginForm(){
//     const [email, setEmail] = useState("");

//     const handleLogin = async(e: React.FormEvent) => {
//         e.preventDefault();
//         // API call logic
//         console.log("Logging in with:", email);
//     };

//     return (
//         <div className="flex flex-col gap-4 p-8 border rounded-lg shadow-sm">
//             <h1 className="text-2xl font-bold">FocusFlow</h1>
//             <form onSubmit={handleLogin} className="flex flex-col gap-2">
//                 <input
//                     type="email"
//                     placeholder="Email"
//                     className="p-2 border rounded"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <button type="submit" className="bg-blue-500 text-white p-2 rounded">
//                     Sign In
//                 </button>
//             </form>
//         </div>
//     );
// }

export default function AuthForm(){
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const url = isLogin? "http://localhost:8000/auth/login" : "http://localhost:8000/auth/signup";
        
        // send the data to internal API route
        // const endpoint = isLogin? "/api/login" : "/api/signup";

        try {
            const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                if (isLogin) {
                    // --- FUTURE CHANGE: Change '/focus' to '/dashboard' here later ---
                    router.push("/focus"); 
                    router.refresh();
                } 
                else {
                    // If they just signed up, flip the UI to Login mode
                    alert("Signup successful! Please log in.");
                    setIsLogin(true);
                }
            } 
            else {
                setError(data.detail || "Auth failed");
            }
        } 
        catch (err) {
            setError("Could not connect to the server.");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded-xl shadow-md bg-white">
            <h2 className="text-2xl font-bold mb-4">{isLogin? "Login" : "Create Account"}</h2>
            {error && <p className="text-red-500 mb-4 text-sm font-medium"> ⚠️ {error} </p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="email"
                    placeholder="Email"
                    className="p-2 border rounded"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="p-2 border rounded"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="bg-black text-white p-2 rounded hover:bg-gray-800 transition">
                    {isLogin ? "Sign In" : "Sign Up"}
                </button>
            </form>
            <button
                onClick={() => setIsLogin(!isLogin)}
                className="mt-4 text-blue-600 text-sm hover:underline w-full text-center">
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
        </div>
    );
}
