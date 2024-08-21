import React, { useEffect, useState } from 'react';
import myPic from '../assets/myPic.jpeg';
import { FaRegHeart } from "react-icons/fa";
import { IoChatbubbleOutline } from "react-icons/io5";
import { FiSend } from "react-icons/fi";
import { GoBookmark } from "react-icons/go";
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedPost } from '../features/userDetail/userDetailsSlice';
import { FaHeart } from "react-icons/fa";
import axios from 'axios';

function Comment({ open, setOpen }) {
    const dispatch = useDispatch();
    const [comment, setComment] = useState('');
    const [commentsArr, setCommentsArr] = useState([]);
    const PostDetails = useSelector((state) => state.counter.selectedPost);
    const userDetails = useSelector((state) => state.counter.userDetails);

    console.log(PostDetails)
    // Close the modal and reset selected post
    const handleClose = (e) => {
        e.preventDefault();
        dispatch(setSelectedPost(null));
        setOpen(false);
    };

    // Fetch comments from the server
    const fetchComments = async () => {
        try {
            const response = await axios.get(`/api/posts/${PostDetails?._id}/comment`);
            setCommentsArr(response.data.comments);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    // Submit a new comment
    const handleCommentSubmit = async (e, postId) => {
        e.preventDefault();
        if (!comment.trim()) return;
        try {
            const response = await axios.post(`/api/posts/${postId}/comment`, {
                userId: userDetails.id,
                text: comment,
            });
            fetchComments()
            setComment('');
        } catch (error) {
            console.error('Error adding comment:', error);
            setComment(''); // Clear the input in case of an error
        }
    };

    const handleLike = async (e, postId) => {
        e.preventDefault();
        const userId = userDetails.id;
        try {
            const response = await axios.put(`/api/posts/${postId}/like`, {
                userId,
            });

            // Handle the response data if needed
            // console.log('Post liked/unliked successfully:', response.data);

            // Optionally, you might want to update the local state or trigger a re-render
        } catch (error) {
            console.error('Error liking/unliking the post:', error);
        }  
    };

    useEffect(() => {
        if (PostDetails?._id) {
            fetchComments();
        }
    }, [PostDetails]);

    return (
        <div className={`main z-10 text-white ${open ? "flex" : "hidden"} justify-center items-center fixed bg-black/75 w-screen h-screen`}>
            <div className="w-[1198px] h-[580px] flex justify-center items-center">
                <div className="content flex justify-center h-full w-full">
                    {/* Left Image Section */}
                    <div onClick={handleClose} className="right w-full md:w-auto h-full border-r-[.1px] border-zinc-800">
                        <div className="image w-auto h-full overflow-hidden">
                            <img
                                className="max-w-[500px] w-auto h-full object-cover"
                                src={`http://localhost:5000/${PostDetails?.image}`}
                                alt="Post Image"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* Right Details Section */}
                    <div className="left w-[500px] h-full bg-black flex flex-col justify-between">
                        {/* Author Section */}
                        <div className="author border-b-[.1px] border-zinc-800 w-full h-[70px] flex items-center px-4">
                            <div className="flex items-center gap-2">
                                <div className="image w-8 h-8 rounded-full overflow-hidden">
                                    <img
                                        className="w-full h-full object-cover"
                                        src={myPic}
                                        alt={`${userDetails?.username}'s profile`}
                                        loading="lazy"
                                    />
                                </div>
                                <div className="authorDetail">
                                    <p className="text-sm font-semibold">{userDetails?.username}</p>
                                    <p className="text-sm text-zinc-500">{userDetails?.fullName}</p>
                                </div>
                            </div>
                            <div className="ml-auto">
                                <p className="text-sky-500 font-bold text-sm cursor-pointer">Follow</p>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className={`comments-section flex-1 overflow-y-auto p-4 ${commentsArr.length === 0 ? 'flex justify-center items-center' : ''}`}>
                            {commentsArr.length > 0 ? (
                                commentsArr.map((comment) => (
                                    <div key={comment._id} className="mb-2">
                                        <p>
                                            <strong>{comment?.user?.username}: </strong>
                                            {comment.text}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center">No comments yet. Be the first to comment!</p>
                            )}
                        </div>


                        {/* Actions and Like Section */}
                        <div className="actions border-t-[.1px] border-zinc-800 w-full px-4 py-3">
                            <div className="flex justify-between items-center">
                                <div className="flex gap-3">
                                    <button onClick={(e) => handleLike(e, PostDetails?._id)}>
                                    {PostDetails?.likes?.includes(userDetails.id) ?<FaHeart size={25} className="text-red-500" />  : <FaRegHeart size={25} className="hover:text-zinc-500 transition-colors duration-100" />}
                                    </button>
                                    <button>
                                        <IoChatbubbleOutline size={25} className="hover:text-zinc-500 transition-colors duration-100" style={{ transform: 'scaleX(-1)' }} aria-label="Comment" />
                                    </button>
                                    <button>
                                        <FiSend size={25} className="hover:text-zinc-500 transition-colors duration-100" aria-label="Share" />
                                    </button>
                                </div>
                                <div>
                                    <GoBookmark size={25} className="hover:text-zinc-500 transition-colors duration-100" aria-label="Save" />
                                </div>
                            </div>
                            <div className="my-3 text-sm font-semibold">
                                <p>{PostDetails?.likes?.length || 0} likes</p>
                            </div>
                        </div>

                        {/* Bottom Comment Input Section */}
                        <div className="comment-input border-t-[.1px] border-zinc-800 w-full h-[50px] px-4">
                            <form onSubmit={(e) => handleCommentSubmit(e, PostDetails._id)} className="flex items-center pt-3">
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="flex-1 bg-transparent outline-none text-sm"
                                    aria-label="Add a comment"
                                />
                                <button
                                    type="submit"
                                    className={`text-blue-500 font-bold text-sm ${!comment.trim() && 'text-zinc-900'}`}
                                    disabled={!comment.trim()}
                                >
                                    Post
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Comment;
