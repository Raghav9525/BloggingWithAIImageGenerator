
import { React, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';

function Login() {
    const [values, setValues] = useState({
        mobile: '',
        password: ''
    })

    const apiUrl = process.env.REACT_APP_SERVER_URL;
    const navigate = useNavigate()

    const handleInput = (event) => {
        const { name, value } = event.target;
        setValues(prev => ({ ...prev, [name]: value }));
    };

    const submitForm = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`${apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });

            if (response.ok) {
                const data = await response.json(); // Extract data from response
                const token = data.token;
                localStorage.setItem('token', token);
                navigate('/create_blog')
            } else {
                navigate('/login')
            }
        } catch (error) {
            console.error("Error occurred during signup:", error);
        }
    };
    return (
        <div style={{ backgroundColor: "#1d2b53", minHeight: "100vh" }}>
            <div id="booking-container" class="container-fluid  align-items-center vh-60 ">
                <div class="row ">
                    <div class="col-sm-3"></div>
                       
                    <div class="col-sm-6">
                        <div class="card p-4 mt-4 mb-4" >
                            <form>

                                <div class="mb-3">
                                    <label for="exampleInputEmail1" class="form-label">Mobile No.</label>
                                    <input
                                        type="mobile"
                                        name="mobile"
                                        onChange={handleInput}
                                        class="form-control"
                                        id="exampleInputMobile"
                                    />
                                    {/* {errors.email && <span className='text-danger'> {errors.email}</span>} */}
                                </div>

                                <div class="mb-3">
                                    <label for="exampleInputPassword1" class="form-label">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        class="form-control"
                                        id="exampleInputPassword1"
                                        onChange={handleInput}
                                    />
                                    {/* {errors.password && <span className='text-danger'> {errors.password}</span>} */}
                                </div>

                                <button type="submit" onClick={submitForm} class="btn btn-primary me-2">Login</button>

                            </form>
                            <NavLink to={`/signup`}>New user? Create Account</NavLink>
                        </div>
                    </div>
                </div>
                <div class="col-sm-3"></div>
            </div>
            {/* <Footer /> */}
        </div>
    )
}

export default Login