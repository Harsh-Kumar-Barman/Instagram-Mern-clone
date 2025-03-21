import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setSuggestedUser } from '@/features/userDetail/userDetailsSlice';
import { ScrollArea } from '../ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { SearchDialogWithCheckboxesComponent } from './search-dialog-with-checkboxes';


const BASE_URL =
    import.meta.env.VITE_NODE_ENV === "development"
        ? import.meta.env.VITE_API_BASE_URL_DEV
        : import.meta.env.VITE_API_BASE_URL_PROD;
console.log(BASE_URL)
function MessagesMember({ socketRef }) {
    const followingUsers = useSelector((state) => state.counter.followingUsers);
    const onlineUsers = useSelector((state) => state.counter.onlineUsers);
    const dispatch = useDispatch()
    return (
        <>
            {/* <SearchDialogWithCheckboxesComponent socketRef={socketRef} /> */}
            <ScrollArea className="flex-grow">
                {followingUsers?.length > 0 ? (
                    followingUsers.map((suggestedUser) => (
                        <div onClick={() => dispatch(setSuggestedUser(suggestedUser))}
                            key={suggestedUser._id}
                            className="flex items-center space-x-3 p-3 hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer">
                            <div className="relative">
                                <Avatar className="bg-gray-200 w-14 h-14 md:w-12 md:h-12 dark:bg-neutral-950 dark:text-white">
                                    <AvatarImage className="w-full h-full object-cover object-top" src={'groupName' in suggestedUser ? `${BASE_URL}/${suggestedUser?.groupImage}` : suggestedUser?.profilePicture} alt={`${suggestedUser?.username}'s profile`} />
                                    <AvatarFallback>{'groupName' in suggestedUser ? `${suggestedUser.groupName}` : `${suggestedUser.username}`}</AvatarFallback>
                                </Avatar>
                                {onlineUsers?.includes(suggestedUser?._id) && (<div className="w-3 h-3 absolute top-9 left-9 border-[2px] border-white bg-green-500 rounded-full"></div>)}
                            </div>
                            <div className="flex-grow">
                                <div className="text-sm md:text-sm text-black dark:text-white">{'groupName' in suggestedUser ? `${suggestedUser.groupName}` : `${suggestedUser.username}`}</div>
                                <div className="text-xs dark:text-white flex justify-between">
                                    {onlineUsers?.includes(suggestedUser?._id) && (
                                        <p className="text-xs text-gray-400">Active now</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))) : (
                    <p className="text-gray-500">No following users available.</p>
                )}
            </ScrollArea>
        </>
    )
}

export default MessagesMember