import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setFollowingUsers, setMessages, setSuggestedUser } from '../features/userDetail/userDetailsSlice';
import { BiSolidMoviePlay } from 'react-icons/bi';
import { CiSquarePlus } from 'react-icons/ci';
import { FaInstagram, FaRegHeart } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import { GoHomeFill } from 'react-icons/go';
import { IoSearchOutline } from 'react-icons/io5';
import { MdOutlineExplore } from 'react-icons/md';
import { RxHamburgerMenu } from 'react-icons/rx';
import { Link } from 'react-router-dom';
import { FaRegEdit } from 'react-icons/fa';
import ChatBox from './ChatBox';
import MessagesMember from './MessagesMember';
const Messenger = ({ socketRef }) => {

    const links = [
        { id: 1, icon: <GoHomeFill size={26} />, label: 'Home', link: '/' },
        { id: 2, icon: <IoSearchOutline size={26} />, label: 'Search', link: '#' },
        { id: 3, icon: <MdOutlineExplore size={26} />, label: 'Explore', link: '/' },
        { id: 4, icon: <BiSolidMoviePlay size={26} />, label: 'Reels', link: '/' },
        { id: 5, icon: <FiSend size={26} />, label: 'Messages', link: '/direct/inbox' },
        { id: 6, icon: <FaRegHeart size={26} />, label: 'Notification', link: '/' },
        { id: 7, icon: <CiSquarePlus size={26} />, label: 'Create', link: '/' },
        { id: 8, icon: <RxHamburgerMenu size={26} />, label: 'More', link: '/' },
        { id: 9, icon: <RxHamburgerMenu size={26} />, label: 'More', link: '/' },
    ];
    const messages = useSelector((state) => state.counter.messages);
    const userDetails = useSelector((state) => state.counter.userDetails);
    const suggestedUser = useSelector((state) => state.counter.suggestedUser);
    const dispatch = useDispatch()
    const getFollowingUsers = async (username) => {
        try {
            const response = await axios.get(`/api/conversations/followingUsers/${username}`);
            const followingUsers = response.data
            dispatch(setFollowingUsers(followingUsers))
            return response.data;
        } catch (error) {
            console.error('Error fetching following users:', error);
        }
    };

    const getRealTimeMessages = () => {
        socketRef.current.on('newMessage', (newMessage) => {
            Array.isArray(messages)?
            dispatch(setMessages([...messages, newMessage])):"no"
        });
    }
    useEffect(() => {
      
      getRealTimeMessages()
    
      return () => {
        socketRef.current.off('newMessage')
      }
    }, [messages,setMessages])
    


    useEffect(() => {
        if (userDetails?.username) {
            getFollowingUsers(userDetails.username);
        }
        return () => {
            dispatch(setSuggestedUser(null))
        }
    }, [userDetails,setMessages]);

    useEffect(() => {
        if (userDetails?.id) {
            gettAllMessages();
        }
    }, [userDetails, suggestedUser]);

    const gettAllMessages = async () => {
        try {
            const senderId = userDetails?.id;
            if (!senderId) {
                console.log('User details not available yet.');
                return;  // Exit the function early if userDetails is not set
            }

            const response = await axios.get(`/api/conversations/all/messages/${suggestedUser?._id}?senderId=${senderId} `);

            if (response.data.success) {
                dispatch(setMessages(response.data.messages));
            }
        } catch (error) {
            console.log(error.message);
        }
    };


    return (
        <div className=" w-full flex h-screen bg-gray-900 text-white">
            {/* Sidebar */}
            <div className="w-[34.5%] h-screen flex">
                <div className="h-screen w-[15.5%] bg-black flex flex-col gap-7 items-center border-r-[.1px] border-zinc-800">
                    <div className="instaIcon my-8">
                        <Link to="/">
                            <FaInstagram size={26} />
                        </Link>
                    </div>
                    {links.map((link) => (
                        <Link to={link.link} key={link.id} className="flex items-center justify-between">
                            {link.icon}
                        </Link>
                    ))}
                </div>

                <div className="h-screen w-[84.5%] bg-black flex flex-col border-r-[.1px] border-zinc-800">
                    <div className="flex items-center justify-between mt-5 mb-6 px-6 py-4">
                        <span className="text-lg font-semibold">{userDetails?.username}</span>
                        <FaRegEdit size={28} />
                    </div>

                    {/* Statuses */}
                    <div className="flex space-x-4 overflow-x-auto px-8 pb-4 my-6">
                        {[1, 2, 3].map((item, index) => (
                            <div key={index} className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
                                <img
                                    src="https://via.placeholder.com/80"
                                    alt={`Story ${index + 1}`}
                                    className="rounded-full"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Messages */}
                    <MessagesMember/>
                </div>
            </div>
            <ChatBox/>
        </div>
    );
};

export default Messenger;
