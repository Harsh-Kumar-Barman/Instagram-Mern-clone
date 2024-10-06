import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setSuggestedUser } from '../features/userDetail/userDetailsSlice';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

function MessagesMember() {
    const followingUsers = useSelector((state) => state.counter.followingUsers);
    const onlineUsers = useSelector((state) => state.counter.onlineUsers);
    const dispatch = useDispatch()
    return (
        <>
            <ScrollArea className="flex-grow">
                {followingUsers?.length > 0 ? (
                    followingUsers.map((suggestedUser) => (
                        <div onClick={() => dispatch(setSuggestedUser(suggestedUser))}
                            key={suggestedUser._id}
                            className="flex items-center space-x-3 p-3 hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer">
                            <Avatar className="bg-gray-200 dark:bg-neutral-950 dark:text-white relative">
                                {/* <AvatarImage src={conversation.avatar} alt={conversation.name} /> */}
                                <AvatarImage className="object-cover object-top" src={`http://localhost:5000/${suggestedUser?.profilePicture}`} alt={`${suggestedUser?.username}'s profile`} />
                                <AvatarFallback>{suggestedUser?.username}</AvatarFallback>
                            </Avatar>
                            <div className="flex-grow">
                                <div className="font-semibold text-sm text-black dark:text-white">{suggestedUser?.username}</div>
                                <div className="text-xs text-black dark:bg-neutral-950 dark:text-white flex justify-between">
                                    {onlineUsers?.includes(suggestedUser?._id) && (
                                        <p className="text-xs text-gray-400">Active now</p>
                                    )}
                                </div>
                            </div>
                            {onlineUsers?.includes(suggestedUser?._id) && (<div className="w-3 h-3 absolute top-10 left-7 border-[2px] border-white bg-green-500 rounded-full"></div>)}
                        </div>
                    ))) : (
                    <p className="text-gray-500">No following users available.</p>
                )}
            </ScrollArea>
        </>
    )
}

export default MessagesMember