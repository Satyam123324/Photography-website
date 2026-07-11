import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'))

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    setUser(data)
    localStorage.setItem('user', JSON.stringify(data))
    return data
  }

  const register = async (name, email, password, phone, role) => {
    const { data } = await api.post('/auth/register', { name, email, password, phone, role })
    setUser(data)
    localStorage.setItem('user', JSON.stringify(data))
    return data
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
