import React from 'react'
import { useRef, useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import { proccessContext } from '../Context';
import { Button } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';

const CREATE_URL = '/user/save';



const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
    const [errMsg, setErrMsg] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const[user, setUser] = useState('')
    const [gender, setGender] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [generate,setGenerate] = useState(false)
const[submitFlag, setSubmitFlag] = useState(true)
const [role, setRole] = useState('')
const LOGIN_URL = '/api/auth/user/save';
const [birthDate, setBirthDate] = useState('')
const [phone, setPhone] = useState('')
const [firstRun, setFirstRun] = useState(true)




    const handleSubmit = async (e) => {
      if(password !== confirmPassword){
        alert("Passwords don't match");
        return;
      }

      let json = ``;
    
     if(phone){
      console.log(phone);
      let testPhone = /^\+?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4,6}$/im;
      if(!testPhone.test(user)) alert("Not Valid Email or Phone Number") 
      json = `{"email" : "", "password" : "${password}", 
        "firstName" : "${firstName}", "lastName" : "${lastName}",   
         "gender" : "${gender}", "birthDate" : "${birthDate}",
         "phone" : "${phone}", "isPending" : "${true}"}`  
      }
else if (email){
  json = `{"email" : "${email}", "password" : "${password}", 
        "firstName" : "${firstName}", "lastName" : "${lastName}",   
         "gender" : "${gender}", "birthDate" : "${birthDate}",
         "phone" : "", "isPending" : "${true}"}`
}
      if(!user && !phone && !email) {
        alert("Please enter email or phone number")
        return;
      }
      const userJson = JSON.parse(json);
      try {
          const response = await axios.post(CREATE_URL, userJson);
          if (response.data === ''){
            console.log(response);
            alert("User already in database")
            setUser('')
            setEmail('')
            setPhone('')
            setPassword('')
            setFirstName('')
            setLastName('')
                setGender('')
                setRole('')
            return;
          }  
    console.log(response);
    console.log("Account not found, creating new account");
    console.log(role);

         nextResponse()

      
 

    }
    catch (err) {
      if (!err?.response) {
        
          setErrMsg('No Server Response');
      } else if (err.response?.status === 400) {
          setErrMsg('Missing Email or Password');
      } else if (err.response?.status === 401) {
          setErrMsg('Unauthorized');
      } else {
          setErrMsg('Registration Failed');
      }
      setUser('')
      setEmail('')
      setPhone('')
      setPassword('')
      setFirstName('')
      setLastName('')
          setGender('')
          setRole('')  }
        }
     
    
    const nextResponse = async() =>{
      console.log(role);
    
      let pendingRoleUrl = ``
      if(phone) pendingRoleUrl = `user/pendingRole?pendingRole=${role}&user=${phone}`
     else pendingRoleUrl = `user/pendingRole?pendingRole=${role}&user=${email}`
try{

  const response = await axios.post(pendingRoleUrl)
  alert("Account Created")
  
  window.location.reload();

}catch(err){
  console.log(err);
}
setUser('')
  setEmail('')
  setPhone('')
  setPassword('')
  setFirstName('')
  setLastName('')
      setGender('')
      setRole('')
    }
    useEffect(()=>{

  
      const testEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
     
         if (testEmail.test(user)) setEmail(user);
        else setPhone(user)
    
        console.log("here");
    },[user])



  return (
    <>
  

<form >
<table
// display="inline-block"
// width="200px"
// margin-right="30px"
// text-align="right"
// cellSpacing="2"
// cellPadding="5"
// id="data_table"
// border="1"
// className='table'
align-self= 'center'
style={{backgroundColor: "white"}}
>

<div className="bg-warning p-1"> </div>
<div>
<h1>Sign Up</h1>
    <h3>It's Quick and Easy</h3>
    </div>

<tbody>

            <tr>
             
<div>
        <label htmlFor="name"></label>
        <input required type="text" id="fName" placeholder="First Name" className="form-control" autoComplete="name" enterKeyHint="next" value={firstName} onChange={(e) => setFirstName(e.target.value)}
      ></input>

        <label htmlFor="name"></label>
        <input required type="text" id="lName" placeholder="Last Name"className="form-control" autoComplete="name" enterKeyHint="next" value={lastName} onChange={(e) => setLastName(e.target.value)}></input>
      </div>
      </tr>
     
            <tr>
            <div>
            <label htmlFor="text"></label>
<input type="text" id="mailOrPhone" name="mailOrPhone" placeholder="Email or Phone Number" value={user} onChange={(e) => setUser(e.target.value)} required ></input>
            </div>
            </tr>
   
 <tr>
 <div className="form-group">
   <label htmlFor="password">Password</label>
   <input type="password" className="form-control" id="password" placeholder="password"  name="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters" 
   onChange={(e) => setPassword(e.target.value)}
   value={password} required/>
 </div>
 </tr>
 <tr>
  <div className="form-group">
   <label htmlFor="password">Confirm Password</label>
   <input type="password" className="form-control" id="password" placeholder="password"  name="password" 
    onChange={(e) => setConfirmPassword(e.target.value)}
    value={confirmPassword}required/>
   
 </div>
 </tr>
 <tr>

 <input type="radio" id="male" name="gender" value="male" onClick={(e) => setGender('male')} 
required />
    <label htmlFor="male">Male</label>
    <input type="radio" id="female" name="gender" value="female"onClick={(e) => setGender('female')}  required/>
    <label htmlFor="female">Female</label>
    <input type="radio" id="custom" name="gender" value="custom"   required/>
    <label htmlFor="female">Custom</label>
    <select  hidden >
    <option value="She">She: "We wish her a happy birthday"</option>
    <option value="Him">He: "We wish him a happy birthday"</option>
    <option value="They">They: "We wish them a happy birthday"</option>


    </select>
  
    <div hidden>
    <label htmlFor="gender">Gender</label>
   <input type="text" className="form-control" id="gender" placeholder="Gender (optional)"  name="gender"/>
   </div>
<div>
  <h3>Role Requested</h3>
<input type="radio" id="user" name="role" value="user" onClick={(e) => setRole('user')}
required />
    <label htmlFor="user">Standard User</label>
    <input type="radio" id="admin" name="role" value="admin" onClick={(e) => setRole('admin')} required/>
    <label htmlFor="admin">Administrator</label>
</div>

</tr>
<tr>
 <Button type="button" className="btn btn-primary"  onClick={()=> handleSubmit()}>Register</Button>
 </tr>
 </tbody>
 <div id="message">
 <h3>Password must contain the following:</h3>
 <p id="letter" className="invalid">A <b>lowercase</b> letter</p>
 <p id="capital" className="invalid">A <b>capital (uppercase)</b> letter</p>
 <p id="number" className="invalid">A <b>number</b></p>
 <p id="length" className="invalid">Minimum <b>8 characters</b></p>
</div>
 </table>






</form>
   </>
  )
}

export default Register