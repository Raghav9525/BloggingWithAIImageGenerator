import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaSearch } from "react-icons/fa";
import { FaMicrophone } from "react-icons/fa6";

function Navbar() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [searchTitle, setSearchTitle] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    const closeMenu = () => {
        setIsNavOpen(false);
    };

    async function startSpeechRecognition() {
        return new Promise((resolve, reject) => {
            // Check if browser supports SpeechRecognition
            if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {

                let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                let recognition = new SpeechRecognition();

                // Set recognition parameters
                recognition.continuous = false; // Stop listening after first speech input
                recognition.lang = 'en-US'; // Set language

                // Define event handlers
                recognition.onresult = function (event) {

                    let transcriptResult = event.results[0][0].transcript;
                    console.log('You said: ' + transcriptResult);
                    resolve(transcriptResult); // Reso
                };

                recognition.onerror = function (event) {
                    console.error('Speech recognition error:', event.error);
                    reject(event.error); // Reject the promise with error
                };

                recognition.start();
            } else {
                reject(new Error('Speech recognition not supported'));
            }
        });
    }
    const voiceInput = async (e) => {
        e.preventDefault();

        try {
            const utterance = new SpeechSynthesisUtterance("");
            window.speechSynthesis.speak(utterance);

            // const transcriptResult = 'Cricket Rules That ICC';

            const transcriptResult = await startSpeechRecognition();
            console.log(transcriptResult)


            navigate('/search', { state: { searchTitle: transcriptResult } });

        } catch (error) {
            console.error('Error with speech recognition:', error);
        }

    };


    const handleInput = (e) => {
        setSearchTitle(e.target.value);
    };

    function searchBlog(e) {
        e.preventDefault()
        navigate('/search', { state: { searchTitle: searchTitle } });
    }


    const navItem = {
        fontWeight: "600",
        fontSize: "20px",
    }

    return (
        <>
            <nav className='navbar navbar-expand-lg navbar-light' >
                <div className='container-fluid m-0 p-0'>
                    {/* logo */}
                    <div className='col-sm-3 d-none d-sm-flex mt-2 justify-content-center align-items-center'>
                        <Link className="navbar-brand" to="/">
                            <p style={{ color: "black", fontWeight: "600" }}>LET'S CREATE BLOG</p>
                        </Link>
                    </div>


                    {/* search bar  */}
                    <div className="d-flex justify-content-center align-items-center col-sm-4 ms-2 ms-4">
                        <form action="" style={{ display: 'flex', alignItems: 'center' }}>
                            <div className="form-wrapper" style={{ position: 'relative', flex: '1' }}>
                                <input
                                    type="text"
                                    name="title"
                                    className="form-control"
                                    onChange={handleInput}
                                    value={searchTitle}
                                    placeholder="Search Title..."
                                    style={{ paddingRight: '30px',width:"350px" }}
                                />
                                <button style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    cursor: 'pointer',
                                    border: 'none',
                                    fontSize: "19px"
                                }}
                                    onClick={voiceInput}
                                >
                                    <FaMicrophone /> {/* Remove border */}
                                </button>
                            </div>
                            <button className="btn btn-outline-success ms-2" type="submit" onClick={searchBlog}><FaSearch /></button>
                        </form>
                    </div>


                    {/* hamburger button */}
                    <button className='navbar-toggler' type="button" onClick={toggleNav}>
                        <span className='navbar-toggler-icon'></span>
                    </button>

                    {/* Navbar items or menu items */}
                    <div className={"col-sm-5 collapse navbar-collapse " + (isNavOpen ? " show" : "")} id="navbarNav">
                        <ul className='navbar-nav w-100 my-2 my-lg-0 navbar-nav-scroll justify-content-center'>
                            <li className='nav-item'>
                                <Link to='/' className='nav-link' id="nav-link1" onClick={closeMenu} style={navItem}>Home</Link>
                            </li>
                            <li className='nav-item ms-4'>
                                <Link to='/create_blog' className='nav-link' id="nav-link1" onClick={closeMenu} style={navItem}>Create Blog</Link>
                            </li>
                            <li className='nav-item ms-4'>
                                <Link to='/login' className='nav-link' id="nav-link1" onClick={closeMenu} style={navItem}>Login</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
