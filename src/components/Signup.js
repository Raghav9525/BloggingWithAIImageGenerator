
import { React, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom';


function Signup() {
    const [values,setValues] = useState({
        nam:'',
        mobile: '',
        password:''
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
            console.log(process.env.REACT_APP_SERVER)
            console.log(values)
            const response = await fetch(`${apiUrl}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });

            if (response.ok) {
                navigate('/login')
            } else {
                console.error("Signup failed");
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
                                    <label for="exampleInputName" class="form-label">Name</label>
                                    <input
                                        type="text"
                                        name="nam"
                                        value={values.name}
                                        onChange={handleInput}
                                        class="form-control"
                                        id="exampleInputName"
                                    />
                                </div>

                                <div class="mb-3">
                                    <label for="exampleInputEmail1" class="form-label">Mobile No.</label>
                                    <input
                                        type="mobile"
                                        name="mobile"
                                        onChange={handleInput}
                                        value={values.mobile}
                                        class="form-control"
                                        id="exampleInputMobile"
                                    />
                                </div>

                                <div class="mb-3">
                                    <label for="exampleInputPassword1" class="form-label">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        class="form-control"
                                        id="exampleInputPassword1"
                                        value={values.password}
                                        onChange={handleInput}
                                    />
                                </div>

                                <button type="submit" onClick={submitForm} class="btn btn-primary me-2">Submit</button>

                            </form>
                            <NavLink to={`/login`}>Login</NavLink>
                        </div>
                    </div>
                </div>
                <div class="col-sm-3"></div>
            </div>
        </div>
    )
}

export default Signup