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
function MessagesMember({ socketRef, typingUsers }) {
    const followingUsers = useSelector((state) => state.counter.followingUsers);
    const onlineUsers = useSelector((state) => state.counter.onlineUsers);
    const dispatch = useDispatch()
    return (
        <>
            {/* <SearchDialogWithCheckboxesComponent socketRef={socketRef} /> */}
            <ScrollArea className="flex-grow px-3 py-1 space-y-1">
                {followingUsers?.length > 0 ? (
                    followingUsers.map((suggestedUser) => (
                        <div onClick={() => dispatch(setSuggestedUser(suggestedUser))}
                            key={suggestedUser._id}
                            className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-colors group mb-1 ${onlineUsers?.includes(suggestedUser?._id) ? 'bg-surface-container-lowest editorial-shadow' : 'hover:bg-surface-container-high/50'}`}>
                            <div className="relative flex-shrink-0">
                                <Avatar className="w-14 h-14 bg-surface-container text-on-surface border-none opacity-90 group-hover:opacity-100 transition-opacity">
                                    <AvatarImage className="w-full h-full object-cover object-top" src={'groupName' in suggestedUser ? `${BASE_URL}/${suggestedUser?.groupImage}` : suggestedUser?.profilePicture} alt={`${suggestedUser?.username}'s profile`} />
                                    <AvatarFallback className="font-headline font-bold text-tertiary">{'groupName' in suggestedUser ? `${suggestedUser.groupName?.charAt(0)}` : `${suggestedUser.username?.charAt(0)}`}</AvatarFallback>
                                </Avatar>
                                {onlineUsers?.includes(suggestedUser?._id) && (
                                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-4 border-surface-container-lowest rounded-full"></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0 border-b border-outline-variant/10 pb-1">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <h3 className={`font-headline truncate ${onlineUsers?.includes(suggestedUser?._id) ? 'font-bold text-on-surface tracking-tight' : 'font-medium text-on-surface'}`}>{'groupName' in suggestedUser ? `${suggestedUser.groupName}` : `${suggestedUser.username}`}</h3>
                                    {onlineUsers?.includes(suggestedUser?._id) ? (
                                        <span className="text-[10px] font-medium text-secondary tracking-wider uppercase text-green-500">Active</span>
                                    ) : (
                                        ""
                                    )}
                                </div>
                                <p className={`text-sm truncate leading-tight ${onlineUsers?.includes(suggestedUser?._id) ? 'text-on-surface font-semibold' : 'text-on-surface-variant'}`}>
                                    {typingUsers?.has(suggestedUser?._id) ? (
                                        <span className="text-primary italic font-bold">Typing...</span>
                                    ) : (
                                        suggestedUser?.lastMessage ? (
                                            suggestedUser.lastMessage.messageType === 'text' ? suggestedUser.lastMessage.message : 'Sent an attachment'
                                        ) : 'Start chatting...'
                                    )}
                                </p>
                            </div>
                        </div>
                    ))) : (
                    <div className="flex justify-center py-6">
                        <p className="text-secondary font-body text-sm font-medium tracking-wide">No following users available.</p>
                    </div>
                )}
            </ScrollArea>
        </>
    )
}

export default MessagesMember