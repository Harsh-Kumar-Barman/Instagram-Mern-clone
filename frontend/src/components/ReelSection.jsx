// src/components/ReelSection.js
import React, { useEffect, useState, useRef } from 'react';
import { FaRegHeart } from 'react-icons/fa';
import { IoChatbubbleOutline } from 'react-icons/io5';
import { FiSend } from 'react-icons/fi';
import { GoBookmark } from 'react-icons/go';
import { BsThreeDots } from "react-icons/bs";
import axios from 'axios';
import Sidebar from './Sidebar';

const ReelSection = () => {
    const [allPosts, setAllPosts] = useState([]);
    const videoRefs = useRef([]); // Ref array for videos

    // Fetch posts from API and filter for videos (reels)
    const fetchPosts = async () => {
        try {
            const { data: posts } = await axios.get('/api/posts');
            const reels = posts.filter(post => post?.mediaType === 'video');
            setAllPosts(reels);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    // Create IntersectionObserver and assign to videos
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target;
                    if (entry.isIntersecting) {
                        video.play(); // Play video if in view
                    } else {
                        video.pause(); // Pause video if out of view
                    }
                });
            },
            { threshold: 0.75 } // When 75% of the video is visible, trigger observer
        );

        // Observe each video element
        videoRefs.current.forEach((video) => {
            if (video) observer.observe(video);
        });

        // Cleanup observer on unmount
        return () => {
            videoRefs.current.forEach((video) => {
                if (video) observer.unobserve(video);
            });
        };
    }, [allPosts]); // Only run effect when posts are updated

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <>
            <Sidebar />
            <div className="w-[81.2%] flex flex-col items-center p-4 ml-auto">
                <div className="w-full flex flex-wrap justify-center gap-4 mt-4">
                    {allPosts?.map((post, index) => (
                        <div
                            key={post._id}
                            className="relative w-full h-[90vh] flex justify-center items-center rounded-lg overflow-hidden"
                        >
                            <div className="h-full w-[400px] rounded-sm flex justify-center items-center gap-3 overflow-hidden">
                                <div className="video h-full w-[85%] relative rounded-sm overflow-hidden">
                                    <video
                                        ref={(el) => (videoRefs.current[index] = el)} // Assign ref to each video
                                        muted
                                        // controls
                                        src={`http://localhost:5000/${post.mediaPath}`}
                                        loop
                                        className="object-cover w-full h-full rounded-sm"
                                    />
                                </div>

                                <div className="controls h-full w-[15%] rounded-lg flex flex-col justify-end items-center gap-5 py-1">
                                    <div className="like flex flex-col justify-center items-center">
                                        <FaRegHeart size={22} className="text-white" />
                                        <p className="text-sm text-white">{post?.likes?.length}</p>
                                    </div>

                                    <div className="comment flex flex-col justify-center items-center">
                                        <IoChatbubbleOutline
                                            size={23}
                                            style={{ transform: 'scaleX(-1)' }}
                                            className="text-white"
                                        />
                                        <p className="text-sm text-white">{post?.comments?.length}</p>
                                    </div>

                                    <div className="share flex flex-col justify-center items-center">
                                        <FiSend size={22} className="text-white" />
                                        <p className="text-sm text-white">{post?.likes?.length}</p>
                                    </div>

                                    <div className="save flex flex-col justify-center items-center">
                                        <GoBookmark size={25} className="text-white" />
                                        <p className="text-sm text-white">Save</p>
                                    </div>

                                    <div className="options flex flex-col justify-center items-center">
                                        <BsThreeDots size={22} className="text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ReelSection;
