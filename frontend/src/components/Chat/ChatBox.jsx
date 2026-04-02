import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setMessages, setSuggestedUser } from '../../features/userDetail/userDetailsSlice';
import axios from 'axios';
import { AiOutlineMessage } from 'react-icons/ai';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Camera, Heart, Info, Mic, Phone, Smile, Video, X } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "../ui/dialog";
import VideoCall from './VideoCall';
// import { useVideoCall } from '@/hooks/VideoCallContext';


const BASE_URL =
import.meta.env.VITE_NODE_ENV === "development"
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD;

function ChatBox() {
    // const { startCall, localVideoRef, remoteVideoRef } = useVideoCall();
    const suggestedUser = useSelector((state) => state.counter.suggestedUser);
    const userDetails = useSelector((state) => state.counter.userDetails);
    const messages = useSelector((state) => state.counter.messages);
    const [textMessage, setTextMessage] = useState('')
    const [file, setFile] = useState(null); // Store file
    const [filePreview, setFilePreview] = useState(null);
    const [isresOk, setIsResOk] = useState(true);
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    const [selectedMedia, setSelectedMedia] = useState(null); // To track selected media
    const [isDialogOpen, setIsDialogOpen] = useState(false);  // To handle dialog state


    const removeSuggestedUser = (e) => {
        e.preventDefault()
        dispatch(setSuggestedUser(null))
    }


    const handleMediaClick = (mediaUrl) => {
        setSelectedMedia(mediaUrl);
        setIsDialogOpen(true);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFilePreview(URL.createObjectURL(selectedFile)); // Generate preview URL
        }
    };

    const clearFile = () => {
        setFile(null);
        setFilePreview(null); // Clear file preview
    };


    const sendMessageHandle = async (e, reciverId) => {
        e.preventDefault();
        try {
            setIsResOk(false)

            const senderId = userDetails.id;
            // Check if textMessage and file are properly set
            if (!textMessage && !file) {
                return; // Avoid sending if no content
            }

            // Create form data to send media and message
            const formData = new FormData();
            formData.append('senderId', senderId); // Sender ID
            formData.append('textMessage', textMessage); // Text message
            if (file) {
                formData.append('media', file);  // Include file if exists
            }
            formData.append('messageType', file ? (file.type.includes('video') ? 'video' : 'image') : 'text');

            const response = suggestedUser && 'groupName' in suggestedUser ?
                await axios.post(`${BASE_URL}/api/conversations/group/send/message/${suggestedUser?._id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }) :
                await axios.post(`${BASE_URL}/api/conversations/send/message/${reciverId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

            if (response.data.success) {
                dispatch(setMessages([...messages, response.data.newMessage]));
                setTextMessage('');
                setFile(null);  // Reset file input after sending
                setFilePreview(null);
            }
        } catch (error) {
            console.log(error.message);
            if (error?.response && error?.response?.status === 401 || error.response?.status === 403) navigate('/login');
        }
        finally {
            setIsResOk(true)
        }
    };

    useEffect(() => {
        // Scroll to the bottom when the component mounts or when messages change
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            {/* <VideoCall userId={userDetails?.id} socketRef={socketRef} remoteUserId={suggestedUser?._id}  /> */}
            {suggestedUser ?
                (<section className={`flex-1 flex flex-col bg-surface-container-lowest ${suggestedUser ? "w-[90vw] md:w-full" : "w-0"}`}>
                    <header className="flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl sticky top-0 z-20 border-b border-outline-variant/10">
                        <div className="flex items-center gap-4">
                            <button onClick={removeSuggestedUser} className="md:hidden p-2 -ml-2 text-on-surface hover:bg-surface-container rounded-full transition-colors">
                                <span className='text-xl inline-block'>←</span>
                            </button>
                            <div className="relative cursor-pointer" onClick={() => navigate(`/profile/${suggestedUser?.username}`)}>
                                <Avatar className="w-10 h-10 border-none">
                                    <AvatarImage className="object-cover object-top w-full h-full" src={suggestedUser?.profilePicture} />
                                    <AvatarFallback className="font-headline font-bold text-primary">{suggestedUser && 'groupName' in suggestedUser ? suggestedUser?.groupName?.charAt(0) : suggestedUser?.username?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-surface-container-lowest rounded-full"></div>
                            </div>
                            <div className="cursor-pointer" onClick={() => navigate(`/profile/${suggestedUser?.username}`)}>
                                <h2 className="font-headline font-bold text-base leading-tight text-on-surface">{suggestedUser && 'groupName' in suggestedUser ? suggestedUser?.groupName : suggestedUser?.username}</h2>
                                <p className="text-[10px] font-label text-green-600 uppercase tracking-widest">Active Now</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
                                <Phone className="h-5 w-5" />
                            </button>
                            <button onClick={() => navigate(`/call/${suggestedUser?._id}`)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
                                <Video className="h-5 w-5" />
                            </button>
                            <button className="hidden md:flex w-10 h-10 items-center justify-center rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">
                                <Info className="h-5 w-5" />
                            </button>
                        </div>
                    </header>
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-surface-container-low/30">
                        <div className="flex flex-col items-center gap-4 mb-4">
                            <div className="flex justify-center mb-2">
                                <Avatar className="w-20 h-20 shadow-sm border-none">
                                    <AvatarImage className="object-cover object-top w-full h-full" src={suggestedUser?.profilePicture} />
                                    <AvatarFallback className="font-headline font-bold text-xl">{suggestedUser?.username?.charAt(0)}</AvatarFallback>
                                </Avatar>
                            </div>
                            <span className="px-3 py-1 bg-surface-container-high rounded-full text-[10px] font-bold text-on-surface-variant tracking-wider uppercase">{suggestedUser?.fullName}</span>
                        </div>
                        {messages && Array.isArray(messages) && messages?.map((message, index) => {
                            const isSender = message.senderId?._id === userDetails.id || message.senderId === userDetails.id;
                            return (
                                <div key={index} className={`flex gap-3 max-w-[85%] ${isSender ? 'flex-row-reverse ml-auto' : ''}`}>
                                    {!isSender && (
                                        <div className="flex-shrink-0 self-end mb-1">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage
                                                    src={message?.senderId?.profilePicture || suggestedUser?.profilePicture}
                                                    className="w-full h-full object-top object-cover"
                                                />
                                                <AvatarFallback className="text-xs font-headline font-bold">{message?.senderId?.username?.charAt(0) || "U"}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                    )}
                                    <div className={`${isSender ? 'items-end' : 'items-start'} flex flex-col`}>
                                        <div className={`${isSender ? 'bg-gradient-to-br from-primary to-primary-container text-white rounded-br-none' : 'bg-surface-container text-on-surface rounded-bl-none'} px-5 py-3 rounded-2xl shadow-sm leading-relaxed text-sm`}>
                                            {message.messageType === "image" && (
                                                <img
                                                    src={message.mediaUrl}
                                                    alt="Image message"
                                                    className="w-48 object-cover rounded-xl cursor-pointer mb-2"
                                                    onClick={() => handleMediaClick(message.mediaUrl)}
                                                />
                                            )}
                                            {message.messageType === "video" && (
                                                <video
                                                    src={message.mediaUrl}
                                                    className="w-48 object-cover rounded-xl bg-black cursor-pointer mb-2"
                                                    onClick={() => handleMediaClick(message.mediaUrl)}
                                                />
                                            )}
                                            {message.messageType === "text" && (
                                                <span>{message.message}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                        {/* Dialog for displaying media */}
                        {selectedMedia && (
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger className="hidden" />
                                <DialogContent className="bg-transparent border-none shadow-none min-w-[80vw] max-w-[80vw] h-[90vh] flex justify-center items-center">
                                    <DialogClose onClick={() => setIsDialogOpen(false)} />
                                    {selectedMedia.endsWith(".mp4") || selectedMedia.endsWith(".webm") ? (
                                        <video src={selectedMedia} autoPlay controls className="w-full h-full rounded-xl" />
                                    ) : (
                                        <img
                                            src={selectedMedia}
                                            alt="Selected media"
                                            className="w-full h-full rounded-xl object-contain"
                                        />
                                    )}
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>

                    <footer className="p-4 md:p-6 bg-surface-container-lowest border-t border-outline-variant/5">
                        {filePreview && (
                            <div className="relative w-16 h-16 mb-2">
                                {file?.type?.startsWith('image/') ? (
                                    <img src={filePreview} alt="Selected" className="w-full h-full object-cover rounded-md" loading="lazy" />
                                ) : (
                                    <video src={filePreview} controls className="w-full h-full object-cover rounded-md" />
                                )}
                                <div onClick={clearFile} className='absolute -top-2 -right-2 p-1 bg-surface-container-highest rounded-full cursor-pointer editorial-shadow'>
                                    <X className="dark:text-white h-3 w-3" />
                                </div>
                            </div>
                        )}
                        <form onSubmit={(e) => sendMessageHandle(e, suggestedUser._id)} className="flex items-center gap-2 bg-surface-container-low p-2 rounded-3xl transition-all focus-within:ring-2 focus-within:ring-primary/20">
                            <label htmlFor="fileInput">
                                <button type="button" onClick={() => document.getElementById('fileInput').click()} className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors">
                                    <Camera className="h-5 w-5" />
                                </button>
                            </label>
                            <input type="file" accept="image/*,video/*" onChange={handleFileChange} className="hidden" id="fileInput" />
                            <input
                                value={textMessage}
                                onChange={(e) => setTextMessage(e.target.value)}
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 px-2 placeholder:text-on-surface-variant/50 outline-none text-on-surface"
                                placeholder="Type a message..."
                            />
                            <button disabled={!isresOk} type="submit" className="w-10 h-10 flex items-center justify-center bg-primary text-white rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed">
                                {isresOk ? (
                                    <span className="material-symbols-outlined text-[16px] pl-[1px] pt-[2px]" style={{fontVariationSettings: "'FILL' 1"}}>send</span>
                                ) : (
                                    <ReloadIcon className="h-4 w-4 animate-spin" />
                                )}
                            </button>
                        </form>
                    </footer>
                </section>)
                : (
                    <section className="hidden md:flex flex-1 flex-col items-center justify-center bg-surface-container-lowest p-12 text-center">
                        <div className="mb-8 relative">
                            <div className="w-24 h-24 rounded-full bg-surface-container-low flex items-center justify-center">
                                <AiOutlineMessage size={40} className="text-primary/40 -rotate-[25deg]" />
                            </div>
                            <div className="absolute -top-4 -right-4 w-12 h-12 bg-tertiary/10 rounded-full blur-xl"></div>
                            <div className="absolute -bottom-2 -left-6 w-16 h-16 bg-primary/10 rounded-full blur-xl"></div>
                        </div>
                        <h2 className="text-3xl font-black text-on-surface mb-3 font-headline tracking-tighter">Your Messages</h2>
                        <p className="text-on-surface-variant max-w-xs mb-10 font-body leading-relaxed text-balance">
                            Connect with other users, share media, and discuss your latest ideas.
                        </p>
                        <button className="bg-gradient-to-r from-primary to-primary-container text-white font-bold px-8 py-4 rounded-full flex items-center gap-3 editorial-shadow hover:scale-[1.02] active:scale-95 transition-all duration-200">
                            <span>Send Message</span>
                        </button>
                    </section>
                )
            }
        </>
    )
}

export default ChatBox