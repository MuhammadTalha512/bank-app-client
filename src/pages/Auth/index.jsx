import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from './Register'
import Login from './Login'

const Auth = () => {
  return (
    <Routes>
        <Route path='register' element={<Register />} />
        <Route path='login' element={<Login />} />
    </Routes>
  )
}

export default Auth