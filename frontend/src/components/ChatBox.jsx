import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setMessages } from '../features/userDetail/userDetailsSlice';
import axios from 'axios';
import { AiOutlineMessage } from 'react-icons/ai';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Camera, Heart, Info, Mic, Phone, Smile, Video } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

function ChatBox() {

    const suggestedUser = useSelector((state) => state.counter.suggestedUser);
    const userDetails = useSelector((state) => state.counter.userDetails);
    const messages = useSelector((state) => state.counter.messages);
    const [textMessage, setTextMessage] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const sendMessageHandle = async (e, reciverId) => {
        e.preventDefault()
        try {
            const senderId = userDetails.id
            const response = suggestedUser && 'groupName' in suggestedUser ?
                await axios.post(`/api/conversations/group/send/message/${suggestedUser?._id}`, { senderId, textMessage, messageType: "text" }) :
                await axios.post(`/api/conversations/send/message/${reciverId}`, { senderId, textMessage })
            if (response.data.success) {
                dispatch(setMessages([...messages, response.data.newMessage]))
                setTextMessage('')
            }
        } catch (error) {
            console.log(error.message)
            if (error.response.statusText === "Unauthorized") navigate('/login')
        }
    }

    return (
        <>
            {suggestedUser ?
                (<div className="flex-grow flex flex-col bg-white dark:bg-neutral-950 dark:text-white">
                    <div
                        className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <Avatar>
                                <AvatarImage className="object-cover object-top" src={`http://localhost:5000/${suggestedUser?.profilePicture}`} />
                                <AvatarFallback>{suggestedUser?.username}</AvatarFallback>
                            </Avatar>
                            <div>
                                <Link to={`/profile/${suggestedUser?.username}`}>
                                    <p className="font-semibold text-sm dark:text-white">{suggestedUser?.username}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Active 1h ago</p>
                                </Link>
                            </div>
                        </div>
                        <div className="flex">
                            <Button variant="ghost" size="sm" className="text-black dark:text-white">
                                <Phone className="h-6 w-6" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-black dark:text-white">
                                <Video className="h-7 w-7" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-black dark:text-white">
                                <Info className="h-6 w-6" />
                            </Button>
                        </div>
                    </div>
                    <ScrollArea className="flex-grow py-4 px-6">
                        <div className="flex justify-center">
                            <Avatar className="w-20 h-20">
                                <AvatarImage className="object-cover object-top w-full h-full" src={`http://localhost:5000/${suggestedUser?.profilePicture}`} />
                                <AvatarFallback>{suggestedUser?.username}</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className='flex flex-col justify-center items-center'>
                            <p className="text-center mt-2 font-semibold">{suggestedUser?.username}</p>
                            <p className="text-center mb-2">{suggestedUser?.fullName}</p>
                            <Link to={`/profile/${suggestedUser?.username}`}>
                                <Button className='text-sm'>View profile</Button>
                            </Link>
                        </div>
                        {messages && Array.isArray(messages) && messages?.map((message, index) => (
                            <div key={index} className={`flex ${message.senderId?._id === userDetails.id || message.senderId === userDetails.id ? "justify-end" : "justify-start"} my-1`}>

                                <div className={`px-3 py-2 rounded-full break-words max-w-sm text-sm ${message.senderId?._id === userDetails.id || message.senderId === userDetails.id ? "bg-blue-400 text-white" : "bg-neutral-100 dark:bg-zinc-800 dark:text-white "}`}>{message?.message}</div>
                            </div>
                        ))}
                    </ScrollArea>
                    <div className="p-4">
                        <form onSubmit={(e) => sendMessageHandle(e, suggestedUser._id)}
                            className="flex items-center space-x-4 border-[.2px] border-zinc-800 bg-transparent rounded-full px-4 py-2">
                            <Smile className="h-6 w-6 text-black dark:text-white" />
                            <input
                                value={textMessage}
                                onChange={e => setTextMessage(e.target.value)}
                                className="flex-grow bg-transparent border-none outline-none text-sm dark:text-white"
                                placeholder="Message..." />
                            {textMessage.trim() === '' ? (
                                <div className="flex items-center space-x-4 mr-4">
                                    <button>
                                        <Mic className="h-6 w-6 text-black dark:text-white" />
                                    </button>
                                    <button>
                                        <Camera className="h-6 w-6 text-black dark:text-white" />
                                    </button>
                                    <button>
                                        <Heart className="h-6 w-6 text-black dark:text-white" />
                                    </button>
                                </div>
                            ) : (
                                <button type='submit' className="mr-4 text-blue-400 font-semibold">
                                    Send
                                </button>
                            )}



                        </form>
                    </div>
                </div>)
                : (
                    <div className="flex-grow flex flex-col justify-center items-center bg-white dark:bg-neutral-950 dark:text-white">
                        <div className="emptyField flex flex-col justify-center items-center">
                            <div>
                                <AiOutlineMessage size={100} />
                            </div>
                            <div className="flex flex-col justify-center items-center my-2">
                                <p className='text-xl'>Your messages</p>
                                <p className='text-zinc-500 text-sm'>Send a message to start a chat.</p>
                            </div>
                            <div className="flex justify-center items-center my-2">
                                <button className='bg-blue-500 text-sm font-semibold text-white px-3 py-2 rounded-md'> send message</button>
                            </div>
                        </div>
                    </div>
                )}
        </>
    )
}

export default ChatBox