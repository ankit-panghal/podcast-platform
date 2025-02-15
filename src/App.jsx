import './App.css';
import {Routes,Route} from 'react-router-dom'
import SignupLoginPage from './pages/SignupLoginPage';
import ProfilePage from './pages/ProfilePage';
import { ToastContainer} from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import PrivateRoutes from './Components/PrivateRoutes';
import CreatePodcastPage from './pages/CreatePodcastPage';
import PodcastsPage from './pages/PodcastsPage';
import PodcastDetails from './pages/PodcastDetails';
import CreateEpisodePage from './pages/CreateEpisodePage';
import EditPodcastPage from './pages/EditPodcastPage';
import 'react-loading-skeleton/dist/skeleton.css'

function App() {

  return (
    <div className="App">
      <ToastContainer autoClose={3000} theme="dark"/>
     <Routes>
        <Route path='/' element={<SignupLoginPage/>} />
        <Route element={<PrivateRoutes/>}>
          <Route path='/profile' element={<ProfilePage/>} />
          <Route path='/create-podcast' element={<CreatePodcastPage/>} />
          <Route path='/podcast/:id/edit-podcast' element={<EditPodcastPage/>} />
          <Route path='/podcasts' element={<PodcastsPage/>}/>
          <Route path='/podcast/:id' element={<PodcastDetails/>}/>
          <Route path='/podcast/:id/create-episode' element={<CreateEpisodePage/>}/>
        </Route>
          <Route path='/*' element={<h1 className='heading' style={{marginTop : '2rem'}}>Page Not Found...</h1>}/>
     </Routes>
    </div>
  );
}

export default App;
