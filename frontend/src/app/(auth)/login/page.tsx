"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage(){
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try{
      const res = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      localStorage.setItem('token', data.token)
      router.push('/')
    }catch(err: any){
      setError(err.message || String(err))
    }
  }

  return (
    <div style={{ maxWidth: 420 }}>
      <h3>Login</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label>
          <input value={username} onChange={e=>setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
