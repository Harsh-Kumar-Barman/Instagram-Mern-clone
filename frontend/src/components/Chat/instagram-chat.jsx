import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { FaInstagram, FaRegEdit, FaRegHeart } from "react-icons/fa"
import MessagesMember from "./MessagesMember"
import { Link, useNavigate } from "react-router-dom"
import { GoHomeFill } from "react-icons/go"
import { IoSearchOutline } from "react-icons/io5"
import { MdOutlineExplore } from "react-icons/md"
import { BiSolidMoviePlay } from "react-icons/bi"
import { FiSend } from "react-icons/fi"
import { CiSquarePlus } from "react-icons/ci"
import { RxHamburgerMenu } from "react-icons/rx"
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setFollowingUsers, setMessages, setSuggestedUser } from '@/features/userDetail/userDetailsSlice';
import ChatBox from "./ChatBox"
import { SearchDialogWithCheckboxesComponent } from "./search-dialog-with-checkboxes"
import { IoIosArrowDown } from "react-icons/io";


const BASE_URL =
import.meta.env.VITE_NODE_ENV === "development"
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD;

export function ChatComponent({ socketRef }) {
  const links = [
    { id: 1, icon: <GoHomeFill size={26} />, label: 'Home', link: '/' },
    { id: 2, icon: <IoSearchOutline size={26} />, label: 'Search', link: '#' },
    { id: 3, icon: <MdOutlineExplore size={26} />, label: 'Explore', link: '/explore/' },
    { id: 4, icon: <BiSolidMoviePlay size={26} />, label: 'Reels', link: '/reels/' },
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
  const navigate = useNavigate()


  const getFollowingUsers = async (username) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/conversations/followingUsers/${username}`);
      const gropuResponse = await axios.get(`${BASE_URL}/api/conversations/groups/${userDetails.id}`);
      const followingUsers = [...response?.data, ...gropuResponse?.data]
      dispatch(setFollowingUsers(followingUsers))
      return response.data;
    } catch (error) {
      console.error('Error fetching following users:', error);
      if (error.response.statusText === "Unauthorized"||error.response?.status===403) navigate('/login')

    }
  };



  const getRealTimeMessages = () => {
    socketRef.current?.on('newMessage', (newMessage) => {
      Array.isArray(messages) ?
        dispatch(setMessages([...messages, newMessage])) : "no"
    });
    socketRef.current?.on('sendGroupMessage', (newMessage) => {
      Array.isArray(messages) ?
        dispatch(setMessages([...messages, newMessage])) : "no"
    });
    
  }



  useEffect(() => {

    getRealTimeMessages()

    return () => {
      socketRef.current.off('newMessage')
    }
  }, [messages, setMessages])



  useEffect(() => {
    if (userDetails?.username) {
      dispatch(setSuggestedUser(null))
      getFollowingUsers(userDetails.username);
    }
    return () => {
      dispatch(setSuggestedUser(null))
    }
  }, [userDetails, setMessages]);



  useEffect(() => {
    if (userDetails?.id) {
      gettAllMessages();
    }


    // socketRef.current.on('videoCallOffer', async ({ from, offer }) => {
    //   if (offer.type == 'offer') {
    //     navigate(`/call/${from}`); // Navigate to the correct call route
    //   }
    // });
  }, [userDetails, suggestedUser]);



  const gettAllMessages = async () => {
    try {
      const senderId = userDetails?.id;
      if (!senderId) {
        console.log('User details not available yet.');
        return;  // Exit the function early if userDetails is not set
      }

      if (suggestedUser && Object.keys(suggestedUser).length > 0) {
        const response = await axios.get(
          suggestedUser && 'groupName' in suggestedUser
            ? `${BASE_URL}/api/conversations/group/messages/${suggestedUser?._id}`
            : `${BASE_URL}/api/conversations/all/messages/${suggestedUser?._id}?senderId=${senderId}`
        );

        if (response.data.success) {
          dispatch(setMessages(response.data.messages));
        }
      }
    } catch (error) {
      console.log(error.message);
      if (error?.response?.statusText === "Unauthorized"||error.response?.status===403) navigate('/login')

    }
  };


  return (
    (<div className="flex h-screen bg-surface font-body overflow-hidden">
      <div className="flex-1 flex text-on-surface bg-surface">
        {/* Sidebar */}
        <div className="h-screen w-[5.3%] hidden md:flex flex-col gap-7 items-center border-r border-outline-variant/10 bg-surface-container-lowest">
          <div className="instaIcon my-8">
            <Link to="/">
              <FaInstagram size={26} className="text-on-surface" />
            </Link>
          </div>
          {links.map((link) => (
            <Link to={link.link} key={link.id} className="flex items-center justify-between text-on-surface hover:text-primary transition-colors">
              {link.icon}
            </Link>
          ))}
        </div>
        <section
          className={` ${suggestedUser?"w-0 overflow-hidden border-none md:border-r":"w-full"} md:w-80 lg:w-96 border-r border-outline-variant/10 flex flex-col bg-surface-container-lowest text-on-surface transition-all duration-300`}>
          <header className="p-4 md:p-6 pb-2">
            <div className="flex justify-between items-center mb-6">
              <h1 className="font-headline text-2xl md:text-3xl font-extrabold tracking-tight text-on-surface flex items-center gap-2 cursor-pointer">{userDetails.username} <IoIosArrowDown size={18} className="text-on-surface-variant" /></h1>
              <SearchDialogWithCheckboxesComponent socketRef={socketRef} />
            </div>
            <div className="relative mb-2">
              <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg" />
              <input className="w-full bg-surface-container-high border-none rounded-xl py-3 pl-12 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/60 outline-none text-on-surface font-body" placeholder="Search messages" type="text"/>
            </div>
          </header>
          <div className="flex justify-between items-center px-4 md:px-6 py-2">
              <span className="font-headline font-bold text-on-surface">Messages</span>
              <span className="text-on-surface-variant font-body text-sm font-medium cursor-pointer hover:text-on-surface transition-colors">Requests</span>
          </div>
          <MessagesMember socketRef={socketRef} />
        </section>

        {/* Main Chat Area */}
        <ChatBox socketRef={socketRef}/>
      </div>
    </div>)
  );
}