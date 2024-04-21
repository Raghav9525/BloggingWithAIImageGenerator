import React from 'react'
import { BrowserRouter } from 'react-router-dom';

import CreateBlog from './components/CreateBlog'

import SearchBlog from './components/SearchBlog';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';
import { createGlobalStyle } from 'styled-components';


function App() {
  const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap');

  body, button, input, textarea {
      font-family: 'Roboto', sans-serif;
  }
`;

  return (
    <div className="App">
      <GlobalStyle />

      <BrowserRouter>

        <Navbar />
        <Dashboard />
        {/* <Home /> */}
        {/* <SearchBlog /> */}
        {/* <CreateBlog /> */}


        {/* <CreateBlog /> */}
        <Footer />
      </BrowserRouter>


    </div>
  );
}

export default App;
