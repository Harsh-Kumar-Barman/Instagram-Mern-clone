import React, { useState } from 'react';
import Sidebar from '../Home/Sidebar';
import axios from 'axios';
import { BiSolidMoviePlay } from 'react-icons/bi';
import { FaHeart } from 'react-icons/fa';
import { IoChatbubbleSharp } from "react-icons/io5";
import PostComment from '../Home/PostComment';
import { useDispatch } from 'react-redux';
import { setSelectedPost } from '@/features/userDetail/userDetailsSlice';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ExploreSkeleton } from '../Home/instagram-skeleton';

const BASE_URL =
import.meta.env.VITE_NODE_ENV === "development"
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD;


const ExploreGrid = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [selectedMedia, setSelectedMedia] = useState(null); 
    const [isDialogOpen, setIsDialogOpen] = useState(false);  

    const { data: allPosts, isLoading } = useQuery({
        queryKey: ['explore-posts'],
        queryFn: async () => {
            const { data } = await axios.get(`${BASE_URL}/api/posts/getPosts`);
            return data.reverse();
        },
        onError: (error) => {
            console.error('Error fetching posts:', error);
            if (error.response?.statusText === "Unauthorized" || error.response?.status === 403) {
                navigate('/login');
            }
        }
    });

    const showComments = (e, post) => {
        e.preventDefault();
        setSelectedMedia(post);
        setIsDialogOpen(true);
        dispatch(setSelectedPost(post));
    };

    const renderMedia = (post) => {
        return (
            <>
                {post?.media[0]?.mediaType === 'image' ? (
                    <img
                        src={post?.media[0]?.mediaPath}
                        alt={post?.caption}
                        className="object-cover w-full h-full"
                        loading="lazy"
                    />
                ) : (
                    <video
                        autoPlay
                        muted
                        src={post?.media[0]?.mediaPath}
                        loop
                        className="object-cover w-full h-full duration-300"
                    />
                )}
                {/* Hover Effect */}
                <div className="bg-black/20 text-white absolute w-full h-full top-0 hidden group-hover:flex justify-center items-center gap-5">
                    <div className="likes flex justify-center items-center gap-1">
                        <FaHeart size={18} className="" />
                        <p>{post?.likes?.length}</p>
                    </div>
                    <div className="comments flex justify-center items-center gap-1">
                        <IoChatbubbleSharp className="transition-colors text-white duration-100" size={25} style={{ transform: 'scaleX(-1)' }} />
                        <p>{post?.comments?.length}</p>
                    </div>
                </div>
            </>
        );
    };

    if (isLoading) return <ExploreSkeleton />;

    return (
        <>
            <PostComment selectedMedia={selectedMedia} isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
            <div className="flex-1 md:ml-[72px] lg:ml-60 bg-transparent min-h-screen flex flex-col pt-8 lg:px-12 ml-auto">
                {/* Search & Filters */}
                <div className="w-full max-w-3xl mx-auto mb-6 px-4 lg:px-0">
                    <div className="relative mb-4">
                        <input 
                            type="text" 
                            placeholder="Search the gallery..." 
                            className="w-full bg-surface-container border-none text-on-surface py-3.5 pl-12 pr-4 rounded-2xl font-body outline-none focus:ring-1 focus:ring-primary shadow-sm"
                        />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {["All", "Minimalism", "Architecture", "Nature", "Abstract", "Portraits"].map((filter, i) => (
                            <button key={i} className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-display font-medium transition-colors ${i === 0 ? 'bg-on-surface text-background drop-shadow-sm' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'}`}>
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-full grid grid-cols-3 gap-[4px] sm:gap-2 auto-rows-[120px] sm:auto-rows-[200px] md:auto-rows-[300px] px-1 lg:px-0 pb-12">
                    {allPosts?.map((post, index) => {
                        const normalizedIndex = index % 10;
                        let gridClass = "col-span-1 row-span-1";
                        
                        // Instagram-style mosaic pattern
                        if (normalizedIndex === 0) {
                            gridClass = "col-span-2 row-span-2";
                        } else if (normalizedIndex === 7) {
                            // Reverse the layout for the next block
                            gridClass = "col-span-2 row-span-2 col-start-2";
                        }

                        return (
                            <div onClick={(e) => showComments(e, post)}
                                key={post?._id}
                                className={`relative w-full h-full rounded-md sm:rounded-xl overflow-hidden bg-surface-container group cursor-pointer ${gridClass}`}
                            >
                                {renderMedia(post)}
                                {post?.media[0]?.mediaType === 'video' && (
                                    <div className="absolute top-3 right-3 text-white drop-shadow-md">
                                        <BiSolidMoviePlay size={24} />
                                    </div>
                                )}
                                <p className="absolute bottom-0 left-0 p-4 w-full bg-gradient-to-t from-black/60 to-transparent text-white truncate font-body opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {post?.caption}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

const Explore = () => {
    return (
        <>
            <ExploreGrid />
        </>
    );
};

export default Explore;
