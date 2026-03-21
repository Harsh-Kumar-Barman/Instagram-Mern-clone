import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, matchPath } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef, lazy, Suspense } from 'react';
import { io } from 'socket.io-client';
import { setOnlineUsers } from './features/userDetail/userDetailsSlice';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import BottomNavigation from './components/BottomNavigation';
import Navbar from './components/Navbar';
import Sidebar from './components/Home/Sidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Lazy loaded page components
const Profile = lazy(() => import('./components/Profile/Profile'));
const Register = lazy(() => import('./components/Auth/Register'));
const Login = lazy(() => import('./components/Auth/Login'));
const Home = lazy(() => import('./components/Home/Home'));
const Explore = lazy(() => import('./components/Explore/Explore'));
const ReelSection = lazy(() => import('./components/Explore/ReelSection'));
const Dashboard = lazy(() => import('./components/Profile/user-dashboard'));
const VideoCall = lazy(() => import('./components/Chat/VideoCall'));

import { ProfileEdit } from './components/Profile/profile-edit';
import { ChatComponent } from './components/Chat/instagram-chat';
import { VideoCallProvider } from './hooks/VideoCallContext';


function ChildApp() {
  const userDetails = useSelector((state) => state.counter.userDetails);
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation(); // Access the current route

  const BASE_URL =
  import.meta.env.VITE_NODE_ENV === "development"
    ? import.meta.env.VITE_API_BASE_URL_DEV
    : import.meta.env.VITE_API_BASE_URL_PROD;
console.log(BASE_URL)
// Initialize the socket connection once user details are available.
useEffect(() => {
  if (userDetails?.id) {
    // Create the socket connection with the backend URL.
    const socket = io(BASE_URL, { query: { userId: userDetails.id } });
    socketRef.current = socket;

    // Set up event listeners.
    socket.on('getOnlineUsers', (onlineUsers) => {
      dispatch(setOnlineUsers(onlineUsers));
    });
    socket?.on('videoCallOffer', async ({ from, offer }) => {
      if (offer.type === 'offer') {
        navigate(`/call/${from}`);
      }
    });

    // Clean up the socket on unmount or when userDetails change.
    return () => {
      socket.disconnect();
      dispatch(setOnlineUsers([]));
    };
  }
}, [userDetails, dispatch, navigate, BASE_URL]);

  // useEffect(() => {
  //   if (userDetails.id) {
  //     const socket = io('http://localhost:5000', {
  //       query: { userId: userDetails.id },
  //     });

  //     socketRef.current = socket;

  //     socket.on('getOnlineUsers', (onlineUsers) => {
  //       dispatch(setOnlineUsers(onlineUsers));
  //     });

  //     socket.on('videoCallOffer', async ({ from, offer }) => {
  //       if (offer.type === 'offer') {
  //         navigate(`/call/${from}`);
  //       }
  //     });

  //     return () => {
  //       socket.disconnect();
  //       dispatch(setOnlineUsers([]));
  //     };
  //   }
  // }, [userDetails, dispatch, navigate]);

  const hideNavbar = ['/login', '/register','/direct/inbox'].includes(location.pathname) || 
  matchPath("/profile/:username", location.pathname) ||
  matchPath("/call/:remoteUserId/", location.pathname) ||
  matchPath("/profile/:username/:reelId", location.pathname);
  

  // Define routes where the Sidebar should be visible, excluding login and register paths
  const showSidebar = ['/','/profile/:username', '/explore', '/reels', '/admindashboard']
    .some((path) => location.pathname.startsWith(path)) && !['/login', '/register','/direct/inbox'].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      {showSidebar && <Sidebar />}
      <Suspense fallback={<div className="h-screen w-full flex items-center justify-center font-semibold">Loading...</div>}>
        <Routes>
          <Route path="/" element={<ProtectedRoute><Home socketRef={socketRef} /></ProtectedRoute>} />
          <Route path="/profile/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/profile/:username/:reelId" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/direct/inbox" element={<ProtectedRoute><ChatComponent socketRef={socketRef} /></ProtectedRoute>} />
          <Route path="/explore/" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
          <Route path="/reels/" element={<ProtectedRoute><ReelSection /></ProtectedRoute>} />
          <Route path="/call/:remoteUserId/" element={<ProtectedRoute><VideoCall userId={userDetails?.id} socketRef={socketRef} /></ProtectedRoute>} />
          <Route path="/accounts/edit/:id" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
          <Route path="/admindashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Suspense>
      <BottomNavigation />
    </>
  );
}

function App() {
  return (
    <Router>
      <ChildApp />
      <ToastContainer />
    </Router>
  );
}

export default App;
