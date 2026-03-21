import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import SuggestedUsers from './SuggestedUsers';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { setSavedPosts, setFollowing, setFollower, setSelectedPost, setRtmNotification } from '@/features/userDetail/userDetailsSlice';
import PostComment from './PostComment';
import Post from './Post';
import Stories from './Stories';
import { InstagramSkeletonComponent } from './instagram-skeleton';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const BASE_URL =
  import.meta.env.VITE_NODE_ENV === "development"
    ? import.meta.env.VITE_API_BASE_URL_DEV
    : import.meta.env.VITE_API_BASE_URL_PROD;

const Home = ({ socketRef }) => {
  const [followingUserss, setFollowingUserss] = useState();
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const savedPosts = useSelector((state) => state.counter.savedPosts);
  const userDetails = useSelector((state) => state.counter.userDetails);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // 1. Fetch Posts with useInfiniteQuery
  const fetchPostsGroup = async ({ pageParam = 0 }) => {
    const { data } = await axios.get(`${BASE_URL}/api/posts/getPosts?page=${pageParam}&limit=10`);
    return data;
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: fetchPostsGroup,
    getNextPageParam: (lastPage, allPages) => lastPage.length === 10 ? allPages.length : undefined,
  });

  const allPosts = data?.pages?.flat() || [];
  const isLoading = status === 'pending';

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.offsetHeight - 100) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  };

  // 2. Mutations
  const likeMutation = useMutation({
    mutationFn: async (postId) => {
      const { data } = await axios.put(`${BASE_URL}/api/posts/${postId}/like`, { userId: userDetails.id });
      return data.post;
    },
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(['posts'], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map(page => page.map(post => post._id === updatedPost._id ? updatedPost : post))
        };
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (postId) => {
      const { data } = await axios.delete(`${BASE_URL}/api/posts/delete/${postId}`, { withCredentials: true });
      return data.post._id;
    },
    onSuccess: (deletedPostId) => {
      queryClient.setQueryData(['posts'], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map(page => page.filter(post => post._id !== deletedPostId))
        };
      });
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (postId) => {
      const { data } = await axios.put(`${BASE_URL}/api/posts/${userDetails.id}/save`, { postId });
      return data.savedPosts;
    },
    onSuccess: (savedPostsData) => {
      dispatch(setSavedPosts(savedPostsData));
    }
  });

  const followMutation = useMutation({
    mutationFn: async (followingID) => {
      const { data } = await axios.put(`${BASE_URL}/api/users/${userDetails.id}/following`, { followingID });
      return data;
    },
    onSuccess: ({ following, followers }) => {
      dispatch(setFollowing(following));
      dispatch(setFollower(followers));
      setFollowingUserss(following);
    }
  });

  const commentMutation = useMutation({
    mutationFn: async ({ postId, comment }) => {
      const { data } = await axios.post(`${BASE_URL}/api/posts/${postId}/comment`, {
        userId: userDetails.id,
        text: comment,
      });
      return data;
    },
    onSuccess: (updatedPost) => {
      queryClient.setQueryData(['posts'], (oldData) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map(page => page.map(post => post._id === updatedPost._id ? updatedPost : post))
        };
      });
    }
  });

  // Action Handlers
  const handleLike = (e, postId) => {
    e.preventDefault();
    likeMutation.mutate(postId);
  };

  const handleDeletePost = (e, postId) => {
    e.preventDefault();
    deleteMutation.mutate(postId);
  };

  const handleSavePosts = (e, postId) => {
    e.preventDefault();
    saveMutation.mutate(postId);
  };

  const showComments = (e, post) => {
    e.preventDefault();
    setSelectedMedia(post);
    setIsDialogOpen(true);
    dispatch(setSelectedPost(post));
  };

  const handleFollowing = (e, followingID) => {
    e.preventDefault();
    followMutation.mutate(followingID);
  };

  const handleCommentSubmit = (e, postId, comment) => {
    e.preventDefault();
    if (!comment.trim()) return;
    commentMutation.mutate({ postId, comment });
  };

  const getFollowing = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/users/${userDetails.id}/following`);
      const following = data?.user?.following;
      setFollowingUserss(following);
      dispatch(setFollowing([...following]));
    } catch (error) {
      console.error('Error fetching following users:', error);
    }
  };

  const getSavePosts = async () => {
    try {
      const { data: { savedPosts } } = await axios.get(`${BASE_URL}/api/posts/${userDetails.id}/save`);
      dispatch(setSavedPosts(savedPosts));
    } catch (error) {
      console.error('Error fetching saved posts:', error);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if(userDetails?.id) {
        getFollowing();
        getSavePosts();
    }
  }, [userDetails?.id]);

  useEffect(() => {
    socketRef.current?.on('rtmNotification', (rtmNotification) => {
      if (rtmNotification.id !== userDetails?.id) {
        dispatch(setRtmNotification(rtmNotification));
      }
    });
    return () => {
      if (socketRef.current) socketRef.current.off('rtmNotification');
    };
  }, []);

  return (<div className='dark:bg-neutral-950 dark:text-white'>
    <div className="flex bg-white dark:bg-neutral-950 min-h-screen">
      <PostComment selectedMedia={selectedMedia} isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
      <main className="flex-1 md:ml-[72px] lg:ml-60">
        <div className="max-w-screen-xl mt-14 md:mt-0 mx-auto py-2 md:px-6 lg:px-8">
          <div className="flex gap-0">
            <div className="flex-1 max-w-[630px]">
              <Stories />
              <section className="mt-2 mx-auto sm:w-[80vw] md:w-[60vw] lg:w-[468px]">
                {allPosts.map((post) => (
                  <Post
                    key={post._id}
                    post={post}
                    userDetails={userDetails}
                    savedPost={savedPosts}
                    followingUserss={followingUserss}
                    handleLike={handleLike}
                    handleSavePosts={handleSavePosts}
                    showComments={showComments}
                    handleFollowing={handleFollowing}
                    handleCommentSubmit={handleCommentSubmit}
                    handleDeletePost={handleDeletePost}
                  />
                ))}
                {isFetchingNextPage || isLoading ? <InstagramSkeletonComponent /> : null}
                {!hasNextPage && !isLoading && <div>No more posts to load</div>}
              </section>
            </div>
            <SuggestedUsers />
          </div>
        </div>
      </main>
    </div>
  </div>
  );
};

export default Home;