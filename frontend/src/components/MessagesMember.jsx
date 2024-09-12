import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import myPic from '../assets/myPic.jpeg';
import { setSuggestedUser } from '../features/userDetail/userDetailsSlice';

function MessagesMember() {
    const followingUsers = useSelector((state) => state.counter.followingUsers);
    const onlineUsers = useSelector((state) => state.counter.onlineUsers);
    const dispatch = useDispatch()
    return (
        <>
            <div className="flex-1 overflow-y-auto">
                <div className="flex justify-between px-6 mb-2">
                    <p className="font-semibold">Messages</p>
                    <p className="text-sm font-semibold text-zinc-400">Requests</p>
                </div>
                {followingUsers?.length > 0 ? (
                    followingUsers.map((suggestedUser, index) => (
                        <div onClick={() => dispatch(setSuggestedUser(suggestedUser))} key={index} className=" cursor-pointer hover:bg-[#272727]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 px-6 py-2">
                                    <div className="relative">
                                        <img
                                            src={`http://localhost:5000/${suggestedUser?.profilePicture}`}
                                            alt={`${suggestedUser?.username}'s profile`}
                                            className="rounded-full w-14 h-14 object-cover object-top"
                                        />
                                        {onlineUsers?.includes(suggestedUser?._id) && (
                                            <span className="absolute bottom-0 right-0 block w-5 h-5 bg-green-500 border-[3px] border-black rounded-full"></span>
                                        )}
                                    </div>

                                    <div>
                                        <p className="font-semibold">{suggestedUser?.username}</p>

                                        {onlineUsers?.includes(suggestedUser?._id) && (
                                            <p className="text-xs text-gray-400">Active now</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500">No following users available.</p>
                )}

            </div>
        </>
    )
}

export default MessagesMember