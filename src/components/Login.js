import axios from '../api/axios';
import React, {useEffect, useState, useContext, useRef} from 'react'
import { Button } from 'react-bootstrap';
import { booleanContext } from '../Context';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Register from './Register';
import Popup from 'reactjs-popup';



const LOGIN_URL = '/user/auth/login/';

function Login() {
    const{isLoggedIn, setIsLoggedIn} =useContext(booleanContext)
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [seen, setSeen] = useState(false)

const[user, setUser] = useState('')



    const url = `${LOGIN_URL}?user=${user}&password=${password}`
 
    useEffect(() => {
      setErrMsg('');
  
  }, [user, password])



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
        const response = await axios.post(url);
  console.log(response);
  const accessToken = response?.data?.access_token;
  const refreshToken = response?.data?.refresh_token;
  const roles = response?.data?.authorities;
  console.log(response.data.authorities);
  localStorage.setItem("Authorities Copy", roles);
  localStorage.setItem("Refresh Token Copy", refreshToken);
  localStorage.setItem("Access Token", accessToken);
  localStorage.setItem("Access Token Copy", accessToken);

  localStorage.setItem("email Copy", email);
  localStorage.setItem("phone Copy", phone);

  localStorage.setItem("password Copy", password);
  localStorage.setItem("role Copy", roles);

  setIsLoggedIn(true)


  alert("Login Successful");
  navigate(from, { replace: true });

    } catch (err) {
  alert("error with login")
  console.log(err);
        if (!err?.response) {
          
            setErrMsg('No Server Response');
        } else if (err.response?.status === 400) {
            setErrMsg('Missing Email or Password');
        } else if (err.response?.status === 401) {
            setErrMsg('Unauthorized');
        } else {
            setErrMsg('Login Failed');
        }
        // errRef.current.focus();
    }
  }

  useEffect(()=>{
    let testEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let testPhone = /^\+?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4,6}$/im;
    if (testEmail.test(user)) setEmail(user);
    else setPhone(user)
},[handleSubmit])

const popup =()=>{

    return(
        <>

          { <Register />}
        
        </>
    )
}



    return (
   <>
  <div id='messenger' >
   <h1>JT's Messenger</h1>
   <p>Connect with friends and the world around you on JT's Messenger.</p>
  <section>
              {/* <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p> */}
              <h1>Sign In</h1>
              <form>
                  <label htmlFor="user">Email or Mobile Number:</label>
                  <input
                      type="text"
                      id="user"
                      // ref={userRef}
                      autoComplete="off"
                      onChange={(e) => setUser(e.target.value)}
                      value={user}
                      required
                  />
  
                  <label htmlFor="password">Password:</label>
                  <input
                      type="password"
                      id="password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      required
                  />
                  <Button onClick={handleSubmit}>Login</Button>
              </form>
              <p>
              <span className="line">
                    <Link to="/forgot">Forgot Your Password?</Link>
                </span>
              <br/>
              <br/>
             

                  <span className="line">
                     
                  </span>
              </p>
          </section>
       Need an Account?<br />
            <Popup trigger=
                {<Button>Create a New Account</Button> }
               position="right center"
                >
            {popup}
            </Popup>  
            </div> 

   </>
    );
}

export default Login;