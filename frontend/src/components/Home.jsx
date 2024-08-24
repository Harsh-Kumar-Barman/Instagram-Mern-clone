import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { FaRegHeart } from "react-icons/fa";
import { IoChatbubbleOutline } from "react-icons/io5";
import { FiSend } from "react-icons/fi";
import { GoBookmark } from "react-icons/go";
import { GoBookmarkFill } from "react-icons/go";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import myPic from '../assets/myPic.jpeg';
import { Link } from 'react-router-dom';
import Comment from './PostComment';
import { FaHeart } from "react-icons/fa";
import { setFollower, setFollowing, setSavedPosts, setSelectedPost } from '../features/userDetail/userDetailsSlice';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [comment, setComment] = useState('');
  const [open, setOpen] = useState(false)
  const userDetails = useSelector((state) => state.counter.userDetails);
  const savedPosts = useSelector((state) => state.counter.savedPosts);
  const followingUsers = useSelector((state) => state.counter.following);
  const containerRef = useRef(null);
  const [savedPost, setSavedPost] = useState([...savedPosts])
  const [followingUserss, setFollowingUserss] = useState([...followingUsers])
  const dispatch = useDispatch()
// console.log(followingUserss)
  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(`/api/${userDetails.username}/posts`);
      const dataa = await axios.get('/api/posts');
      // console.log(dataa.data[0].author)
      setAllPosts(dataa.data.reverse());
      setPosts(data.posts.reverse());
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await axios.post(`/api/posts/${postId}/comment`, {
        userId: userDetails.id,
        text: comment,
      });
      setComment('');
      fetchPosts(); // Refresh posts to show the new comment
    } catch (error) {
      console.error('Error adding comment:', error);
      setComment('');
    }
  };

  const handleLike = async (e, postId) => {
    e.preventDefault();
    const userId = userDetails.id;
    try {
      const response = await axios.put(`/api/posts/${postId}/like`, {
        userId,
      });
    } catch (error) {
      console.error('Error liking/unliking the post:', error);
    } finally {
      fetchPosts();
    }
  };

  const handleFollowing = async (e,followingID) => {
    e.preventDefault();
    // console.log('postId : : ',followingID)
    const userId = userDetails.id;
    try {
      const response = await axios.put(`/api/user/${userId}/following`,{
        followingID
      });
      // console.log(response.data)
      const following=response.data.following
      const followers=response.data.followers
      dispatch(setFollowing(following))
      dispatch(setFollower(followers))
      setFollowingUserss([...following])
       
    } catch (error) {
      console.error('Error liking/unliking the post:', error);
    } finally {
      fetchPosts();
    }
  };

  const getFollowing = async ( ) => { 
    const userId = userDetails.id;
    try {
      const response = await axios.get(`/api/user/${userId}/following` );
      // console.log(response.data.following)
      const following=response.data.following
      const followers=response.data.followers
      dispatch(setFollowing(following))
      dispatch(setFollower(followers))
      setFollowingUserss([...following])
       
    } catch (error) {
      console.error('Error liking/unliking the post:', error);
    } finally {
      fetchPosts();
    }
  };

  const handleSavePosts = async (e, postId) => {
    e.preventDefault();
    const userId = userDetails.id;
    try {
      const response = await axios.put(`/api/posts/${userId}/save`, {
        postId,
      });
      console.log(response.data.savedPosts)
      const savedPosts = response.data.savedPosts
      dispatch(setSavedPosts(savedPosts))
      setSavedPost([...savedPosts])
  
    } catch (error) {
      console.error('Error liking/unliking the post:', error);
    } finally {
      fetchPosts();
    }
  };

  const getSavePosts = async (e) => {
    // e.preventDefault();
    const userId = userDetails.id;
    try {
      const response = await axios.get(`/api/posts/${userId}/save`);
      const savedPosts = response.data.savedPosts
      dispatch(setSavedPosts(savedPosts))
      setSavedPost([...savedPosts])
       
    } catch (error) {
      console.error('Error liking/unliking the post:', error);
    } finally {
      fetchPosts();
    }
  };

  const scrollContainer = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const showComments = (e, post) => {
    e.preventDefault()
    setOpen(true)
    dispatch(setSelectedPost(post))
    // console.log(id)
  }


  useEffect(() => {
    fetchPosts();
    getFollowing()
    getSavePosts()
  }, [open]);


  return (
    <>
      <div className="main w-full min-h-screen bg-black text-white">
        <Comment open={open} setOpen={setOpen} func={fetchPosts} />
        <Sidebar />
        <main className="main section w-full flex justify-center ml-0 lg:w-[81.2%] lg:ml-[18.8%] min-h-screen">
          <section className="section flex flex-col lg:flex-row justify-center w-full min-h-screen ">
            <div className="reels w-full lg:w-[100%] max-w-[630px] min-h-screen">
              <div className="my-6">
                <section className="relative flex items-center justify-center w-[90vw] sm:w-[80vw] md:w-[60vw] lg:w-[45vw] mx-auto">
                  <div
                    ref={containerRef}
                    className="flex w-full gap-4 px-2 overflow-x-auto"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((num) => (
                      <div key={num} className="flex-shrink-0 flex items-center justify-center w-[60px] h-[60px] rounded-full bg-zinc-500">
                        {num}
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => scrollContainer('left')}
                    className="hidden sm:inline-block absolute -left-4 md:-left-6 p-2 bg-white rounded-full"
                  >
                    <MdKeyboardArrowLeft className="text-gray-500" />
                  </button>

                  <button
                    onClick={() => scrollContainer('right')}
                    className="hidden sm:inline-block absolute right-4 md:right-6 p-2 bg-white rounded-full"
                  >
                    <MdKeyboardArrowRight className="text-gray-500" />
                  </button>
                </section>
                <section className="mt-14 mx-auto w-[100vw] sm:w-[80vw] md:w-[60vw] lg:w-[468px]">
                  {allPosts.map((post) => (
                    <article key={post._id} className="mb-6 border-b border-zinc-800">
                      <header className="flex items-center gap-2">
                        <div className="w-[42px] h-[42px] border border-zinc-500 rounded-full overflow-hidden p-0.5">
                          <img className="w-full h-full rounded-full object-cover" src={myPic} alt={post.author.username} />
                        </div>
                        <h2 className="text-sm font-bold flex items-center">{post.author.username}.</h2>
                        <button onClick={(e)=>handleFollowing(e,post.author._id)}>
                          <h2 className="text-sm font-bold text-sky-500"> 
                            {userDetails.id===post.author._id?"":followingUserss?.includes(post.author._id)?"Unfollow":"Follow"}
                            </h2>
                        </button>
                      </header>

                      <figure className="mt-2 w-full h-[90vh] sm:h-[400px] md:h-[500px] lg:h-[585px] border-[.1px] border-zinc-800 flex justify-center items-center rounded-md overflow-hidden">
                        <img onDoubleClick={(e) => handleLike(e, post._id)} src={`http://localhost:5000/${post.image}`} alt={post.caption} className={`object-cover ${post.imageWidth > 468 ? 'w-full' : `w-[${post.imageWidth}px]`} ${post.imageHeight > 585 ? 'h-full' : `h-[${post.imageHeight}px]`} `} />
                      </figure>

                      <div className="flex justify-between items-center mt-4 px-2">
                        <div className="flex gap-3">
                          <button onClick={(e) => handleLike(e, post._id)}>
                            {post.likes.includes(userDetails.id) ? <FaHeart size={25} className="text-red-500" /> : <FaRegHeart size={25} className="hover:text-zinc-500 transition-colors duration-100" />}
                          </button>
                          <button onClick={(e) => showComments(e, post)}>
                            <IoChatbubbleOutline className="hover:text-zinc-500 transition-colors duration-100" size={25} style={{ transform: 'scaleX(-1)' }} />
                          </button>
                          <FiSend size={25} className="hover:text-zinc-500 transition-colors duration-100" />
                        </div>
                        <button onClick={(e) => handleSavePosts(e, post._id)}>
                          {savedPost?.includes(post._id) ? <GoBookmarkFill size={25} className='text-white' /> : <GoBookmark size={25} className="hover:text-zinc-500 transition-colors duration-100" />}

                        </button>
                      </div>

                      <div className="my-3 text-sm font-semibold  px-2">
                        <p>{post.likes.length} likes</p>
                        <p>{post.caption}</p>
                      </div>

                      <div className=' px-2'>
                        {post.comments.length > 0 && (
                          <button onClick={(e) => showComments(e, post)} className="text-zinc-400 text-sm cursor-pointer">
                            View all {post.comments.length} comments
                          </button>
                        )}

                        <form onSubmit={(e) => handleCommentSubmit(e, post._id)} className="flex items-center pt-2 pb-4">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="flex-1 bg-transparent outline-none text-sm"
                          />
                          <button
                            type="submit"
                            className={`text-blue-500 font-semibold text-sm ${!comment.trim() && 'hidden'}`}
                            disabled={!comment.trim()}
                          >
                            Post
                          </button>
                        </form>


                      </div>
                    </article>
                  ))}
                </section>
              </div>
            </div>
            <aside className="hidden sm:block account w-full lg:w-[378px] h-full lg:h-screen">
              <div className="side my-8 pl-8 h-full lg:h-[960px] mt-8">
                <div className="myAccoount flex flex-col gap-8">
                  <div className="details flex justify-between items-center">
                    <div className="imgAbt flex items-center gap-5">
                      <Link to={`/profile/${userDetails.username}`}>
                        <div className="image w-12 h-12 rounded-full overflow-hidden">
                          <img className='w-full h-full object-cover' src={myPic} alt="" />
                        </div>
                      </Link>
                      <div className="abt">
                        <h2 className="font-semibold">{userDetails.username}</h2>
                        <p className="text-sm font-light">{userDetails.name}</p>
                      </div>
                    </div>
                    <div className="switch">
                      <Link to="/accounts">
                        <p className="text-sky-500 font-bold text-xs cursor-pointer">Switch</p>
                      </Link>
                    </div>
                  </div>
                  <div className="suggest flex justify-between items-center">
                    <p className="font-semibold text-zinc-500">Suggested for you</p>
                    <p className="font-semibold text-sm cursor-pointer">See All</p>
                  </div>
                  <div className="accounts flex flex-col gap-5">
                    {allPosts.map((post, index) => (
                      <div key={index} className="acc flex justify-between items-center">
                        <div className="imgAbout flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full overflow-hidden">
                            <img className="w-full h-full object-cover" src={`http://localhost:5000/${post.image}`} alt={post.author.username} />
                          </div>
                          <div className="about">
                            <h2 className="text-sm font-semibold">{post.author.username}</h2>
                            <p className="text-xs text-zinc-400">New to Instagram</p>
                          </div>
                        </div>
                        <div className="follow">
                          <p className="text-sky-500 font-bold text-xs cursor-pointer">Follow</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </section>
        </main>
      </div>
    </>
  );
};

export default Home;
