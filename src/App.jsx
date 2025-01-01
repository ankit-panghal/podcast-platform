import './App.css';
import {Routes,Route} from 'react-router-dom'
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import { ToastContainer} from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './Firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { setUser } from './redux/Slices/userSlice';
import PrivateRoutes from './Components/PrivateRoutes';
import CreatePodcastPage from './pages/CreatePodcastPage';
import PodcastsPage from './pages/PodcastsPage';
import PodcastDetails from './pages/PodcastDetails';
import CreateEpisodePage from './pages/CreateEpisodePage';
import EditPodcastPage from './pages/EditPodcastPage';

function App() {
const dispatch = useDispatch();
useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth,(user) => {
      if(user){
        const unsubscribeSnapshot = onSnapshot(
          doc(db,'users',user.uid),
          (userDoc) => {
            if(userDoc.exists()){
              const userData = userDoc.data();
              dispatch(
                setUser({
                  name : userData.name,
                  email : userData.email,
                  uid : userData.uid
                })
              )
            }
          },
          (error) => {
            console.log('Error fetching user data',error.message)
          }
        )
        return () => unsubscribeSnapshot();
      }

    })
    return () => unsubscribeAuth();
},[])

  return (
    <div className="App">
      <ToastContainer autoClose={3000} theme="dark"/>
     <Routes>
      <Route path='/' element={<SignupPage/>} />
      <Route element={<PrivateRoutes/>}>
      <Route path='/profile' element={<ProfilePage/>} />
      <Route path='/create-podcast' element={<CreatePodcastPage/>} />
      <Route path='/edit-podcast' element={<EditPodcastPage/>} />
      <Route path='/podcasts' element={<PodcastsPage/>}/>
      <Route path='/podcast/:id' element={<PodcastDetails/>}/>
      <Route path='/podcast/:id/create-episode' element={<CreateEpisodePage/>}/>
      </Route>
     </Routes>
    </div>
  );
}

export default App;
