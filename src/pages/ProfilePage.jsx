import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Header from '../Components/Header'
import { getAuth, deleteUser,sendPasswordResetEmail,signOut } from 'firebase/auth'
import { toast } from 'react-toastify'
import InputComponent from '../Components/Input'
import { useDispatch } from 'react-redux'
import { removeUser } from '../redux/Slices/userSlice'
import PodcastCard from '../Components/Podcast/PodcastCard'
import {db} from '../Firebase'
import {doc,getDoc, collection, onSnapshot, query} from 'firebase/firestore'
import { updatePodcasts } from '../redux/Slices/userPodcastsSlice'


const ProfilePage = () => {
  const user = useSelector(state => state.user.user)
  const userPodcasts = useSelector(state => state.userPodcasts)
  const dispatch = useDispatch();
 const [email,setEmail] = useState(user?.email);
 const [userImg,setUserImg] = useState(null)

 const auth = getAuth();
 
 useEffect(() => {
  async function getData(){
  const user = auth.currentUser;
  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    setUserImg(docSnap.data().profileImageUrl)
  } else {
    console.log("No such document found!");
  }
}
getData();
 },[])

useEffect(() => {
  const unsubscribe = onSnapshot(
    query(collection(db,'podcasts')),
    (querySnapshot) => {
         const podcastsData = [];
      querySnapshot.forEach((doc) => {
        console.log(doc.data())
     if(doc.data().createdBy === auth.currentUser.uid){
           podcastsData.push({id : doc.id,...doc.data()})
     }
    })
   dispatch(updatePodcasts([...podcastsData]))
    console.log('user podcasts : ' ,podcastsData)
    }
   )
},[])

if(!user) return <><Header/></>
   

    function handlePassword(){
        sendPasswordResetEmail(auth, email)
    .then(() => {
      toast.success('Password reset email sent')
    })
    .catch((error) => {
      console.log(error.message) ;
    }); 
    }

  function handleLogOut(){
    signOut(auth).then(() => {
      toast.success('User logged out successfully')

    })
    .then(() => {
      dispatch(removeUser())
    })
    .catch(error => {
      toast.error(error.message)
    })

  }
  function handleDeletion(){

    const user = auth.currentUser;
    deleteUser(user).then(() => {
     toast.success('Account deleted successfully')
    })
    .then(() => {
      dispatch(removeUser())
    })
    .catch((error) => {
      toast.error(error.message)
      console.log(error.message)
    });
    }
    


  return (
    <div>
      <Header/>
      <h1 className='heading' id='profile'>Profile</h1>
      <div className='profile-pic'>
        <img src={userImg} alt='user-avatar'/>
      </div>
      <div className='user-details'>
      <InputComponent type={'email'} value={email} placeholder={'Email'} setValue={setEmail} readOnly={true}/>

      <p onClick={handlePassword}>Forgot Password/Change Password ?</p>
      </div>
      <h1 className='heading' style={{marginTop : '40px'}}>Your Podcasts</h1>
      
      {userPodcasts.length > 0 && <div className='podcasts-container user-podcasts'>
        {userPodcasts.map(item => {
          return <PodcastCard id={item.id} title={item.title} displayImg={item.displayImage}/>
        })}
        </div>}
      <div className='out-btns'>
      <button className='custom-btn' id='logout-btn' onClick={handleLogOut}>Logout</button>
      <button className='custom-btn' id='del-btn' onClick={handleDeletion}>Delete Account</button>
      </div>
    </div>
  )
}

export default ProfilePage
