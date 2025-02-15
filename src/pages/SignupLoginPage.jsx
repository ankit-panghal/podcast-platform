import React, { useEffect, useState } from 'react'
import Header from '../Components/Header'
import SignupForm from '../Components/SignupForm';
import LoginForm from '../Components/LoginForm';
import {ReactComponent as GoogleSvg} from '../assets/google-logo.svg'
import { setUser } from '../redux/Slices/userSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAuth,GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { toast } from 'react-toastify';
import { db } from '../Firebase';
import { doc, setDoc } from 'firebase/firestore';

const SignupLoginPage = () => {
  const [clicked,setClicked] = useState(false); 
    const auth = getAuth()
    const currentUser = auth.currentUser;
    const dispatch = useDispatch()
     const navigate = useNavigate()

useEffect(() => {
   if(currentUser?.emailVerified) navigate('/podcasts')
},[currentUser?.emailVerified])

      async function handleSignIn(){
        const auth =  getAuth()
        const provider = new GoogleAuthProvider();
        const result =  await signInWithPopup(auth,provider)
        const user = result.user;
        
        const data = {
          name : user.displayName,
          email : user.email,
          uid : user.uid,
          profileImageUrl : user.photoURL
        }
        
        await setDoc(doc(db,'users',user.uid),data)
        dispatch(setUser(data))
        toast.success('User logged in Successfully')
        navigate('/podcasts')
      }

  return (
    <div>
      <Header/>
      <form onSubmit={(e) => e.preventDefault()}>
       {!clicked ? <h1>Signup</h1> :  <h1>Login</h1>} 
       {!clicked ? <SignupForm/> : <LoginForm/>}
       <button className='google-auth-btn' onClick={handleSignIn}><GoogleSvg /> Continue with Google</button>
        {!clicked ? <p onClick={() => setClicked(!clicked)}>Already have an Account? Click here to Login.</p> : <p onClick={() => setClicked(!clicked)}>Don't have an Account? Click here to Signup.</p>}
      </form>
    </div>
  )
}

export default SignupLoginPage
