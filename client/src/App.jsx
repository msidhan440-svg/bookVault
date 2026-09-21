import React,{useState} from 'react'
import axios from 'axios'
import Form from './pages/Form'
import Tabel from './pages/Table'
import Registeration from './pages/Register'
import TopList from './pages/Top-List'
import Home from './pages/Home'
import Signup from './pages/Sigup'
import Login from './pages/Login'
import {BrowserRouter as Router ,Routes,Route} from 'react-router-dom'


function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<Form />} />
          <Route path="/tabel" element={<Tabel />} />
          <Route path="/register/:id" element={<Registeration />} />
          <Route path="/topList" element={<TopList />} />
          <Route path='/signup' element={<Signup/>} ></Route>
          <Route path='/login' element={<Login></Login>}></Route>
        </Routes>
      </Router>
    </div>
  );
}
      
export default App

