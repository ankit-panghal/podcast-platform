import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import Header from '../Components/Header'
import { getAuth, deleteUser,signOut, sendEmailVerification, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { toast } from 'react-toastify'
import InputComponent from '../Components/Input'
import { useDispatch } from 'react-redux'
import { removeUser, setUser } from '../redux/Slices/userSlice'
import PodcastCard from '../Components/Podcast/PodcastCard'
import {db} from '../Firebase'
import {doc,getDoc, collection, getDocs, query} from 'firebase/firestore'
import { updatePodcasts } from '../redux/Slices/userPodcastsSlice'
import {ReactComponent as DelSvg} from '../assets/del-logo.svg'
import Skeleton from 'react-loading-skeleton'

const ProfilePage = () => {
  const user = useSelector(state => state.user.user)
  const userPodcasts = useSelector(state => state.userPodcasts)
  const [userImg,setUserImg] = useState(user?.profileImageUrl ? user.profileImageUrl : '')
   const [closeModal,setCloseModal] = useState(true)
  const passRef = useRef()
  const dispatch = useDispatch();
 const auth = getAuth();
 const currentUser = auth.currentUser;
  // console.log(currentUser)
 useEffect(() => {
  if(currentUser){
    async function getData(){
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
    
      if (docSnap.exists()) {
      dispatch(setUser(docSnap.data()))
      // console.log("Document data:", docSnap.data());
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

 async function handleAccountDeletion(){
  console.log(passRef.current)
  try{
     if(passRef.current.value){
    
      const credential = EmailAuthProvider.credential(currentUser.email,passRef.current.value);
      await reauthenticateWithCredential(currentUser,credential)
      await deleteUser(currentUser)
      toast.success('Account deleted successfully')
     }
     else{
      toast.info('Password required for account deletion.')
     }
    }
    catch(err){
      console.log(err)
    }
  }
    


  return (
    <div>
      <Header/>
     {!closeModal && <div className = 'modal-container'>
        <div className='modal'>
           <p>Delete Account</p>
           <InputComponent type={'password'} placeholder={'Confirm password'} inputRef={passRef} />
           <div style={{display : 'flex', justifyContent : 'end',gap : '15px'}}>
           <button className='custom-btn' onClick={() => setCloseModal(true)}>Cancel</button>
           <button className='custom-btn' id='del-btn' onClick={handleAccountDeletion}><DelSvg/></button>
           </div>
        </div>
      </div>}
      <h1 className='heading' id='profile'>Profile</h1>
      <div className='profile-pic'>
       { 
       userImg ? <img src={userImg} alt='user-avatar'/>
        :
        <Skeleton width={'10vw'} height={'10vw'} borderRadius={'50%'} baseColor='rgb(40, 40, 66)'/>
      }
      </div>
      <div className='user-details'>
      <InputComponent type={'email'} placeholder={'Email'} readOnly={true} value={currentUser?.email} />
      </div>
      
      <h1 className='heading' style={{marginTop : '80px'}}>Your Podcasts</h1>
      
      {
        !userPodcasts ? (
          <div className='podcasts-container'>
            {
              new Array(4).fill().map((_, idx) => {
                return <Skeleton key={idx} height={'250px'} baseColor='rgb(40, 40, 66)' />
              })
            }
          </div>
        ) : userPodcasts?.length > 0 ? (
          <div className='podcasts-container user-podcasts'>
            {userPodcasts.map(item => {
              return <PodcastCard key={item.id} id={item.id} title={item.title} displayImg={item.displayImage} />
            })}
          </div>
        ) : (
          <p style={{textAlign : 'center',margin : '20px 0 100px 0',opacity : 0.5}}>No podcast has been created yet</p>
        )
      }
      <div className='out-btns'>
      <button className='custom-btn' id='logout-btn' onClick={handleLogOut}>Logout</button>
      <button className='custom-btn' id='del-btn' onClick={() => setCloseModal(false)}>Delete Account</button>
      </div>
    </div>
  )
}

export default ProfilePage
