// import { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import CreatePost from './CreatePost';
// import { addUser } from '../features/userDetail/userDetailsSlice';
// import { useDispatch } from 'react-redux';
// import Sidebar from './Sidebar';
// import { IoSettingsOutline } from "react-icons/io5";
// import { MdKeyboardArrowRight } from "react-icons/md";
// import { MdKeyboardArrowLeft } from "react-icons/md";
// import { useNavigate } from 'react-router-dom';
// import myPic from '../assets/myPic.jpeg'

// const Profile = () => {
//   const dispatch = useDispatch()
//   const navigate = useNavigate();
//   const { username } = useParams();
//   const [user, setUser] = useState(null);
//   const [posts, setPosts] = useState([]);



//   const containerRef = useRef(null);

//   const scrollLeft = () => {
//     if (containerRef.current) {
//       containerRef.current.scrollBy({ left: -250, behavior: 'smooth' });
//     }
//   };

//   const scrollRight = () => {
//     if (containerRef.current) {
//       containerRef.current.scrollBy({ left: 250, behavior: 'smooth' });
//     }
//   };

//   const fetchUserData = async () => {
//     try {
//       const res = await axios.get(`/api/users/${username}`);
//       setUser(res.data.user);
//       setPosts(res.data.posts);
//       dispatch(addUser({ fullName: res.data.user.fullName, username: res.data.user.username, email: res.data.user.email, id: res.data.user._id }))
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       const res = await axios.get('/api/logout');
//       if (res.status === 200) {
//         // Perform any additional logout handling here, like redirecting the user
//         console.log('Logged out successfully');
//         navigate('/login');

//       }
//     } catch (err) {
//       console.error('Error during logout:', err);
//     }
//   };

//   useEffect(() => {
//     fetchUserData();
//   }, [username]); 

//   if (!user) return <p>Loading...</p>;

//   return (
//     <div className="flex text-white bg-black min-h-screen">
//       <Sidebar />
//       <div className="profile w-[80.8%] px-[72px] py-[60px] ml-[18.8%]">
//         <div className="inner-profile w-full h-full">
//           <div className="userPic-and-details w-11/12 gap-24 mx-auto flex items-center">
//             <div className="user-Pic">
//               <div className="image w-40 h-40 bg-zinc-600 rounded-full gap-10 items-center ">
//                 <img
//                   src={  myPic} // Replace with default profile picture path
//                   alt={user.username}
//                   className="w-full h-full rounded-full object-cover"
//                 />
//               </div>
//             </div>
//             <div className="userDetail">
//               <div className="flex flex-col gap-5">

//                 <div className="flex items-center space-x-4">
//                   <h2 className="text-2xl cursor-pointer font-bold">{user.username}</h2>
//                   <button className="px-4 py-1 bg-zinc-800 rounded-md text-sm font-semibold">
//                     Edit Profile
//                   </button>
//                   <button className="px-4 py-1 bg-zinc-800 rounded-md text-sm font-semibold">
//                     View archive
//                   </button>
//                   <button onClick={handleLogout}>
//                   <IoSettingsOutline className='cursor-pointer' size={30} />
//                   </button>
//                 </div>
//                 <div className="flex space-x-6 mt-4">
//                   <span>
//                     <strong>{posts.length}</strong> posts
//                   </span>
//                   <span>
//                     <strong>{user.followers?.length || 0}</strong> followers
//                   </span>
//                   <span>
//                     <strong>{user.following?.length || 0}</strong> following
//                   </span>
//                 </div>
//                 <div className="mt-4">
//                   <p className="font-semibold">{user.fullName}</p>
//                   <p className="text-gray-600">{user.bio}</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="createPosts mt-10">
//             <div className="flex flex-wrap items-center gap-4 mt-6">
//               <div className="flex items-center my-5 w-11/12 relative px-3">
//                 <div className="flex overflow-x-auto gap-3 my-5 w-full" ref={containerRef} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
//                   <div className='rounded-full w-24 h-24 p-[.5px] border-[1px] flex items-center justify-center flex-shrink-0 border-zinc-800'>
//                     <div className="add relative flex items-center justify-center">
//                       <div className="vertical h-12 w-[2px] bg-zinc-800 absolute "></div>
//                       <div className="horizontal w-12 h-[2px] bg-zinc-800 absolute"></div>
//                     </div>
//                   </div>
//                   {posts.map(post => (
//                     <div key={post._id} className='rounded-full p-[.5px] border-[1px] flex items-center justify-center flex-shrink-0 border-zinc-800'>
//                       <img src={`http://localhost:5000/${post.image}`} alt="Post" className="w-24 h-24 object-cover rounded-full " />
//                       <p className='border-2 border-zinc-800'>{post.caption}</p>
//                     </div>
//                   ))}
//                 </div>
//                 <button
//                   onClick={scrollLeft}
//                   className="absolute left-11 p-2 bg-[#fff] rounded-full focus:outline-none"
//                   style={{ transform: 'translate(-50%, 0)' }}
//                 >
//                   <span className="material-icons"><MdKeyboardArrowLeft style={{ color: 'rgba(0, 0, 0, 0.5)' }} /></span>
//                 </button>

//                 <button
//                   onClick={scrollRight}
//                   className="absolute right-11 p-2 bg-[#fff] rounded-full focus:outline-none"
//                   style={{ transform: 'translate(50%, 0)' }}
//                 >
//                   <span className="material-icons"><MdKeyboardArrowRight style={{ color: 'rgba(0, 0, 0, 0.5)' }} /></span>
//                 </button>
//               </div>
//               <CreatePost />
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Profile;

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addUser } from '../features/userDetail/userDetailsSlice';
import Sidebar from './Sidebar';
import CreatePost from './CreatePost';
import { IoSettingsOutline } from "react-icons/io5";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import myPic from '../assets/myPic.jpeg';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const containerRef = useRef(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -250, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 250, behavior: 'smooth' });
    }
  };

  const fetchUserData = async () => {
    try {
      const { data } = await axios.get(`/api/users/${username}`);
      setUser(data.user);
      setPosts(data.posts);
      dispatch(addUser({
        fullName: data.user.fullName,
        username: data.user.username,
        email: data.user.email,
        id: data.user._id
      }));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const { status } = await axios.get('/api/logout');
      if (status === 200) {
        console.log('Logged out successfully');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [username]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="flex text-white bg-black min-h-screen">
      <Sidebar />
      <main className="profile w-full lg:w-[80.8%] px-4 sm:px-8 lg:px-[72px] py-[60px] ml-0 lg:ml-[18.8%]">
        <div className="inner-profile w-full h-full">
          <section className="userPic-and-details w-11/12 mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-24">
            <div className="user-Pic">
              <div className="image w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 bg-zinc-600 rounded-full flex items-center justify-center">
                <img
                  src={myPic} // Replace with default profile picture path
                  alt={user.username}
                  className="w-full h-full rounded-full object-top object-cover"
                />
              </div>
            </div>
            <div className="userDetail flex flex-col items-center lg:items-start">
              <div className="flex flex-col gap-3 items-center lg:items-start">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <h2 className="text-xl sm:text-2xl font-bold cursor-pointer">{user.username}</h2>
                  <button className="px-4 py-1 bg-zinc-800 rounded-md text-sm font-semibold">
                    Edit Profile
                  </button>
                  <button className="px-4 py-1 bg-zinc-800 rounded-md text-sm font-semibold">
                    View Archive
                  </button>
                  <button onClick={handleLogout} aria-label="Logout">
                    <IoSettingsOutline className='cursor-pointer' size={30} />
                  </button>
                </div>
                <div className="flex gap-4 sm:gap-16 mt-4">
                  <span>
                    <strong>{posts.length}</strong> posts
                  </span>
                  <span>
                    <strong>{user.followers?.length || 0}</strong> followers
                  </span>
                  <span>
                    <strong>{user.following?.length || 0}</strong> following
                  </span>
                </div>
                <div className="mt-4 text-center lg:text-left">
                  <p className="font-semibold">{user.fullName}</p>
                  <p className="text-gray-600">{user.bio}</p>
                </div>
              </div>
            </div>
          </section>
          <section className="createPosts mt-10">
            <div className="flex flex-col items-center lg:flex-row lg:flex-wrap gap-4 mt-6">
              <div className="flex items-center my-5 relative w-full px-3">
                <div
                  className="flex overflow-x-auto gap-3 my-5 w-full"
                  ref={containerRef}
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <div className='rounded-full w-20 h-20 sm:w-24 sm:h-24 p-[.5px] border border-zinc-800 flex items-center justify-center flex-shrink-0'>
                    <div className="add relative flex items-center justify-center">
                      <div className="vertical h-10 sm:h-12 w-[2px] bg-zinc-800 absolute"></div>
                      <div className="horizontal w-10 sm:w-12 h-[2px] bg-zinc-800 absolute"></div>
                    </div>
                  </div>
                  {posts.map(post => (
                    <div key={post._id} className='rounded-full p-[.5px] border border-zinc-800 flex items-center justify-center flex-shrink-0'>
                      <img
                        src={`http://localhost:5000/${post.image}`}
                        alt={post.caption}
                        className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-full"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={scrollLeft}
                  className="absolute left-2 sm:left-8 lg:left-11 p-2 bg-white rounded-full focus:outline-none"
                  aria-label="Scroll Left"
                >
                  <MdKeyboardArrowLeft className="text-black" size={24} />
                </button>
                <button
                  onClick={scrollRight}
                  className="absolute right-2 sm:right-8 lg:right-11 p-2 bg-white rounded-full focus:outline-none"
                  aria-label="Scroll Right"
                >
                  <MdKeyboardArrowRight className="text-black" size={24} />
                </button>
              </div>
              <CreatePost />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Profile;
