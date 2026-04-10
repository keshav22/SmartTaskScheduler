'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const url = isLogin
      ? 'http://localhost:8000/auth/login'
      : 'http://localhost:8000/auth/signup'

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })

      const data = await res.json()

      if (res.ok) {
        if (isLogin) {
          router.replace('/tasks')
        } else {
          alert('Account created! Please log in.')
          setIsLogin(true)
          resetForm()
        }
      } else {
        setError(data.detail || 'Authentication failed')
      }
    } catch (err) {
      setError('Cannot connect to backend server.')
    }
  }

  return (
    <div className="flex flex-col items-center mt-20">
      <h1 className="text-4xl font-extrabold text-[#25F4F4] mb-8">FocusFlow</h1>

      <div className="p-8 border rounded-lg shadow-lg max-w-md mx-auto">
        <h2 className="text-xl font-bold text-center mb-4 text-[#25F4F4]">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded text-black"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded text-black"
            required
          />
          <button
            type="submit"
            className="bg-[#25F4F4] text-white p-2 rounded "
          >
            {isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>
        <button
          onClick={() => {
            setIsLogin(!isLogin)
            resetForm()
          }}
          className="mt-4 text-sm text-center mb-4 text-[#25F4F4] hover:underline"
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : 'Have an account? Log in'}
        </button>
      </div>
    </div>
  )
}
