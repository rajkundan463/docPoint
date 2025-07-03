
import React from 'react';
// import 'antd/dist/reset.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home'; // Assuming you have a Home component
import { Toaster } from 'react-hot-toast'; // for success and error messages

function App() {
  return (
    <div >
      <BrowserRouter>
        <Toaster position="top-center" reverseOrder={false} />
          <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/home' element={<Home/>} />

        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
