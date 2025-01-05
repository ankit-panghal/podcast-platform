import React from 'react'
import {useAuthState} from 'react-firebase-hooks/auth'
import { Outlet,Navigate } from 'react-router-dom'
import { auth } from '../Firebase';
import { Bars } from 'react-loader-spinner';
import Header from './Header';
const PrivateRoutes = () => {
    const [user,loading,error] = useAuthState(auth);

    if(loading) return <>
                        <Header/>
                        <div className='loader'>
                        <Bars color='white' height='40'  />
                        </div>
                       </> 
    else if(!user || error) return <Navigate to='/'/>
    else return <Outlet/> //component used to render child routes of a parent route.
  
}

export default PrivateRoutes
