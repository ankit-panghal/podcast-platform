import React, { useState } from 'react'
import './style.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {db,auth} from '../../Firebase'
import {createUserWithEmailAndPassword,signInWithEmailAndPassword} from 'firebase/auth'
import { setDoc,doc, getDoc, } from 'firebase/firestore'
import { setUser } from '../../redux/Slices/userSlice'
import { toast } from 'react-toastify'
import validator from 'validator';
import { Bars } from 'react-loader-spinner'
import usePhotoApi from '../usePhotoApi'

const ButtonComponent = ({text,name,email,password,confirmPass}) => {
   const [loading,setLoading] = useState(false);
 const dispatch = useDispatch();
  const navigate = useNavigate();
  const {fetchAvatar} = usePhotoApi() 

  async function handleSubmission(e){
    setLoading(true)
    if(text === 'Signup'){
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
          console.log(userCredential);
          
          const user = userCredential.user;
          const userImgUrl = await fetchAvatar(name);
          
          setLoading(false);
          console.log('user : ',user);
          toast.success('User created successfully')
          await setDoc(doc(db,'users',user.uid),{
            name : name,
            email : user.email,
            uid : user.uid,
            profileImageUrl : userImgUrl
          })
           dispatch(setUser({
              name : name,
              email : user.email,
              uid : user.uid,
              profileImageUrl : userImgUrl
            }
          ))
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
          const userDoc = await getDoc(doc(db,'users',user.uid))
          const userData = userDoc.data();
          const userImgUrl = await fetchAvatar(name);
          setLoading(false)
          // console.log(userData)
          toast.success('User logged In successfully')
          
         dispatch(setUser({
             name : userData.name,
             email : userData.email,
             uid : userData.uid,
             profileImageUrl : userImgUrl
           }
         ))
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
