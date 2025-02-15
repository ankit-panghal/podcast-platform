import React,{ useRef, useState} from 'react'
import { toast } from 'react-toastify'
import InputRef from '../Input/InputRef'
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../../Firebase'
import { setUser } from '../../redux/Slices/userSlice'
import { useDispatch } from 'react-redux'
import validator from 'validator';
import { Bars } from 'react-loader-spinner'

const SignupForm = () => {
  const [loading,setLoading] = useState(false)
  const fullNameRef = useRef('')
  const emailRef = useRef('')
  const passRef = useRef('')
  const auth = getAuth()
  const dispatch = useDispatch()
  
  async function handleSubmission(name,email,password){
     setLoading(true)
       //Validations
       if(!name || !email || !password ){
         toast.error('Please fill all the fields')
         setLoading(false)
         
       }
       else if(!validator.isEmail(email)){
          toast.error('Invalid Email')
          setLoading(false)
       }
       else if(password.length < 8){
         toast.error('Password should have alteast 8 characters')
         setLoading(false)
       }
     else{
        try{
           const userCredential = await createUserWithEmailAndPassword(
               auth,email,password
           )
           const user = userCredential.user;
           const userImgUrl = `https://api.dicebear.com/9.x/micah/svg?seed=${name}`;
 
           const data = {
             name ,
             email : user.email,
             uid : user.uid,
             profileImageUrl : userImgUrl
           }
           
           //Add Data to firestore
           await setDoc(doc(db,'users',user.uid),data)
           dispatch(setUser(data))
           await sendEmailVerification(auth.currentUser)
           toast.info('Email verification sent successfully')
         setLoading(false);
        }
        catch(error){
           toast.error(error.message)
            setLoading(false);
        }
     }
    
   }
  return (
    <>
       <InputRef type='text' placeholder= 'Full Name' inputRef={fullNameRef} />
       <InputRef type='email' placeholder='Email' inputRef={emailRef}/>
       <InputRef type='password' placeholder='Password' inputRef={passRef} />
       <button className='custom-btn' onClick={() => handleSubmission(fullNameRef.current.value,emailRef.current.value,passRef.current.value)}>{
          loading ? <Bars
          ariaLabel="bars-loading"
          height='24'
          color='white'
          /> : 'Signup'
      }</button>
      
    </>
  )
}

export default SignupForm