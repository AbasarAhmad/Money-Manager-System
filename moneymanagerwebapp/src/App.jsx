import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home';
import Income from './pages/Income';
import Expense from './pages/Expense';
import Category from './pages/Category';
import Filter from './pages/Filter';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { ToastContainer } from "react-toastify";

const App = () => {
  return (
    <>
      {/* Toastify container */}
      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>
        
        <Route path='/' element={<Root />} />
        <Route path='/dashboard' element={<Home/>} />
        <Route path='/income' element={<Income/>} />
        <Route path='/expense' element={<Expense/>} />
        <Route path='/category' element={<Category/>} />
        <Route path='/filter' element={<Filter/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/signup' element={<Signup/>} />
      </Routes>
    </>
  );
};

const Root=()=>{
  const isAuthenticated=!!localStorage.getItem("token");
  return isAuthenticated ? (
    <Navigate to ="/dashboard" />
  ):
  ( 
    <Navigate to ="/login" />
  )
}
export default App;
