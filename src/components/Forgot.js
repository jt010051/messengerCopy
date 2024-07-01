import {React, useRef, useState} from 'react';
import { Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import axios from '../api/axios';







const Forgot = () => {
    const navigate = useNavigate();
const location = useLocation();
const from = location.state?.from?.pathname || "/";
    const [username, setUsername] = useState('');
    const LOGIN_URL = `user/forgot/${username}`;
    const changePass = location.state?.from?.pathname || "/changePassword";



    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await axios.get(LOGIN_URL);
        console.log(response);
        if(response.data === "") {
            alert("User Not Found");
            return;
        }
        navigate(changePass, { replace: true });
        localStorage.setItem("username", username)
    }
    const back =() =>{
        navigate(from, { replace: true });

    }
    return (
        <>
        <div>
        <h1>Find your account</h1>
        <div>
            <p>
            Please enter your email or mobile number to search for your account.
            </p>
        </div>

        <div>
            
<form>
<label htmlFor="username">Username:</label>
                  <input
                      type="text"
                      id="username"
                      // ref={userRef}
                      autoComplete="off"
                      onChange={(e) => setUsername(e.target.value)}
                      value={username}
                      required
                      placeholder='Email or mobile number'
                  />
<Button onClick={back}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>

</form>

        </div>
        </div>
        </>
    );
};

export default Forgot;