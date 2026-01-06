import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import Contact from './Contact'
import About from './About'
import Header from '../../components/Header' 
import Footer from '../../components/Footer' 
const Frontend = () => {
  return (
    <>
    
    <Header />
    <main>
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
    </Routes>
    </main>
    <Footer />
    </>
  )
}

export default Frontend