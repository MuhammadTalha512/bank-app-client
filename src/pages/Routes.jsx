import React, { Component } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Frontend from './Frontend'
import Auth from './Auth'
import Dashboard from './Dashboard'
import { useAuthContext } from '../contexts/AuthContext'
import PrivateRoute from './PrivateRoute'
const Index = () => {
  const {Authstate} = useAuthContext()
  const {isAuth} = Authstate
  return (
    <Routes>
    <Route path='/*' element={<PrivateRoute Component={Frontend} />} />
    <Route path='/auth/*' element={!isAuth ? <Auth /> :<Navigate  to="/dashboard" />} />
    <Route path='/dashboard/*' element={<PrivateRoute Component={Dashboard} />} />
    </Routes>
  )
}

export default Index