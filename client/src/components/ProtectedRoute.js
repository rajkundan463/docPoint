import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute(props) {
    if (localStorage.getItem('token')) {
        return props.children; // token matches or found, stay on home with logged in user
    } else {
        return <Navigate to="/login" />; // goes public route if token not found
    }
}

export default ProtectedRoute;
