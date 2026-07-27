import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('pcUser') || 'null'))

  const save = (data) => { setUser(data); localStorage.setItem('pcUser', JSON.stringify(data)) }

  const login = async (email, password) => { const { data } = await api.post('/auth/login', { email, password }); save(data); return data }
  const register = async (form) => { const { data } = await api.post('/auth/register', form); save(data); return data }
  const logout = () => { setUser(null); localStorage.removeItem('pcUser') }
  const updateUser = (updates) => { const updated = { ...user, ...updates }; save(updated) }

  return <AuthContext.Provider value={{ user, login, register, logout, updateUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
