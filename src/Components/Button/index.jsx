import './style.css'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import {db,auth} from '../../Firebase'
import {getAuth,signInWithEmailAndPassword} from 'firebase/auth'
import { doc, getDoc} from 'firebase/firestore'
import { setUser } from '../../redux/Slices/userSlice'
import { toast } from 'react-toastify'
import validator from 'validator';
import { Bars } from 'react-loader-spinner'

const ButtonComponent = ({text,email,password}) => {
   const [loading,setLoading] = useState(false);

   const dispatch = useDispatch();
   const navigate = useNavigate();
  const auth = getAuth()

  async function handleSubmission(){
      if(!email || !password ){
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
          const userCredential = await signInWithEmailAndPassword(auth,email,password)
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
