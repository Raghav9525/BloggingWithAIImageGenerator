
import React, { useEffect, useState } from 'react';


function CreateBlog() {
    const apiUrl = process.env.REACT_APP_SERVER_URL;
    const [blog, setBlog] = useState({
        title: "",
        category: "",
        description: "",
    });

    const [message, setMessage] = useState("");
    const [imageUrl, setImageUrl] = useState('');



    async function storeBlog(e) {
        e.preventDefault();

        try {
            const response = await fetch(`${apiUrl}/generate_image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(blog)
            });

            if (response.ok) {
                console.log("hiiiiiiiii")
                const response1 = await response.json(); // <-- Here is the issue
                console.log("response")
                console.log(response1)
                setImageUrl(response1.url); // Set the imageUrl received from the server
                console.log("response.url")
                console.log(response1.url)
                setMessage('Image generated successfully.');
            } else {
                setMessage('Error: Image not generated');
            }
        } catch (err) {
            console.error('Error occurred while sending request:', err);
            setMessage('Error occurred while sending request');
        }
    }

    useEffect(() => {
        console.log("imageurl")
        console.log(imageUrl)
    }, [imageUrl])


    const inputFocused = {
        border: "2px solid #555"
    }

    return (
        <div className="" style={{ fontFamily: 'Roboto, sans-serif', backgroundColor: '#F0F4F7' }}>
            {/* <div className="container "> */}
                <div className="row justify-content-center">
                    <div className="col-md-8">

                        <div className="mt-4" style={{backgroundColor:"white",borderRadius: "20px"}}>
                            <h3 className='text-center mb-2 pt-2'>Create Blog</h3>
                            <hr />
                            <div className="ms-4 me-4" >
                                <form action="">
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label htmlFor="categoryTitle" className="form-label">Blog Title</label>
                                            <input
                                                type="text"
                                                className="form-control input-bold"
                                                name="title"
                                                onChange={(e) => setBlog({ ...blog, title: e.target.value })}
                                                value={blog.title}
                                                style={inputFocused}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="categoryImage" className="form-label">Blog Category</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="category"
                                                onChange={(e) => setBlog({ ...blog, category: e.target.value })}
                                                value={blog.category}
                                                style={inputFocused}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="categoryDescription" className="form-label">Blog Description</label>
                                        <textarea className="form-control"
                                            rows="5"
                                            name="description"
                                            onChange={(e) => setBlog({ ...blog, description: e.target.value })}
                                            value={blog.description}
                                            style={inputFocused}
                                        ></textarea>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-sm-7">
                                            {imageUrl == '' ? (
                                                <img className="img-fluid" src={require('../img/imageGenerate1.png')} alt="" style={{ maxHeight: "400px", width: "400px" }} />
                                            ) : (
                                                <img className="img-fluid" src={imageUrl} alt="" style={{ maxHeight: "400px", width: "400px" }} />
                                            )}
                                        </div>

                                        <div className='col-sm-5 d-flex justify-content-center align-items-center'>
                                            <button className='btn btn-success' onClick={storeBlog}>Post Blog</button>
                                        </div>
                                    </div>


                                </form>
                            </div>
                        </div>
                    </div>
                {/* </div> */}
            </div>
        </div>
    );

}

export default CreateBlog;