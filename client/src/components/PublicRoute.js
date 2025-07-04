import React from 'react';
import { Navigate } from 'react-router-dom';

function PublicRoute(props) {
    if (!localStorage.getItem('token')) {
        return props.children; // no login data (token exists), render the children components->log in page
    } else {
        return <Navigate to="/home" />; // No need logged in, directly open home page
    }
}

export default PublicRoute;
