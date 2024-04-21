import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
import SearchBlog from './SearchBlog';
import Home from './Home';
import CreateBlog from './CreateBlog';
import { Navigate } from 'react-router-dom';
import Login from './Login'
import Signup from './Signup';


const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" replace />;
  };
  

function Dashboard() {
    return (
        <div>
            <Routes>

                <Route path="/create_blog" element={
                    <PrivateRoute>
                        <CreateBlog />
                    </PrivateRoute>
                } />


                <Route path='/' element={<Home />} />
                <Route path='/search' element={<SearchBlog />} />
                {/* <Route path='/create_blog' element={<CreateBlog />} /> */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

            </Routes>
        </div>
    );
}

export default Dashboard;
