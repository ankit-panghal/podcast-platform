import React, { useState } from 'react'
import Header from '../Components/Header'
import SignupForm from '../Components/SignupForm';
import LoginForm from '../Components/LoginForm';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
const SignupPage = () => {
  const [clicked,setClicked] = useState(false);
  const user = useSelector(state => state.user.user);
  console.log(user)
  const navigate = useNavigate();
   if(user) navigate('/profile')
   
  return (
    <div>
      <Header/>
      <form onSubmit={(e) => e.preventDefault()}>
       {!clicked ? <h1>Signup</h1> :  <h1>Login</h1>} 
       {!clicked ? <SignupForm/> : <LoginForm/>}
        {!clicked ? <p onClick={() => setClicked(!clicked)}>Already have an Account? Click here to Login.</p> : <p onClick={() => setClicked(!clicked)}>Don't have an Account? Click here to Signup.</p>}
      </form>
      
    </div>
  )
}

export default SignupPage
