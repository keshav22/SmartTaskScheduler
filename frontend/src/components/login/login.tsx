"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthForm(){
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setError("");
    };

    const handleSubmit = async(e : React.FormEvent) => {
        e.preventDefault();
        setError("");

        const url = isLogin? "http://localhost:8000/auth/login" : "http://localhost:8000/auth/signup";

        try{
            const res = await fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password}),
            });

            const data = await res.json();

            if (res.ok){
                if (isLogin){
                    router.push("/focus");
                    router.refresh();
                }
                else{
                    alert("Account created! Please log in.");
                    setIsLogin(true);
                    resetForm();
                }
            }
            else{
                setError(data.detail || "Authentication failed");
            }
        }
        catch(err){
            setError("Cannot connect to backend server.");
        }
    };
    return (
        <div className="p-8 border rounded-lg shadow-lg max-w-md mx-auto mt-20">
            <h2 className="text-xl font-bold mb-4">{isLogin ? "Login" : "Sign Up"}</h2>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-2 border rounded" required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="p-2 border rounded" required />
                <button type="submit" className="bg-blue-600 text-white p-2 rounded">
                    {isLogin ? "Sign In" : "Register"}
                </button>
            </form>
            <button onClick={() => { setIsLogin(!isLogin); resetForm(); }} className="mt-4 text-sm text-blue-500 hover:underline">
                {isLogin ? "Don't have an account? Sign up" : "Have an account? Log in"}
            </button>
        </div>
    );
}
// import React, { use, useState } from "react";

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


