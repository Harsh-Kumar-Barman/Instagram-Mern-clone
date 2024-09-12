import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../features/userDetail/userDetailsSlice';
import Sidebar from './Sidebar';
import CreatePost from './CreatePost';
import { IoSettingsOutline } from "react-icons/io5";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
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
      setProfile(data?.user?.profilePicture)
      setUser(data.user);
      setPosts(data.posts);
      const profilePic= data?.user?.profilePicture
      dispatch(addUser({
        fullName: data?.user?.fullName,
        username: data?.user?.username,
        email: data?.user?.email,
        id: data?.user?._id,
        profilePic:profilePic
      }));
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const { status } = await axios.get('/api/auth/logout');
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
                  src={`http://localhost:5000/${profile}`} // Replace with default profile picture path
                  alt={user.username}
                  className="w-full h-full rounded-full object-top object-cover"
                />
              </div>
            </div>
            <div className="userDetail flex flex-col items-center lg:items-start">
              <div className="flex flex-col gap-3 items-center lg:items-start">
                <div className="flex items-center space-x-2 sm:space-x-4">
                  <h2 className="text-xl sm:text-2xl font-bold cursor-pointer">{user.username}</h2>
                  <Link to={`/accounts/edit/${user?._id}`}>
                  <button className="px-4 py-1 bg-zinc-800 rounded-md text-sm font-semibold">
                    Edit Profile
                  </button>
                  </Link>
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
                  <p className="text-zinc-200">{user.bio}</p>
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
                        src={`http://localhost:5000/${post.mediaPath}`}
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
