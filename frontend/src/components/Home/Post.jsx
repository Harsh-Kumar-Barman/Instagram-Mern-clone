import { useEffect, useRef, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { GoBookmark, GoBookmarkFill } from "react-icons/go";
import CommentForm from "./CommentForm";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Heart, MessageCircle, MoreHorizontal, Send, Volume2, VolumeX } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel';

const Post = ({ post, userDetails, savedPost, followingUserss, handleLike, handleSavePosts, showComments, handleFollowing, handleCommentSubmit, handleDeletePost }) => {
  // console.log(savedPost)

  const videoRef = useRef(null);

  const [isMuted, setIsMuted] = useState(true)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

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
    <div className="space-y-8 mb-6">
      <Card key={post._id} className="w-full border-none rounded-xl bg-surface-container-lowest shadow-ambient overflow-hidden">
        <CardHeader className="flex flex-row items-center space-x-4 px-4 py-4">
          <Link to={`/profile/${post?.author?.username}`}>
            <Avatar>
              <AvatarImage src={post?.author?.profilePicture} className="object-cover object-top" />
              <AvatarFallback>{post?.author?.username}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex flex-grow gap-4">
            <div className="flex flex-col">
              <Link to={`/profile/${post?.author?.username}`}>
                <p className="text-sm font-display tracking-tight font-bold text-on-surface">{post?.author?.username}</p>
              </Link>
              <p className="text-xs font-body text-on-surface-variant">
                {post?.author?.username} song
              </p>
            </div>
            <button onClick={(e) => handleFollowing(e, post.author._id)}>
              <h2 className="text-sm font-display font-semibold transition-colors text-primary hover:text-primary-container">
                {userDetails.id === post.author._id ? "" : !followingUserss?.includes(post.author._id) && "Follow"}
              </h2>
            </button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96">
              <DropdownMenuItem className="text-red-600 justify-center font-bold focus:text-red-600 cursor-pointer">Report</DropdownMenuItem>
              <DropdownMenuSeparator />
              {userDetails?.id == post?.author?._id &&
                <>
                  <DropdownMenuItem onClick={e => handleDeletePost(e, post?._id)} className="text-red-600 justify-center font-bold focus:text-red-600 cursor-pointer">Delete</DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              }
              {followingUserss?.includes(post.author._id) && (
                <>
                  <DropdownMenuItem
                    onClick={(e) => handleFollowing(e, post.author._id)}
                    className="text-red-600 justify-center font-bold focus:text-red-600 cursor-pointer"
                  >
                    Unfollow
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem className="justify-center cursor-pointer">Add to favorites</DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link to={`/profile/${post?.author?.username}/${post.caption}`}>
                <DropdownMenuItem className="justify-center cursor-pointer">Go to post</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center cursor-pointer">Share to...</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center cursor-pointer">Copy link</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center cursor-pointer">Embed</DropdownMenuItem>
              <DropdownMenuSeparator />
              <Link to={`/profile/${post?.author?.username}`}>
                <DropdownMenuItem className="justify-center cursor-pointer">About this account</DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center cursor-pointer">Cancel</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardHeader>

        {post?.media?.length > 1 ?
          (
            <Carousel className="w-full">
              <CarouselContent>
                {post.media.map((mediaItem, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card className="rounded-none border-none">
                        <CardContent onDoubleClick={(e) => handleLike(e, post._id)} className="p-0 relative h-[80vh] bg-surface-container overflow-hidden flex justify-center items-center">
                          {mediaItem?.mediaType === 'video' ? (
                            <>
                              <video
                                src={`${mediaItem?.mediaPath}`}
                                className="w-full h-full aspect-square object-contain"
                                loop
                                autoPlay
                                muted={isMuted}
                                playsInline
                                preload="auto"
                              />
                              <Button
                                variant="ghost"
                                size="icon"
                                className="absolute w-8 h-8 bottom-2 right-2 rounded-full bg-black/50 hover:bg-black/70"
                                onClick={() => setIsMuted(!isMuted)}
                              >
                                {isMuted ? (
                                  <VolumeX className="h-4 w-4 text-white" />
                                ) : (
                                  <Volume2 className="h-4 w-4 text-white" />
                                )}
                              </Button>
                            </>
                          ) : (
                            <img
                              src={`${mediaItem?.mediaPath}`}
                              alt={`Post `}
                              className="w-full h-full aspect-square object-cover rounded-sm object-top"
                              loading="lazy"
                            />
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-3 text-on-surface bg-surface/80 hover:bg-surface border-none shadow-ambient backdrop-blur-sm w-8 h-8" />
              <CarouselNext className="right-3 text-on-surface bg-surface/80 hover:bg-surface border-none shadow-ambient backdrop-blur-sm w-8 h-8" />
            </Carousel>
          )
          :
          (
            <CardContent onDoubleClick={(e) => handleLike(e, post._id)} className="p-0 relative h-[80vh] bg-surface-container overflow-hidden flex justify-center items-center">
              {post?.media[0]?.mediaType === 'video' ? (
                <>
                  <video
                    src={`${post?.media[0]?.mediaPath}`}
                    className="w-full h-full aspect-square object-contain"
                    loop
                    autoPlay
                    muted={isMuted}
                    playsInline
                    preload="auto"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute w-8 h-8 bottom-2 right-2 rounded-full bg-black/50 hover:bg-black/70"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? (
                      <VolumeX className="h-4 w-4 text-white" />
                    ) : (
                      <Volume2 className="h-4 w-4 text-white" />
                    )}
                  </Button>
                </>
              ) : (
                <img
                  src={`${post?.media[0]?.mediaPath}`}
                  alt={`Post `}
                  className="w-full h-full aspect-square object-cover rounded-sm object-top"
                  loading="lazy"
                />
              )}
            </CardContent>
          )
        }
        <CardFooter className="flex flex-col items-start px-4 py-4 space-y-2">
          <div className="flex items-center justify-between w-full">
            <div className="flex space-x-2 text-on-surface">
              <button onClick={(e) => handleLike(e, post._id)} variant="ghost" size="icon">
                {post?.likes?.includes(userDetails.id) ? <FaHeart className="w-6 h-6 text-error" /> : <Heart className="w-6 h-6 hover:scale-110 transition-transform" />}
              </button>
              <Button onClick={(e) => showComments(e, post)} variant="ghost" size="icon">
                <MessageCircle className="w-6 h-6 -rotate-90" />
              </Button>
              <Button variant="ghost" size="icon">
                <Send className="w-6 h-6" />
              </Button>
            </div>
            <button onClick={(e) => handleSavePosts(e, post._id)} variant="ghost" size="icon" className="text-on-surface">
              {Array.isArray(savedPost) && savedPost.includes(post._id) ? <GoBookmarkFill size={25} /> : <GoBookmark size={25} className="hover:text-on-surface-variant transition-colors duration-100" />}
            </button>
          </div>
          <p className="text-sm font-display font-semibold text-on-surface">
            {post?.likes?.length > 0 ? `${post?.likes?.length} likes` : ""}
          </p>
          <div className="text-sm font-body text-on-surface">
            <p className="font-semibold inline mr-2 font-display">
              {post?.caption}
            </p>
            <span className="text-on-surface-variant">This is a sample caption for post . #instagram #clone</span>
          </div>
          <button onClick={(e) => showComments(e, post)}
            className="text-sm font-body text-on-surface-variant hover:text-on-surface transition-colors"
          >
            {post?.comments?.length > 0 ? `View all ${post?.comments?.length} comments` : ""}
          </button>
        </CardFooter>
        <CommentForm postId={post._id} handleCommentSubmit={handleCommentSubmit} />
      </Card>
    </div>

  );
};

export default Post;