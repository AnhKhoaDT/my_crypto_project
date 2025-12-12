"use client"
import React, { useEffect, useState } from 'react'

type User = { id: number; username: string; created_at: string }

export default function ProfilePage(){
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(()=>{
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) return setError('Not logged in')
    fetch('http://localhost:4000/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r=>r.json()).then(data=>{
      if (data.error) setError(data.error)
      else setUser(data.user)
    }).catch(err=>setError(err.message))
  }, [])

  if (error) return <div style={{ color: 'red' }}>{error}</div>
  if (!user) return <div>Loading...</div>
  return (
    <div>
      <h3>Profile</h3>
      <p>Username: {user.username}</p>
      <p>Joined: {new Date(user.created_at).toLocaleString()}</p>
    </div>
  )
}
