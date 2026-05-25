"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Target } from "lucide-react";
import { motion } from "motion/react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && password.trim()) {
      // Allow any ID/Pass per requirements ("make simple login page id and passs thats it")
      router.push("/dashboard");
    } else {
      setError("Please enter username and password.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white selection:bg-indigo-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-gray-950 to-gray-950 -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-medium tracking-tight">SmartRetail AI</h1>
          <p className="text-gray-400 mt-2 text-sm">Predictive Retail Analytics Platform</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-400 px-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-950/50 border border-gray-800 text-white rounded-xl px-10 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
                placeholder="admin"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-400 px-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-950/50 border border-gray-800 text-white rounded-xl px-10 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all placeholder:text-gray-600"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl py-3 mt-4 transition-colors shadow-lg shadow-indigo-600/20"
          >
            Access Dashboard
          </button>
        </form>
        
        <p className="text-center text-xs text-gray-500 mt-8">
          Demo Access: Any ID/Password will work.
        </p>
      </motion.div>
    </div>
  );
}
