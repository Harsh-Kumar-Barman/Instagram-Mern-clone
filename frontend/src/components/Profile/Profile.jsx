import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setFollower, setFollowing, setSelectedPost } from '../../features/userDetail/userDetailsSlice';
import Sidebar from '../Home/Sidebar';
import CreatePost from './CreatePost';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookmarkIcon, Clapperboard, EyeIcon, GridIcon, MessageCircle, MoreHorizontal, Settings, SettingsIcon, UserIcon } from "lucide-react"
import { FaHeart } from 'react-icons/fa';
import { InstagramProfileSkeletonComponent } from './instagram-profile-skeleton';
import { IoChatbubbleSharp } from 'react-icons/io5';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import PostComment from '../Home/PostComment';
import StoryUpload from '../StoryUpload';
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';


const BASE_URL =
import.meta.env.VITE_NODE_ENV === "development"
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD;


const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { username, reelId } = useParams();
  
  const [selectedMedia, setSelectedMedia] = useState(null); 
  const [isDialogOpen, setIsDialogOpen] = useState(false);  
  
  const userDetails = useSelector((state) => state.counter.userDetails);
  const following = useSelector((state) => state.counter.following);
  const watchHistory = useSelector((state) => state.counter.watchHistory);
  let watchHistoryy = Object.values(watchHistory);

  // 1. Fetch Following Users (useQuery)
  const { data: followingUserss } = useQuery({
    queryKey: ['following', userDetails.id],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE_URL}/api/users/${userDetails.id}/following`);
      return data?.user?.following || [];
    },
    enabled: !!userDetails.id
  });

  useEffect(() => {
    if (followingUserss) {
      dispatch(setFollowing([...followingUserss]));
    }
  }, [followingUserss, dispatch]);

  // Fetch Saved Posts
  // const { data: savedPosts } = useQuery({
  //   queryKey: ['savedPosts', userDetails.id],
  //   queryFn: async () => {
  //     const { data } = await axios.get(`${BASE_URL}/api/posts/getSavedPosts/${userDetails.id}`);
  //     return data;
  //   },
  //   enabled: !!userDetails.id && userDetails.id === userID
  // });

  // 2. Fetch Profile Data (useInfiniteQuery)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['profile', username],
    queryFn: async ({ pageParam = 0 }) => {
      console.log(BASE_URL, username, pageParam);
      const { data } = await axios.get(`${BASE_URL}/api/users/${username}?page=${pageParam}&limit=10`);
      return data;
    },
    getNextPageParam: (lastPage, allPages) => lastPage.posts.length === 10 ? allPages.length : undefined,
    enabled: !!username,
  });

  const user = data?.pages[0]?.user;
  const userID = user?._id;
  const profilePicture = user?.profilePicture;
  const postsArr = data?.pages.flatMap(page => page.posts) || [];

  const watched = postsArr.filter(post =>
    watchHistoryy[0]?.some(savepost => savepost.postId === post?._id)
  );

  const { data: savedPosts } = useQuery({
    queryKey: ['savedPosts', userDetails.id],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE_URL}/api/posts/getSavedPosts/${userDetails.id}`);
      return data;
    },
    enabled: !!userDetails.id && userDetails.id === userID
  });

  const handleLogout = async () => {
    try {
      const { status } = await axios.get(`${BASE_URL}/api/auth/logout`);
      if (status === 200) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const showComments = (e, post) => {
    e.preventDefault();
    setSelectedMedia(post);
    setIsDialogOpen(true);
    dispatch(setSelectedPost(post));
  };


  // 3. Mutations
  const deleteMutation = useMutation({
    mutationFn: async (postId) => {
      const response = await axios.delete(`${BASE_URL}/api/posts/delete/${postId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
    }
  });

  const handleDeletePost = (e, postId) => {
    e.preventDefault();
    deleteMutation.mutate(postId);
  }

  const followMutation = useMutation({
    mutationFn: async (followingID) => {
      const { data } = await axios.put(`${BASE_URL}/api/users/${userDetails.id}/following`, { followingID });
      return data;
    },
    onSuccess: ({ following, followers }) => {
      dispatch(setFollowing(following));
      dispatch(setFollower(followers));
      queryClient.invalidateQueries({ queryKey: ['following', userDetails.id] });
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
    }
  });

  const handleFollowing = (e, followingID) => {
    e.preventDefault();
    followMutation.mutate(followingID);
  };

  const reelPart = useCallback(() => {
    const reelElement = document.getElementById(reelId);
    if (reelElement) {
      reelElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [reelId]);

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.offsetHeight - 100) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (reelId && postsArr.length) {
      reelPart();
    }
  }, [reelId, postsArr.length, reelPart]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (isLoading || !user) return <InstagramProfileSkeletonComponent />;

  return (
    <div className="flex flex-col min-h-screen bg-transparent text-on-surface">
      <PostComment selectedMedia={selectedMedia} isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
      {/* Main content */}
      <main className="profile flex-grow sm:px-8 lg:px-[72px] py-[60px] lg:ml-[14.5%]">
        <div className="w-full mx-auto">
          {/* Profile info */}
          <section className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-16 mb-12 sm:px-4 md:px-0">
            <div className="relative flex-shrink-0 group">
              <div className="w-24 h-24 md:w-40 md:h-40 rounded-full p-1 bg-gradient-to-tr from-tertiary to-primary">
                <div className="w-full h-full rounded-full border-4 border-surface overflow-hidden">
                  <img src={profilePicture || "/placeholder.svg?height=128&width=128"} alt={`${user.username}`} className="w-full h-full object-cover object-top" />
                </div>
              </div>
            </div>
            
            <div className="flex-1 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <h2 className="text-2xl font-display font-extrabold tracking-tight text-on-surface">@{user.username}</h2>
                <div className="flex gap-2">
                  {userDetails?.id === userID ? (
                    <>
                      <Link to={`/accounts/edit/${user?._id}`}>
                        <button className="px-6 py-2 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-bold text-sm shadow-sm hover:opacity-90 transition-all active:scale-95">Edit profile</button>
                      </Link>
                      <button className="hidden sm:block px-6 py-2 rounded-full bg-surface-container-high text-on-surface font-bold text-sm hover:bg-surface-container-highest transition-colors active:scale-95">Archive</button>
                      <Link to={`/admindashboard`}>
                        <button className="px-6 py-2 rounded-full bg-surface-container-high text-on-surface font-bold text-sm hover:bg-surface-container-highest transition-colors active:scale-95">Admin</button>
                      </Link>
                      <button onClick={handleLogout} className="p-2 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-container-highest transition-colors active:scale-95">
                        <SettingsIcon className="h-5 w-5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={(e) => handleFollowing(e, userID)} className="px-6 py-2 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-bold text-sm shadow-sm hover:opacity-90 transition-all active:scale-95">{followingUserss?.includes(userID) ? "Following" : "Follow"}</button>
                      <Link to="/direct/inbox">
                        <button className="px-6 py-2 rounded-full bg-surface-container-high text-on-surface font-bold text-sm hover:bg-surface-container-highest transition-colors active:scale-95">Message</button>
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <div className="flex gap-8 md:gap-12 border-y md:border-none border-surface-container py-4 md:py-0">
                <div className="flex flex-col md:flex-row md:gap-2 items-baseline">
                  <span className="text-lg font-bold text-on-surface">{postsArr.length}</span>
                  <span className="text-sm text-secondary">posts</span>
                </div>
                {userDetails?.id === userID ?
                  <div className="flex flex-col md:flex-row md:gap-2 items-baseline">
                    <span className="text-lg font-bold text-on-surface">{user.followers?.length || 0}</span>
                    <span className="text-sm text-secondary">followers</span>
                  </div>
                  :
                  <div className="flex flex-col md:flex-row md:gap-2 items-baseline">
                    <span className="text-lg font-bold text-on-surface">{following?.length || 0}</span>
                    <span className="text-sm text-secondary">followers</span>
                  </div>
                }
                <div className="flex flex-col md:flex-row md:gap-2 items-baseline">
                  <span className="text-lg font-bold text-on-surface">{user.following?.length || 0}</span>
                  <span className="text-sm text-secondary">following</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-display font-bold text-on-surface">{user.fullName}</h3>
                <p className='text-secondary max-w-md leading-relaxed'>{user.bio || "No bio available"}</p>
              </div>
            </div>
          </section>

          {/* Story highlights */}
          <div className="mb-6 overflow-x-auto">
            <div className="flex gap-4">
              {userDetails?.id === userID && (
                <>
                  <StoryUpload />
                </>
              )}
            </div>
          </div>

          {/* Post Tabs */}
          <section className="mt-10 w-full h-auto">
            <Tabs defaultValue="posts" className="w-full h-full">
              <TabsList className="w-full justify-center bg-transparent border-t border-surface-container h-14 md:gap-20 gap-8">
                <TabsTrigger value="posts" className="flex items-center gap-2 py-4 border-t-2 border-transparent data-[state=active]:border-on-surface data-[state=active]:text-on-surface -mt-[1px] text-secondary hover:text-on-surface transition-all rounded-none bg-transparent shadow-none">
                  <GridIcon className="w-4 h-4 hidden md:block" />
                  <span className="text-[10px] font-label font-bold uppercase tracking-[0.2em]">Posts</span>
                </TabsTrigger>
                {userDetails.id === userID ? (
                  <TabsTrigger value="saved" className="flex items-center gap-2 py-4 border-t-2 border-transparent data-[state=active]:border-on-surface data-[state=active]:text-on-surface -mt-[1px] text-secondary hover:text-on-surface transition-all rounded-none bg-transparent shadow-none">
                    <BookmarkIcon className="w-4 h-4 hidden md:block" />
                    <span className="text-[10px] font-label font-bold uppercase tracking-[0.2em]">Saved</span>
                  </TabsTrigger>
                ) : (
                  <TabsTrigger value="saved" className="flex items-center gap-2 py-4 border-t-2 border-transparent data-[state=active]:border-on-surface data-[state=active]:text-on-surface -mt-[1px] text-secondary hover:text-on-surface transition-all rounded-none bg-transparent shadow-none">
                    <Clapperboard className="w-4 h-4 hidden md:block" />
                    <span className="text-[10px] font-label font-bold uppercase tracking-[0.2em]">Reels</span>
                  </TabsTrigger>
                )}
                <TabsTrigger value="tagged" className="flex items-center gap-2 py-4 border-t-2 border-transparent data-[state=active]:border-on-surface data-[state=active]:text-on-surface -mt-[1px] text-secondary hover:text-on-surface transition-all rounded-none bg-transparent shadow-none">
                  <UserIcon className="w-4 h-4 hidden md:block" />
                  <span className="text-[10px] font-label font-bold uppercase tracking-[0.2em]">Tagged</span>
                </TabsTrigger>
                {userDetails.id !== userID && (
                  <TabsTrigger value="watched" className="flex items-center gap-2 py-4 border-t-2 border-transparent data-[state=active]:border-on-surface data-[state=active]:text-on-surface -mt-[1px] text-secondary hover:text-on-surface transition-all rounded-none bg-transparent shadow-none">
                    <EyeIcon className="w-4 h-4 hidden md:block" />
                    <span className="text-[10px] font-label font-bold uppercase tracking-[0.2em]">Watched</span>
                  </TabsTrigger>
                )}
              </TabsList>

              {/* Posts Tab Content */}
              <TabsContent value="posts" className="w-full h-full">
                <div className="grid grid-cols-3 gap-1 md:gap-8 mt-4 md:mt-8 mb-20 w-full h-full px-2 md:px-0">
                  {postsArr.map((post, index) => (
                    <div onClick={e => showComments(e, post)} key={post._id} className={`group relative overflow-hidden rounded-xl bg-surface-container-low cursor-pointer aspect-square ${index === 0 ? 'col-span-2 row-span-2' : 'col-span-1'}`}>
                      {post?.media[0]?.mediaType === 'image' ? (
                        <img src={`${post?.media[0]?.mediaPath}`} alt={post.caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                      ) : (
                        <video src={`${post?.media[0]?.mediaPath}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      )}

                      {/* Dropdown menu positioned at top-right */}
                      <div className="absolute top-2 right-2 z-20">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white hover:bg-black/20">
                              <MoreHorizontal className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40 md:w-80">
                            <DropdownMenuItem onClick={e => handleDeletePost(e, post?._id)} className="text-error justify-center font-bold focus:text-error cursor-pointer">Delete</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="justify-center cursor-pointer">Add to favorites</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="justify-center cursor-pointer">Share to...</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="justify-center cursor-pointer">Copy link</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="justify-center cursor-pointer">Cancel</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold pointer-events-none">
                        <div className="flex items-center gap-2"><FaHeart className='w-6 h-6' /> {post?.likes?.length || 0}</div>
                        <div className="flex items-center gap-2"><IoChatbubbleSharp className="w-6 h-6 -rotate-90" /> {post?.comments?.length || 0}</div>
                      </div>
                    </div>
                  ))}
                  {isFetchingNextPage && <InstagramProfileSkeletonComponent />}
                </div>
              </TabsContent>

              {/* Other Tabs Content (saved, tagged, watched) */}
              <TabsContent value="saved" className="w-full h-full">
                {savedPosts && savedPosts.length > 0 ? (
                  <div className="grid grid-cols-3 gap-1 md:gap-8 mt-4 md:mt-8 mb-20 w-full h-full px-2 md:px-0">
                    {savedPosts.map((post, index) => (
                      <div onClick={e => showComments(e, post)} key={post._id} className={`group relative overflow-hidden rounded-xl bg-surface-container-low cursor-pointer aspect-square ${index === 0 ? 'col-span-2 row-span-2' : 'col-span-1'}`}>
                        {post?.media[0]?.mediaType === 'image' ? (
                          <img src={`${post?.media[0]?.mediaPath}`} alt={post.caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                        ) : (
                          <video src={`${post?.media[0]?.mediaPath}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        )}

                        <div className="absolute top-2 right-2 z-20">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-white hover:bg-black/20">
                                <MoreHorizontal className="w-5 h-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 md:w-80">
                              <DropdownMenuItem className="justify-center cursor-pointer text-error font-bold focus:text-error">Remove from saved</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold pointer-events-none">
                          <div className="flex items-center gap-2"><FaHeart className='w-6 h-6' /> {post?.likes?.length || 0}</div>
                          <div className="flex items-center gap-2"><IoChatbubbleSharp className="w-6 h-6 -rotate-90" /> {post?.comments?.length || 0}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-on-surface-variant">No saved posts yet.</div>
                )}
              </TabsContent>
              <TabsContent value="tagged">
                <div className="text-center py-8 text-on-surface-variant">No tagged posts yet.</div>
              </TabsContent>
              <TabsContent value="watched">
                <div className="grid grid-cols-3 gap-1 md:gap-8 mt-4 md:mt-8 mb-20 w-full h-full px-2 md:px-0">
                  {watched.map((watch, index) => (
                    <div key={watch._id}>
                      <div onClick={e => showComments(e, watch)} className={`group relative overflow-hidden rounded-xl bg-surface-container-low cursor-pointer aspect-square ${index === 0 ? 'col-span-2 row-span-2' : 'col-span-1'}`}>
                        {watch?.media[0]?.mediaType === 'image' ? (
                          <img src={`${watch?.media[0]?.mediaPath}`} alt={watch.caption} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                        ) : (
                          <video src={`${watch?.media[0]?.mediaPath}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        )}

                        <div className="absolute top-2 right-2 z-20">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-white hover:bg-black/20">
                                <MoreHorizontal className="w-5 h-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-40 md:w-80">
                              <DropdownMenuItem onClick={e => handleDeletePost(e, watch?._id)} className="text-error justify-center font-bold focus:text-error cursor-pointer">Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold pointer-events-none">
                          <div className="flex items-center gap-2"><FaHeart className='w-6 h-6' /> {watch?.likes?.length || 0}</div>
                          <div className="flex items-center gap-2"><IoChatbubbleSharp className="w-6 h-6 -rotate-90" /> {watch?.comments?.length || 0}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </section>
        </div>
      </main>
    </div>

  );

};

export default Profile;
