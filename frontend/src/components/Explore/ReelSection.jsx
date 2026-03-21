import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { GoBookmark, GoBookmarkFill } from 'react-icons/go';
import { BsThreeDots } from "react-icons/bs";
import axios from 'axios';
import Sidebar from '../Home/Sidebar';
import { Button } from '../ui/button';
import { Heart, MessageCircle, Send } from 'lucide-react';
import { FaHeart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { setSavedPosts, setWatchHistory } from '@/features/userDetail/userDetailsSlice';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';


const BASE_URL =
import.meta.env.VITE_NODE_ENV === "development"
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD;


const ReelSection = () => {
    const userDetails = useSelector((state) => state.counter.userDetails);
    const savedPost = useSelector((state) => state.counter.savedPosts);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    const videoRefs = useRef([]); 
    const watchTimeouts = useRef({}); 

    // 1. Fetch Posts (Reels)
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading
    } = useInfiniteQuery({
        queryKey: ['reels'],
        queryFn: async ({ pageParam = 0 }) => {
            const { data } = await axios.get(`${BASE_URL}/api/posts/getPosts?page=${pageParam}&limit=10`);
            return data;
        },
        getNextPageParam: (lastPage, allPages) => lastPage.length === 10 ? allPages.length : undefined,
    });

    // Derive all video posts from query data
    const allPosts = useMemo(() => {
        if (!data) return [];
        return data.pages.flat().map(post => {
            const videoMedia = post.media.filter(mediaItem => mediaItem.mediaType === "video");
            if (videoMedia.length > 0) {
                return { ...post, media: videoMedia };
            }
            return null;
        }).filter(post => post !== null);
    }, [data]);

    // Fetch saved posts directly (keeping redux pattern for now)
    const getSavePosts = useCallback(async () => {
        try {
            const userId = userDetails.id;
            const { data: { savedPosts } } = await axios.get(`${BASE_URL}/api/posts/${userId}/save`);
            dispatch(setSavedPosts(savedPosts));
        } catch (error) {
            console.error('Error fetching saved posts:', error);
            if (error.response?.statusText === 'Unauthorized' || error.response?.status === 403) navigate('/login');
        }
    }, [dispatch, navigate, userDetails.id]);

    // 2. Mutations
    const likeMutation = useMutation({
        mutationFn: async (postId) => {
            const { data: updatedPost } = await axios.put(`${BASE_URL}/api/posts/${postId}/like`, { userId: userDetails.id });
            return updatedPost.post;
        },
        onSuccess: (updatedPost) => {
            queryClient.setQueryData(['reels'], (oldData) => {
                if (!oldData) return oldData;
                return {
                    ...oldData,
                    pages: oldData.pages.map(page => page.map(post => post._id === updatedPost._id ? updatedPost : post))
                };
            });
        }
    });

    const handleLike = useCallback((e, postId) => {
        e.preventDefault();
        likeMutation.mutate(postId);
    }, [likeMutation]);

    const saveMutation = useMutation({
        mutationFn: async (postId) => {
            const { data: { savedPosts } } = await axios.put(`${BASE_URL}/api/posts/${userDetails.id}/save`, { postId });
            return savedPosts;
        },
        onSuccess: (savedPostsData) => {
            dispatch(setSavedPosts(savedPostsData));
        }
    });

    const handleSavePosts = useCallback((e, postId) => {
        e.preventDefault();
        saveMutation.mutate(postId);
    }, [saveMutation]);

    const historyMutation = useMutation({
        mutationFn: async (postId) => {
            const response = await axios.post(`${BASE_URL}/api/users/reelHistory/${userDetails.id}/${postId}`);
            return response?.data?.user?.reelHistory;
        },
        onSuccess: (watchHistory) => {
            if(watchHistory) dispatch(setWatchHistory([watchHistory]));
        }
    });

    const addToHistory = useCallback((postId) => {
        historyMutation.mutate(postId);
    }, [historyMutation]);

    // Watch time tracking
    const handleWatchStart = useCallback((postId, videoElement) => {
        watchTimeouts.current[postId] = setTimeout(() => {
            addToHistory(postId);
        }, 5000); // 5 seconds watch time
        videoElement.play();
    }, [addToHistory]);

    const handleWatchEnd = useCallback((postId, videoElement) => {
        clearTimeout(watchTimeouts.current[postId]);
        videoElement.pause();
    }, []);

    // Infinite scrolling
    const handleScroll = useCallback(() => {
        if (window.innerHeight + document.documentElement.scrollTop + 1 >= document.documentElement.offsetHeight - 100) {
            if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
            }
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Video intersection observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target;
                    const postId = video.dataset.postid;

                    if (entry.isIntersecting) {
                        handleWatchStart(postId, video);
                    } else {
                        handleWatchEnd(postId, video);
                    }
                });
            },
            { threshold: 0.75 }
        );

        videoRefs.current.forEach((video) => {
            if (video) observer.observe(video);
        });

        return () => {
            videoRefs.current.forEach((video) => {
                if (video) observer.unobserve(video);
            });
        };
    }, [allPosts, handleWatchStart, handleWatchEnd]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    useEffect(() => {
        getSavePosts();
    }, [getSavePosts]);

    return (
        <>
            <div className="flex-1 min-h-screen flex flex-col items-center py-4 md:ml-[72px] lg:ml-60 ml-auto dark:bg-neutral-950 dark:text-white">
    <div className="w-full flex justify-center mt-4">
        <Carousel
            opts={{
                align: "center", // Center the current reel, partially showing adjacent reels
            }}
            orientation="vertical"
            className="relative w-full max-w-sm md:max-w-md lg:max-w-lg"
        >
            <CarouselContent className="h-[95vh] gap-4">
                {allPosts?.map((post, index) => (
                    <CarouselItem
                        key={post._id}
                        className="relative flex flex-col items-center justify-center w-full h-[75vh] gap-4 rounded-lg overflow-hidden"
                    >
                        {/* Post Content */}
                        <div className="w-[300px] h-full rounded-lg shadow-lg overflow-hidden">
                            <div className="video w-full h-full relative rounded-lg overflow-hidden">
                                <video
                                    ref={(el) => (videoRefs.current[index] = el)} 
                                    muted
                                    data-postid={post._id} 
                                    src={post?.media[0]?.mediaPath}
                                    loop
                                    className="object-cover w-full h-full"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                                    {/* Author Info */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <Link
                                            to={`/profile/${post?.author?.username}/${post.caption}`}
                                            className="flex items-center"
                                        >
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage
                                                    src={post?.author?.profilePicture}
                                                    alt={post?.author?.username}
                                                    className="object-cover w-full h-full rounded-full"
                                                />
                                                <AvatarFallback>{post?.author?.username}</AvatarFallback>
                                            </Avatar>
                                            <span className="ml-2 text-white text-sm">
                                                {post?.author?.username}
                                            </span>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            className="ml-2 px-4 py-1 text-xs text-white bg-transparent border"
                                        >
                                            Follow
                                        </Button>
                                    </div>
                                    {/* Caption */}
                                    <p className="text-white text-sm mb-2">{post.caption}</p>
                                    {/* Song Info */}
                                    <div className="flex items-center text-white">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-music"
                                        >
                                            <path d="M9 18V5l12-2v13" />
                                            <circle cx="6" cy="18" r="3" />
                                            <circle cx="18" cy="16" r="3" />
                                        </svg>
                                        <span className="ml-2 text-sm">
                                            James Quinn - Dreamer's Path
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="absolute right-16 flex flex-col items-center justify-end gap-4">
                            {/* Like Button */}
                            <div className="flex flex-col items-center">
                                <button
                                    onClick={(e) => handleLike(e, post._id)}
                                    className="transition-transform hover:scale-110"
                                >
                                    {post?.likes?.includes(userDetails.id) ? (
                                        <FaHeart className="text-red-500 w-6 h-6" />
                                    ) : (
                                        <Heart className="w-6 h-6" />
                                    )}
                                </button>
                                <p className="text-sm">{post?.likes?.length}</p>
                            </div>

                            {/* Comment Button */}
                            <div className="flex flex-col items-center">
                                <button className="transition-transform hover:scale-110">
                                    <MessageCircle className="w-6 h-6 transform -scale-x-100" />
                                </button>
                                <p className="text-sm">{post?.comments?.length}</p>
                            </div>

                            {/* Share Button */}
                            <div className="flex flex-col items-center">
                                <Send className="w-6 h-6 transition-transform hover:scale-110" />
                                <p className="text-sm">0</p>
                            </div>

                            {/* Save Button */}
                            <div className="flex flex-col items-center">
                                <button
                                    onClick={(e) => handleSavePosts(e, post._id)}
                                    className="transition-transform hover:scale-110"
                                >
                                    {Array.isArray(savedPost) && savedPost.includes(post._id) ? (
                                        <GoBookmarkFill className="w-6 h-6 text-white" />
                                    ) : (
                                        <GoBookmark className="w-6 h-6" />
                                    )}
                                </button>
                            </div>

                            {/* Options Button */}
                            <div className="flex flex-col items-center">
                                <BsThreeDots className="w-6 h-6 transition-transform hover:scale-110" />
                            </div>
                        </div>
                     </CarouselItem>
                ))}
            </CarouselContent>

            {/* Carousel Navigation Arrows */}
            {allPosts.length > 0 && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-4 h-14">
                <CarouselPrevious className="w-12 h-12 p-2 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition" />
                <CarouselNext className="w-12 h-12 p-2 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition" />
            </div>
            )}
        </Carousel>
        {isFetchingNextPage && <div className="mt-4 text-center">Loading more reels...</div>}
    </div>
</div>
        </>
    );
};

export default ReelSection;
