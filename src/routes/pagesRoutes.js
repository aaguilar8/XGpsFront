import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import MainPage from '../components/MainPage'

const PagesRoutes = () => {
  return (
    <div className='container'>
        <Routes>
            <Route path='main' element={<MainPage/>}/>
            <Route path='/' element={ <Navigate to='/'/> }/>
        </Routes>
    </div>
  )
}

export default MainPage;