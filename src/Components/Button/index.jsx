import './style.css'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {db,auth} from '../../Firebase'
import {createUserWithEmailAndPassword,signInWithEmailAndPassword} from 'firebase/auth'
import { setDoc,doc, getDoc, } from 'firebase/firestore'
import { setUser } from '../../redux/Slices/userSlice'
import { toast } from 'react-toastify'
import validator from 'validator';
import { Bars } from 'react-loader-spinner'

const ButtonComponent = ({text,name,email,password,confirmPass}) => {
   const [loading,setLoading] = useState(false);

   const dispatch = useDispatch();
   const navigate = useNavigate();
  

  async function handleSubmission(){
    setLoading(true)
    if(text === 'Signup'){
      //Validations
      if(!name || !email || !password || !confirmPass){
        toast.error('Please fill all the fields')
        setLoading(false)
        
      }
      else if(!validator.isEmail(email)){
         toast.error('Invalid Email')
         setLoading(false)
      }
      else if(password !== confirmPass){
        toast.error("Passwords doesn't match")
        setLoading(false)
      }
      else if(password.length < 6){
        toast.error('Password length should be greater than 5')
        setLoading(false)
      }
    else{
       try{
          const userCredential = await createUserWithEmailAndPassword(
              auth,email,password
          )
          const user = userCredential.user;
          const userImgUrl = `https://api.multiavatar.com/${name ? name:'Binx Bond'}.png`;

          const data = {
            name : user.name,
            email : user.email,
            uid : user.uid,
            profileImageUrl : userImgUrl
          }
          //Add Data to firestore
          await setDoc(doc(db,'users',user.uid),data)
          dispatch(setUser(data))

          setLoading(false);
          toast.success('User created successfully')
          navigate('/podcasts');
       }
       catch(error){
          toast.error(error.message)
           setLoading(false);
       }
    }
   
  }
  else{
      try{
         const userCredential = await signInWithEmailAndPassword(
             auth,email,password
         )
         const user = userCredential.user;
         //Get Data from firestore
          const userDoc = await getDoc(doc(db,'users',user.uid))
          const userData = userDoc.data();
          
          dispatch(setUser(userData))
          setLoading(false)
          toast.success('User logged In successfully')
          navigate('/podcasts');
      }
      catch(error){
         console.log('error')
         toast.error(error.message)
         setLoading(false)
      }
  }
 }

  return (
    <button className='custom-btn' disabled={loading} onClick={handleSubmission}> 
      {
          loading ? <Bars
          ariaLabel="bars-loading"
          height='24'
          color='white'
          /> : text
      }
    </button>
  )
}

export default ButtonComponent
