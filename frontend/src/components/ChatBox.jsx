import React, { useState } from 'react'
import { BsCameraVideo } from 'react-icons/bs';
import { IoCallOutline, IoInformationCircleOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiSmile } from 'react-icons/fi';
import { TiMicrophoneOutline } from 'react-icons/ti';
import { CiImageOn } from 'react-icons/ci';
import { FaRegHeart } from 'react-icons/fa';
import { setMessages } from '../features/userDetail/userDetailsSlice';
import axios from 'axios';
import { AiOutlineMessage } from 'react-icons/ai'; 

function ChatBox() {

    const suggestedUser = useSelector((state) => state.counter.suggestedUser);
    const userDetails = useSelector((state) => state.counter.userDetails);
    const messages = useSelector((state) => state.counter.messages);
    const [textMessage, setTextMessage] = useState('')
    const dispatch = useDispatch()

    const sendMessageHandle = async (e, reciverId) => {
        e.preventDefault()
        try {
            const senderId = userDetails.id
            const response = await axios.post(`/api/conversations/send/message/${reciverId}`, { senderId, textMessage })
            if (response.data.success) {
                dispatch(setMessages([...messages, response.data.newMessage]))
                setTextMessage('')
            }
        } catch (error) {
            console.log(error.message)
        }
    }

    return (
        <>
            {suggestedUser ? (
                <div className="w-[65.5%] ml-auto bg-black flex flex-col"> 
                    <div className="w-full h-[75px] px-3 bg-black border-b-[.1px] border-zinc-800 flex items-center">
                        <div className="flex justify-between w-full">
                            <div className="chatUser flex items-center gap-2">
                                <div className="image w-14 h-14">
                                    <img
                                        src={`http://localhost:5000/${suggestedUser?.profilePicture}`}
                                        alt="Profile"
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </div>
                                <Link to={`/profile/${suggestedUser?.username}`}>
                                    <p className="font-semibold text-start">{suggestedUser?.username}</p>
                                    <p className="text-xs text-gray-400">Active 3m ago</p>
                                </Link>
                            </div>
                            <div className="contact flex items-center gap-3">
                                <IoCallOutline size={28} />
                                <BsCameraVideo size={28} />
                                <IoInformationCircleOutline size={28} />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="flex justify-center">
                            <img
                                src={`http://localhost:5000/${suggestedUser?.profilePicture}`}
                                alt="Story"
                                className="rounded-full w-20 h-20 object-cover object-top"
                            />
                        </div>
                        <div className='flex flex-col justify-center items-center'>
                            <p className="text-center mt-2">{suggestedUser?.fullName}</p>
                            <p className="text-center mb-2">{suggestedUser?.username}</p>
                            <Link to={`/profile/${suggestedUser?.username}`}>
                                <button className='px-4 py-2 bg-[#363636] hover:bg-[#272727] duration-150 rounded-lg text-sm font-semibold'>View profile</button>
                            </Link>
                        </div>
                        <div className='w-full h-full'>
                            {messages && Array.isArray(messages) && messages?.map((message, index) => (
                                <div key={index} className={`flex ${message.senderId === userDetails.id ? "justify-end" : "justify-start"} my-1`}>
                                    <div className={`px-3 py-2 rounded-full break-words max-w-sm text-sm ${message.senderId === userDetails.id ? "bg-blue-500" : "bg-zinc-800"}`}>{message?.message}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center p-4">

                        <form className='flex items-center bg-transparent border-[0.1px] border-zinc-800 rounded-full p-2 w-full' onSubmit={(e) => sendMessageHandle(e, suggestedUser._id)}>


                            <button className="ml-2">
                                <FiSmile className="w-6 h-6" />
                            </button>
                            <input
                                type="text"
                                value={textMessage}
                                onChange={e => setTextMessage(e.target.value)}
                                className="flex-grow bg-transparent text-white px-3 py-1 rounded-full outline-none placeholder-zinc-400"
                                placeholder="Message..."
                            />
                            {textMessage.trim() === '' ? (
                                <div className="flex items-center space-x-4 mr-4">
                                    <button>
                                        <TiMicrophoneOutline className="w-6 h-6" />
                                    </button>
                                    <button>
                                        <CiImageOn className="w-6 h-6" />
                                    </button>
                                    <button>
                                        <FaRegHeart className="w-6 h-6" />
                                    </button>
                                </div>
                            ) : (
                                <button onClick={(e) => sendMessageHandle(e, suggestedUser._id)} className="mr-4 text-blue-500 font-semibold">
                                    Send
                                </button>
                            )}
                        </form>

                    </div>

                </div>) : (
                <div className="w-[65.5%] ml-auto h-screen bg-black flex items-center justify-center">
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