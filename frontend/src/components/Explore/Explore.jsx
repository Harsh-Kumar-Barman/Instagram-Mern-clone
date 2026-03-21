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

    if (isLoading) return <div className="flex justify-center items-center h-screen md:ml-[72px] lg:ml-60 dark:bg-neutral-950 dark:text-white">Loading...</div>;

    return (
        <>
            <PostComment selectedMedia={selectedMedia} isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} />
            <div className="flex-1 md:ml-[72px] lg:ml-60 dark:bg-neutral-950 min-h-screen grid grid-cols-3 gap-1 md:px-12 py-5 md:py-12 ml-auto">
                {allPosts?.map((post, index) => {
                    if (index === 2) {
                        // The third item will span both rows
                        return (
                            <div onClick={(e) => showComments(e, post)}
                                key={post?._id}
                                className="relative h-full col-span-1 row-span-2 group cursor-pointer"
                            >
                                {renderMedia(post)}
                                {post?.media[0]?.mediaType === 'video' && (
                                    <div className="absolute top-5 right-5 text-white">
                                        <BiSolidMoviePlay size={25} />
                                    </div>
                                )}
                                <p className="absolute bottom-0 left-0 p-5 w-full bg-gradient-to-t from-black/50 to-transparent text-white truncate">{post?.caption}</p>
                            </div>
                        );
                    }

                    // Render all other posts
                    return (
                        <div onClick={(e) => showComments(e, post)} key={post?._id} className="w-full relative h-80 bg-gray-800 col-span-1 group cursor-pointer">
                            {renderMedia(post)}
                            {post?.media[0]?.mediaType === 'video' && (
                                <div className="absolute top-5 right-5 text-white">
                                    <BiSolidMoviePlay size={25} />
                                </div>
                            )}
                            <p className="absolute bottom-0 left-0 p-5 bg-gradient-to-t from-black/50 to-transparent w-full text-white truncate">{post?.caption}</p>
                        </div>
                    );
                })}
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
