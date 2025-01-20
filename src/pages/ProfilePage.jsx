import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Header from '../Components/Header'
import { getAuth, deleteUser,signOut, sendEmailVerification } from 'firebase/auth'
import { toast } from 'react-toastify'
import InputComponent from '../Components/Input'
import { useDispatch } from 'react-redux'
import { removeUser, setUser } from '../redux/Slices/userSlice'
import PodcastCard from '../Components/Podcast/PodcastCard'
import {db} from '../Firebase'
import {doc,getDoc, collection, getDocs, query} from 'firebase/firestore'
import { updatePodcasts } from '../redux/Slices/userPodcastsSlice'
import{ MdVerified } from 'react-icons/md'


const ProfilePage = () => {
  const user = useSelector(state => state.user.user)
  const userPodcasts = useSelector(state => state.userPodcasts)
  const [userImg,setUserImg] = useState(user?.profileImageUrl ? user.profileImageUrl : '')
  const [email,setEmail] = useState(user?.email ? user.email : '')
  console.log(userPodcasts);
  
  const dispatch = useDispatch();
 const auth = getAuth();
 const currentUser = auth.currentUser;
   
 useEffect(() => {
  if(currentUser){
      setEmail(currentUser.email)
      return;
    async function getData(){
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
    
      if (docSnap.exists()) {
      dispatch(setUser(docSnap.data()))
      console.log("Document data:", docSnap.data());
      setUserImg(docSnap.data().profileImageUrl)
      } else {
      console.log("No such document found!");
      }
     }
     getData();
  }
 },[currentUser])

useEffect( () => {
  (async function() {
    const q  = query(collection(db,'podcasts'));
    const querySnapshot = await getDocs(q)
    const podcastsData = [];
    querySnapshot.forEach((doc) => {
      if(doc.data().createdBy === auth.currentUser.uid){
        podcastsData.push({id : doc.id,...doc.data()})
      }
    })   
      dispatch(updatePodcasts(podcastsData))
  })()
},[])


    if(!currentUser) return <><Header/></>

    function verifyEmail(){
       sendEmailVerification(currentUser).then(() => {
          toast.info('Email verification link sent to your email')
        }).catch((error) => {
          toast.error(error.message)
          })
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
    deleteUser(currentUser)
    .then(() => {
     toast.success('Account deleted successfully')
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
      <InputComponent type={'email'} placeholder={'Email'} readOnly={true} value={email}  setValue={setEmail} />
      {currentUser.emailVerified && <MdVerified style={{color : 'green',fontSize : '1.5rem'}}/>}
      </div>
      {
      !currentUser.emailVerified && <button className='custom-btn verify-mail' onClick={verifyEmail}>Verify Email</button>
      }
      
      <h1 className='heading' style={{marginTop : '40px'}}>Your Podcasts</h1>
      
      {userPodcasts.length > 0 && <div className='podcasts-container user-podcasts'>
        {userPodcasts.map(item => {
          return <PodcastCard key={item.id} id={item.id} title={item.title} displayImg={item.displayImage}/>
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
