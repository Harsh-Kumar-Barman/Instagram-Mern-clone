// // Home.js
// import React, { useEffect, useState } from 'react';
// import Sidebar from './Sidebar';
// import PostList from './PostList';
// import Reels from './Reels';
// import SuggestedUsers from './SuggestedUsers';
// import AccountInfo from './AccountInfo';
// import axios from 'axios';
// import { useSelector } from 'react-redux';

// const Home = () => {
//   const [allPosts, setAllPosts] = useState([]);
//   // const [userDetails, setUserDetails] = useState({});
//   const userDetails = useSelector((state) => state.counter.userDetails);
//   const [savedPost, setSavedPost] = useState([]);
//   const [followingUserss, setFollowingUserss] = useState([]);

//   useEffect(() => {
//     // Fetch posts and user details here
//     const fetchPostsAndUserDetails = async () => {
//       const posts = await axios.get('/api/posts');
//       // const user = await axios.get('/api/user');
//       setAllPosts(posts.data);
//       // setUserDetails(user.data);
//       // setSavedPost(user.data.savedPosts || []);
//       // setFollowingUserss(user.data.following || []);
//     };
//     fetchPostsAndUserDetails();
//   }, []);

//   const handleLike =async (e, postId) => {
//     // Handle post like
//     e.preventDefault();
//     const userId = userDetails.id;
//     try {
//       const response = await axios.put(`/api/posts/${postId}/like`, {
//         userId,
//       });
//     } catch (error) {
//       console.error('Error liking/unliking the post:', error);
//     } finally {
//       fetchPosts();
//     }
//   };

//   const handleSavePosts = async(e, postId) => {
//     // Handle save post
//     e.preventDefault();
//     const userId = userDetails.id;
//     try {
//       const response = await axios.put(`/api/posts/${userId}/save`, {
//         postId,
//       });
//       console.log(response.data.savedPosts)
//       const savedPosts = response.data.savedPosts
//       dispatch(setSavedPosts(savedPosts))
//       setSavedPost([...savedPosts])
  
//     } catch (error) {
//       console.error('Error liking/unliking the post:', error);
//     } finally {
//       fetchPosts();
//     }
//   };

//   const showComments = (e, post) => {
//     // Handle show comments
//     e.preventDefault()
//     setOpen(true)
//     dispatch(setSelectedPost(post))
//   };

//   const handleFollowing = async(e, followingID) => {
//     // Handle follow/unfollow
//     e.preventDefault();
//     // console.log('postId : : ',followingID)
//     const userId = userDetails.id;
//     try {
//       const response = await axios.put(`/api/user/${userId}/following`,{
//         followingID
//       });
//       // console.log(response.data)
//       const following=response.data.following
//       const followers=response.data.followers
//       dispatch(setFollowing(following))
//       dispatch(setFollower(followers))
//       setFollowingUserss([...following])
       
//     } catch (error) {
//       console.error('Error liking/unliking the post:', error);
//     } finally {
//       fetchPosts();
//     }
//   };

//   return (
//     <div className="relative flex gap-8">
//       <Sidebar />

//       <div className="w-[100%] md:w-[60%] lg:w-[50%] flex flex-col gap-6 lg:ml-[18.8%] mt-5 ">
//         <Reels />
//         <PostList
//           allPosts={allPosts}
//           userDetails={userDetails}
//           savedPost={savedPost}
//           followingUserss={followingUserss}
//           handleLike={handleLike}
//           handleSavePosts={handleSavePosts}
//           showComments={showComments}
//           handleFollowing={handleFollowing}
//         />
//       </div>

//       <div className="hidden lg:flex flex-col gap-6 w-[25%] mt-5">
//         <AccountInfo userDetails={userDetails} />
//         <SuggestedUsers allPosts={allPosts} />
//       </div>
//     </div>
//   );
// };

// export default Home;


import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import PostList from './PostList';
import Reels from './Reels';
import SuggestedUsers from './SuggestedUsers';
import AccountInfo from './AccountInfo';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setSavedPosts, setFollowing, setFollower, setSelectedPost } from '../features/userDetail/userDetailsSlice'; // Adjust paths as necessary
import PostComment from './PostComment';

const Home = () => {
  const [allPosts, setAllPosts] = useState([]);
  const [open, setOpen] = useState(false)
  const [savedPost, setSavedPost] = useState([]);
  const savedPosts = useSelector((state) => state.counter.savedPosts);
  const followingUsers = useSelector((state) => state.counter.following);
  const [followingUserss, setFollowingUserss] = useState([...followingUsers]);
  
  const userDetails = useSelector((state) => state.counter.userDetails);
  const dispatch = useDispatch();


  const fetchPosts = async () => {
    try {
      const { data: posts } = await axios.get('/api/posts');
      setAllPosts(posts.reverse()); 
    } catch (error) {
      console.error('Error fetching posts:', error);
    }

  };

  useEffect(() => { 
    fetchPosts();

    console.log(allPosts[0] )
  }, []);

  const handleLike = async (e, postId) => {
    e.preventDefault();
    const userId = userDetails.id;

    try {
      await axios.put(`/api/posts/${postId}/like`, { userId });
    } catch (error) {
      console.error('Error liking the post:', error);
    } finally {
      fetchPosts();
    }
  };

  const handleSavePosts = async (e, postId) => {
    e.preventDefault();
    const userId = userDetails.id;

    try {
      const { data: { savedPosts } } = await axios.put(`/api/posts/${userId}/save`, { postId });
      dispatch(setSavedPosts(savedPosts));
      setSavedPost(savedPosts);
    } catch (error) {
      console.error('Error saving the post:', error);
    } finally {
      // console.log('first filan')
      fetchPosts();
    }
  };

  const showComments = (e, post) => {
    e.preventDefault();
    setOpen(true)
    dispatch(setSelectedPost(post));
  };

  const handleFollowing = async (e, followingID) => {
    e.preventDefault();
    const userId = userDetails.id;

    try {
      const { data: { following, followers } } = await axios.put(`/api/user/${userId}/following`, { followingID });
      dispatch(setFollowing(following));
      dispatch(setFollower(followers));
      setFollowingUserss(following);
    } catch (error) {
      console.error('Error following/unfollowing the user:', error);
    } finally {
      fetchPosts();
    }
  };

  const handleCommentSubmit = async (e, postId, comment) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await axios.post(`/api/posts/${postId}/comment`, {
        userId: userDetails.id,
        text: comment,
      });
     
      fetchPosts(); // Refresh posts to show the new comment
    } catch (error) {
      console.error('Error adding comment:', error);
       
    }
  };
 

  return (
    <div className="relative flex gap-8 text-white">
      <Sidebar />
      <PostComment open={open} setOpen={setOpen} func={fetchPosts} />
      <div className="w-[100%] md:w-[60%] lg:w-[50%] flex flex-col gap-6 lg:ml-[18.8%] mt-16 sm:mt-5">
        <Reels />
        <PostList
          allPosts={allPosts}
          userDetails={userDetails}
          savedPost={savedPosts}
          followingUserss={followingUserss}
          handleLike={handleLike}
          handleSavePosts={handleSavePosts}
          showComments={showComments}
          handleFollowing={handleFollowing}
          handleCommentSubmit={handleCommentSubmit}
        />
      </div>

      <div className="hidden lg:flex flex-col gap-6 w-[25%] mt-5">
        <AccountInfo userDetails={userDetails} />
        <SuggestedUsers allPosts={allPosts} />
      </div>
    </div>
  );
};

export default Home;
