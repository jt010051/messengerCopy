import React, {useState, useEffect, useContext} from 'react'
import axios from '../api/axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { booleanContext } from '../Context';
import { Button } from 'react-bootstrap';

const LOGIN_URL = '/api/auth/login';

const NewPassword = () => {
    const [checkingPassword, setCheckingPassword] = useState('')
    const{isLoggedIn, setIsLoggedIn} =useContext(booleanContext )

    // const [password, setPassword] = useState('')
    const [editedPassword, setEditedPassword] = useState('')
    const [confirmEditedPassword, setConfirmEditedPassword] = useState('')

    const username = localStorage.getItem("username")
    const [id, setId] = useState(0)
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

 


 
    const changePass = async (e) => {
        e.preventDefault();
    console.log("Here");
        
            if(editedPassword !== confirmEditedPassword) {
                alert("Passwords Don't Match");
                    return;
            } 
          

    try {


const fullLink = `user/updatePassword?username=${username}&password=${editedPassword}`
console.log(fullLink);
const response2 = await axios.put( fullLink);
        
alert("Password Has Been Changed!")
console.log(response2);

navigate(from, { replace: true });

    }
    catch(err){
console.log(err);
    }
}
const back =() =>{
    navigate(from, { replace: true });

}

    return (
        <div>
<form onSubmit={changePass}>
    <h1>Change Password</h1>


  <label>
    New Password
    <input type="password" name="password" onChange={(e) => setEditedPassword(e.target.value) }  
    pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" required/>
  </label>
  <br/>
  <label>
    Confirm New Password
    <input type="password" name="password" onChange={(e) => setConfirmEditedPassword(e.target.value)} required />
  </label>
  <div id="message">
 <h3>Password must contain the following:</h3>
 <p id="letter" className="invalid">A <b>lowercase</b> letter</p>
 <p id="capital" className="invalid">A <b>capital (uppercase)</b> letter</p>
 <p id="number" className="invalid">A <b>number</b></p>
 <p id="length" className="invalid">Minimum <b>8 characters</b></p>
</div>

<Button type='submit'>Submit</Button>
<Button onClick={back}>Cancel</Button>



</form>
        </div>
    );
};

export default NewPassword;