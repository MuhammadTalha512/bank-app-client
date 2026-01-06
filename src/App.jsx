import React from 'react'
import '../node_modules/bootstrap/dist/js/bootstrap.bundle'
import './App.scss'
import Routes from './pages/Routes'
import ScreenLoader from './components/ScreenLoader'
import { useAuthContext } from './contexts/AuthContext'
function App() {
  const {isAppLoading} = useAuthContext()

  return (
    <>
    {
      isAppLoading
      ?<ScreenLoader />
      :<Routes />
    }
    </>
  )
}

export default App
