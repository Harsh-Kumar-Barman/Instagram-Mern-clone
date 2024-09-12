import React from 'react'
import { IoCallOutline } from "react-icons/io5";
import { BsCameraVideo } from "react-icons/bs";
import { IoInformationCircleOutline } from "react-icons/io5";
import { FiSmile } from "react-icons/fi";
import { TiMicrophoneOutline } from "react-icons/ti";
import { CiImageOn } from "react-icons/ci";

import { FaRegHeart } from "react-icons/fa";
function ChatArea() {
    return (
        <>
            {/* Chat Area */}

            <div className="w-[65.5%] ml-auto bg-black flex flex-col">
                <div className="w-full h-[75px] px-3 bg-black border-b-[.1px] border-zinc-800 flex items-center">
                    <div className="flex justify-between w-full">
                        <div className="chatUser flex items-center gap-2">
                            <div className="image">
                                <img
                                    src="https://via.placeholder.com/50"
                                    alt="Profile"
                                    className="rounded-full"
                                />
                            </div>
                            <div className="">
                                <p className="font-semibold text-start">Aryan</p>
                                <p className="text-xs text-gray-400">Active 3m ago</p>
                            </div>
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
                            src="https://via.placeholder.com/300"
                            alt="Story"
                            className="rounded-lg"
                        />
                    </div>
                    <p className="text-center mt-4 text-lg">Are you okay?</p>
                </div>

                <div className="flex items-center p-4 "> 
                    <div className="flex items-center bg-transparent border-[0.1px] border-zinc-800 rounded-full p-2 w-full">
                        {/* Left Icon (Smile) */}
                        <button className="  ml-2">
                            <FiSmile className="w-6 h-6" />
                        </button>

                        {/* Input field */}
                        <input
                            type="text"
                            className="flex-grow bg-transparent text-white px-3 py-1 rounded-full outline-none placeholder-zinc-400"
                            placeholder="Message..."
                        />

                        {/* Right Icons */}
                        <div className="flex items-center space-x-4 mr-4">
                            <button className=" ">
                                <TiMicrophoneOutline className="w-6 h-6" />
                            </button>
                            <button className=" ">
                                <CiImageOn className="w-6 h-6" />
                            </button>
                            <button className=" ">
                                <FaRegHeart className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChatArea