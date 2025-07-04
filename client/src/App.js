import React from 'react';
// import 'antd/dist/reset.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home'; // Assuming you have a Home component
import { Toaster } from 'react-hot-toast'; // for success and error messages
import { useSelector } from 'react-redux'; // for accessing the Redux store
import PublicRoute from './components/PublicRoute';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { loading } = useSelector((state) => state.alerts);
  
  return (
    <div>
      <BrowserRouter>
       
      {loading && (<div className="Spinner-parent"> <span className="loader" role="status"></span></div>)}
          
        <Toaster position="top-center" reverseOrder={false} />
          <Routes>
          <Route path='/login' element={<PublicRoute><Login/></PublicRoute>} />
          <Route path='/register' element={<PublicRoute><Register/></PublicRoute>} />
          <Route path='/home' element={<ProtectedRoute><Home/></ProtectedRoute>} />

        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
