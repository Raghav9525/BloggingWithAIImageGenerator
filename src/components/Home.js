import React, { useEffect, useState } from 'react';
import { myblogs } from '../constant';
import { SlLike } from "react-icons/sl";
import { useLocation } from 'react-router-dom';

function Home() {
    const apiUrl = process.env.REACT_APP_SERVER_URL;
    const [blogs, setBlogs] = useState([])

    const location = useLocation()
    const { sortedTitles } = location.state || {}


    // when page render ferch all blog from database
    useEffect(() => {
        async function fetchBlogTitles() {
            try {
                const response = await fetch(`${apiUrl}/fetch_blogs`, { // ensure endpoint is correct
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                });

                if (response.ok) {
                    console.log("hiiiiiiiiii")
                    const responseData = await response.json(); // Parse the JSON response body
                    console.log(responseData)
                    setBlogs(responseData); // Update the state with fetched titles

                } else {
                    // Handle errors according to your API's schema
                    throw new Error('Failed to fetch titles');
                }
            } catch (err) {
                console.error("Error occurred while fetching blog titles:", err);
            }
        }

        fetchBlogTitles(); // Call the async function
    }, [apiUrl]); // Dependency array to ensure useEffect runs only when apiUrl changes



    // display date in dd/mm/yyyy formate
    function formatDate(dateString) {
        const date = new Date(dateString); // Create a Date object from the ISO string
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' }; // Formatting options
        return date.toLocaleDateString('en-US', options); // Format the date in dd-mm-yyyy
    }


    return (
        <div className="container-fluid m-0 p-0" >
            {blogs.map((blog, index) => (
                <div className="row mb-2" key={index}>
                    <div className="col-sm-5 ">
                        <img className="d-block img-fluid me-4" src={blog.image_url} alt="room-img" style={{ width: "400px", height: "400px", float: "right", borderRadius: "25px" }} />
                    </div>
                    <div className="col-sm-6 ms-2 me-2 mt-2">
                        <div className="" style={{ border: "none" }}>
                            <h2>{blog.title}</h2>

                            {/* div for like and date details */}
                            <div className='d-flex '>
                                <p className="">Category: {blog.category}</p>

                                <p className="ms-2">Created on: {formatDate(blog.date)}</p>
                            </div>

                            <p>{blog.description}</p>
                            <button className="btn btn-primary btn btn-primary">Read More</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Home;
