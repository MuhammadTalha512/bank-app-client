 import React from 'react'
import {  useAuthContext } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

  const PrivateRoute = ({Component}) => {
    const {Authstate} = useAuthContext()
    const {isAuth} = Authstate
    if(!isAuth) return <Navigate to="/auth/login" />
    return (<Component />) 
  }

  export default PrivateRoute