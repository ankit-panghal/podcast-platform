import React,{useState} from 'react'
import InputComponent from '../Input'
import ButtonComponent from '../Button';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { toast } from 'react-toastify';
const LoginForm = () => {
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const auth = getAuth();
    
    const handleResetPassword = () => {
         try{
            if(email === '') throw new Error('Please Enter Email')
            else{
                sendPasswordResetEmail(auth, email)
                .then(() => {
                  toast.info('Password Reset Email Sent')
                }).catch((error) => {
                  toast.error(error.message)
                });
             }
         }
         catch(error){
          toast.error(error.message)
         }
    }
  return (
    <>
      <InputComponent type='email' placeholder='Email' value={email} setValue={setEmail}/>
      <InputComponent type='password' placeholder='Password' value={password} setValue={setPassword}/>
      <ButtonComponent text='Login' email={email} password={password}/>
      <p onClick={handleResetPassword}>Forgot Password/Change Password ?</p>
    </>
  )
}

export default LoginForm
