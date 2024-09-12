import { useEffect, useRef, useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { IoChatbubbleOutline } from "react-icons/io5";
import { FiSend } from "react-icons/fi";
import { IoPlay, IoPause } from "react-icons/io5";
import { GoBookmark, GoBookmarkFill } from "react-icons/go";
import CommentForm from "./CommentForm";
import { Link } from "react-router-dom";

const Post = ({ post, userDetails, savedPost, followingUserss, handleLike, handleSavePosts, showComments, handleFollowing, handleCommentSubmit }) => {

  const videoRef = useRef(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [showPlayPauseIcon, setShowPlayPauseIcon] = useState(false);
  const isImage = post.mediaType === 'image';
  const isVideo = post.mediaType === 'video';

  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && entry.target === videoRef.current) {
        videoRef.current.play();
        setIsVideoPlaying(true);
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      }
    });
  };


  const handleVideoClick = () => {
    if (isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    } else {
      videoRef.current.play();
      setIsVideoPlaying(true);
    }
  };


  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.75, // Play when 75% of the video is visible
    });

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, [videoRef]);
  return (
    <article className="mb-6 border-b border-zinc-800">
      <header className="flex items-center gap-2 px-1">
        <div className="w-[42px] h-[42px] border border-zinc-500 rounded-full overflow-hidden p-0.5">
          <img className="w-full h-full rounded-full object-cover" src={`http://localhost:5000/${post?.author?.profilePicture}`} alt={post.author.username} />
        </div>
        <Link to={`/profile/${post?.author?.username}`}>
          <h2 className="text-sm font-bold flex items-center">{post.author.username}.</h2>
        </Link>
        <button onClick={(e) => handleFollowing(e, post.author._id)}>
          <h2 className="text-sm font-bold text-sky-500">
            {userDetails.id === post.author._id ? "" : followingUserss?.includes(post.author._id) ? "Unfollow" : "Follow"}
          </h2>
        </button>
      </header>

      <figure
        className="mt-2 w-full h-[60vh] sm:h-[400px] md:h-[500px] lg:h-[585px] border-[.1px] border-zinc-800 flex justify-center items-center sm:rounded overflow-hidden relative group"

      >
        {isImage && (
          <img
            onDoubleClick={(e) => handleLike(e, post._id)}
            src={`http://localhost:5000/${post.mediaPath}`}
            alt={post.caption}
            className={`object-cover ${post.imageWidth > 468 ? `w-[${post.imageWidth}px]` : `w-[${post.imageWidth}px]`} ${post.imageHeight > 585 ? `h-[${post.imageHeight}px]` : `h-[${post.imageHeight}px]`} hover:scale-105 duration-300`}
          />
        )}
        {isVideo && (
          <video
            ref={videoRef}
            onClick={handleVideoClick}
            autoPlay
            muted
            src={`http://localhost:5000/${post.mediaPath}`}
            loop
            className={`object-cover ${post.imageWidth > 468 ? `w-full` : `w-[${post.imageWidth}px]`} ${post.imageHeight > 585 ? `h-full` : `h-[${post.imageHeight}px]`} duration-300`}
          />
        )}
        {isVideo && showPlayPauseIcon && (
          <div
            className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-30"
            onClick={handleVideoClick}
          >
            {isVideoPlaying ? (
              <IoPause size={50} className="text-white" />
            ) : (
              <IoPlay size={50} className="text-white" />
            )}
          </div>
        )}
      </figure>

      <div className="flex justify-between items-center mt-4 px-2">
        <div className="flex gap-3">
          <button onClick={(e) => handleLike(e, post._id)}>
            {post.likes.includes(userDetails.id) ? (
              <FaHeart size={25} className="text-red-500" />
            ) : (
              <FaRegHeart size={25} className="hover:text-zinc-500 transition-colors text-white duration-100" />
            )}
          </button>
          <button onClick={(e) => showComments(e, post)}>
            <IoChatbubbleOutline className="hover:text-zinc-500 transition-colors text-white duration-100" size={25} style={{ transform: 'scaleX(-1)' }} />
          </button>
          <FiSend size={25} className="hover:text-zinc-500 transition-colors text-white duration-100" />
        </div>
        <button onClick={(e) => handleSavePosts(e, post._id)}>
          {Array.isArray(savedPost) && savedPost.includes(post._id) ? (
            <GoBookmarkFill size={25} className="text-white" />
          ) : (
            <GoBookmark size={25} className="hover:text-zinc-500 transition-colors text-white duration-100" />
          )}

        </button>
      </div>

      <div className="my-3 text-sm font-semibold px-2">
        <p>{post.likes.length > 0 ? post.likes.length + " likes" : ""}</p>
        <p>{post.caption}</p>
      </div>

      <div className="px-2">
        {post.comments.length > 0 && (
          <button onClick={(e) => showComments(e, post)} className="text-zinc-400 text-sm cursor-pointer">
            View all {post.comments.length} comments
          </button>
        )}
      </div>
      <CommentForm postId={post._id} handleCommentSubmit={handleCommentSubmit} />
    </article>
  );
};

export default Post;