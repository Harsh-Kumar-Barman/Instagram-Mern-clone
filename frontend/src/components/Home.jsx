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
  const followingUsers = useSelector((state) => state.counter.following) || [];
  const [followingUserss, setFollowingUserss] = useState();
  const userDetails = useSelector((state) => state.counter.userDetails);
  const dispatch = useDispatch();
  const fetchPosts = async () => {
    try {
      const { data: posts } = await axios.get('/api/posts/getPosts');
      setAllPosts(posts.reverse());
    } catch (error) {
      console.error('Error fetching posts:', error);
    }

  };

  useEffect(() => {
    fetchPosts();
    getFollowing();
    getSavePosts();
  }, [setAllPosts, setFollowingUserss, setSavedPost, open]);

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
      fetchPosts();
    }
  };

  const getSavePosts = async () => {
    const userId = userDetails.id;

    try {
      const { data: { savedPosts } } = await axios.get(`/api/posts/${userId}/save`);
      dispatch(setSavedPosts(savedPosts));
      setSavedPost(savedPosts);
    } catch (error) {
      console.error('Error saving the post:', error);
    } finally {
      fetchPosts();
    }
  };

  const showComments = (e, post) => {
    e.preventDefault();
    setOpen(true)
    dispatch(setSelectedPost(post));
  };

  const getFollowing = async () => {
    const response = await axios.get(`/api/users/${userDetails.id}/following`)
    const following = response.data.following
    dispatch(setFollowing([...following]));
    setFollowingUserss(following)
  }

  const handleFollowing = async (e, followingID) => {
    e.preventDefault();
    const userId = userDetails.id;

    try {
      const { data: { following, followers } } = await axios.put(`/api/users/${userId}/following`, { followingID });
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
    <div className="relative flex gap-12 text-white">
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

      <div className="hidden lg:flex flex-col gap-6 w-[25%] mt-8">
        <AccountInfo userDetails={userDetails} />
        <SuggestedUsers allPosts={allPosts} />
      </div>
    </div>
  );
};

export default Home;
