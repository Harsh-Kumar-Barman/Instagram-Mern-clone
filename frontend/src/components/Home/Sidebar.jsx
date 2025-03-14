import React, { useState } from 'react';
import { BiSolidMoviePlay } from "react-icons/bi";
import { FiSend } from "react-icons/fi";
import { CiSquarePlus } from "react-icons/ci";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { X } from "lucide-react"
import axios from 'axios';
import { Button } from '../ui/button';
import { Compass, Film, Heart, Home, Instagram, Menu, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';  // Import shadcn Sheet
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { ReloadIcon } from '@radix-ui/react-icons';


const BASE_URL =
import.meta.env.VITE_NODE_ENV === "development"
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD;


function Sidebar({ compact }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [step, setStep] = useState(1);
    const [filePreview, setFilePreview] = useState([]);
    const [storyMedia, setStoryMedia] = useState([]);
    const [storyPreviews, setStoryPreviews] = useState([]);
    const [caption, setCaption] = useState("");
    const [media, setMedia] = useState([]);
    const [isResOk, setIsResOk] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate()
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [type, setType] = useState("");

    // Reset dialog state when closed
    const handleOpenChange = (open) => {
        setIsOpen(open);
        if (!open) {
            resetState();
        }
    };

    const resetState = () => {
        setSelectedOption(null);
        setStep(1);
        setFilePreview([]);
        setStoryMedia([]);
        setStoryPreviews([]);
        setCaption("");
        setIsSubmitting(false);
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
    };

    const handleMediaChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newPreviews = [];

            Array.from(e.target.files).forEach((file) => {
                const isImage = file.type.startsWith("image/");
                const url = URL.createObjectURL(file);
                newPreviews.push({ url, isImage });
            });
            setMedia([...e.target.files]);
            setFilePreview([...filePreview, ...newPreviews]);
        }
    };

    const handleStoryFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            const newPreviews = [];

            newFiles.forEach((file) => {
                const isImage = file.type.startsWith("image/");
                const url = URL.createObjectURL(file);
                newPreviews.push({ url, isImage });
            });
            const file = e.target.files[0];
            setMedia(file);
            setType(file.type.startsWith("video") ? "video" : "image");
            setStoryMedia([...storyMedia, ...newFiles]);
            setStoryPreviews([...storyPreviews, ...newPreviews]);
        }
    };

    const clearFile = (index) => {
        const updatedPreviews = [...filePreview];
        updatedPreviews.splice(index, 1);
        setFilePreview(updatedPreviews);
    };

    const clearStoryFile = (index) => {
        const updatedMedia = [...storyMedia];
        const updatedPreviews = [...storyPreviews];
        updatedMedia.splice(index, 1);
        updatedPreviews.splice(index, 1);
        setStoryMedia(updatedMedia);
        setStoryPreviews(updatedPreviews);
    };

    const handleNext = () => {
        if (filePreview.length > 0) {
            setStep(2);
        }
    };

    // const handleSubmit = async () => {
    //   setIsSubmitting(true);
    //   // Simulate API call
    //   setTimeout(() => {
    //     console.log("Post created with caption:", caption);
    //     console.log("Media files:", filePreview.length);
    //     setIsSubmitting(false);
    //     setIsOpen(false);
    //     resetState();
    //   }, 1500);
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();

        // Append each file to formData
        media.forEach((file) => {
            formData.append('media', file);
        });

        formData.append('caption', caption);
        formData.append('author', userDetails.id); // Assuming you have author/user info
        console.log(caption, filePreview)

        try {
            setIsSubmitting(true);
            const response = await axios.post(`${BASE_URL}/api/posts/create`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate('/');

        } catch (error) {
            console.error('Error creating post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };




    // const handleStoryUpload = async () => {
    //   if (storyMedia.length === 0) return;

    //   setIsSubmitting(true);
    //   // Simulate API call
    //   setTimeout(() => {
    //     console.log("Story uploaded with files:", storyMedia.length);
    //     setIsSubmitting(false);
    //     setIsOpen(false);
    //     resetState();
    //   }, 1500);
    // };



    const handleStoryUpload = async (e) => {
        setIsSubmitting(true)
        e.preventDefault();
        const formData = new FormData();
        formData.append("media", media);
        formData.append("type", type);

        try {
            const response = await axios.post(`${BASE_URL}/api/story/uploadStory`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            console.log("Story uploaded:", response.data);
        } catch (error) {
            console.error("Error uploading story:", error);
        }
        finally {
            setStoryMedia([]);
            setStoryPreviews([]);
            setIsOpen(false)
            setIsSubmitting(false)
            setMedia(null)
        }
    };




    const userDetails = useSelector((state) => state.counter.userDetails);
    let RTMNotification = useSelector((state) => state.counter.rtmNotification);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isSearchOpenMobile, setIsSearchOpenMobile] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);  // State to toggle notification sheet
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    RTMNotification = Object.values(RTMNotification);

    const handleSearchClick = () => {
        setIsSearchOpen(!isSearchOpen);
    };
    const handleSearchClickMobile = () => {
        setIsSearchOpenMobile(!isSearchOpenMobile);
    };

    const handleSearchChange = async (e) => {
        const searchQuery = e.target.value;
        setQuery(searchQuery);
        if (searchQuery) {
            try {
                const response = await axios.get(`${BASE_URL}/api/search/users?query=${searchQuery}`);
                console.log(response.data)
                setResults(response.data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        } else {
            setResults([]);
        }
    };

    const links = [
        { id: 1, icon: <Home className="mr-2 h-6 w-6" />, label: "Home", link: '/' },
        { id: 2, icon: <Search className="mr-2 h-6 w-6" />, label: "Search", link: '#', onClick: handleSearchClick },
        { id: 3, icon: <Compass className="mr-2 h-6 w-6" />, label: "Explore", link: '/explore/' },
        { id: 4, icon: <BiSolidMoviePlay className='mr-2 h-6 w-6' />, label: "Reels", link: '/reels/' },
        { id: 5, icon: <FiSend className="mr-2 h-6 w-6" />, label: "Messages", link: '/direct/inbox' },
        { id: 6, icon: <Heart className="mr-2 h-6 w-6" />, label: "Notification", link: '#', onClick: () => setIsNotificationOpen(true) },
        { id: 7, icon: <CiSquarePlus className='mr-2 h-6 w-6' />, label: "Create", link: '/' },
        {
            id: 8,
            icon: (
                <Avatar className="w-6 h-6 mr-2">
                    <AvatarImage src={userDetails.profilePic} alt={`${userDetails.username}`} className="object-cover object-top" />
                    <AvatarFallback>{userDetails.username}</AvatarFallback>
                </Avatar>
            ),
            label: "Profile",
            link: `/profile/${userDetails.username}`,
        }
    ];

    const smLinks = links.filter(link => ['Home', 'Search', 'Create', 'Reels', 'Profile'].includes(link.label));


    return (
        <>
            <aside
                className={`fixed left-0 top-0 bottom-0 z-30 hidden md:flex flex-col w-[72px] lg:w-60 p-3 border-r border-zinc-300 dark:border-zinc-800 bg-white dark:text-white dark:bg-neutral-950`}>
                <Link to='/'>
                    <h1 className="text-xl font-semibold mb-8 mt-8 ml-4 flex gap-2">
                        <Instagram />
                        <span className='hidden lg:inline'>Instagram</span>
                    </h1>
                </Link>
                <nav className="space-y-5 flex-grow">
                    {links.map((link) => (
                        <div key={link.id}>
                            {link.label === 'Notification' ? (
                                <>
                                    <Button variant="ghost" className="w-full justify-start relative" onClick={link.onClick}>
                                        <span className='w-8 h-8'>{link.icon}</span>
                                        <span className='hidden lg:inline'>{link.label}</span>
                                        {RTMNotification && RTMNotification.length > 0 && (
                                            <div className="absolute top-1 left-8 h-3 w-3 rounded-full bg-red-500 border-2 border-black text-xs">
                                                {/* Notification badge */}
                                            </div>
                                        )}
                                    </Button>
                                    <Sheet open={isNotificationOpen} onOpenChange={setIsNotificationOpen}>
                                        <SheetTrigger asChild>
                                            <div className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-neutral-950 z-20 transition-transform duration-300 ${isNotificationOpen ? 'transform-none' : '-translate-x-full'}`} />
                                        </SheetTrigger>
                                        <SheetContent side="left" className="w-full p-4 bg-white dark:bg-neutral-950 dark:text-white border-r-[.2px] border-zinc-800 rounded-tr-2xl rounded-br-2xl transition-transform duration-300">
                                            <h2 className="font-semibold text-lg mb-4">Notifications</h2>
                                            <ScrollArea className="h-48 p-4">
                                                {RTMNotification && Array.isArray(RTMNotification) && RTMNotification.map((user) => (
                                                    <div className="flex flex-col gap-5 justify-center " key={user.id}>
                                                        <div className="flex items-center space-x-4 p-0 my-2">
                                                            <Link to={`/profile/${user.username}`} className='flex items-center gap-4'>
                                                                <Avatar className="w-10 h-10">
                                                                    <AvatarImage src={user.userPic} alt={user.username} />
                                                                    <AvatarFallback>{user.username}</AvatarFallback>
                                                                </Avatar>
                                                                <div className="flex flex-col items-start">
                                                                    <p className="font-medium text-sm">{user.username}</p>
                                                                    <p className="text-sm text-gray-500">Liked your post</p>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                ))}
                                            </ScrollArea>
                                        </SheetContent>
                                    </Sheet>
                                </>
                            ) : link.label === 'Search' ? (
                                <>
                                    <Button variant="ghost" className="w-full justify-start relative" onClick={link.onClick}>
                                        <span className='w-8 h-8'>{link.icon}</span>
                                        <span className='hidden lg:inline'>{link.label}</span>
                                    </Button>
                                    <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                                        <SheetTrigger asChild>
                                            <div className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-neutral-950 z-20 transition-transform duration-300 ${isSearchOpen ? 'transform-none' : '-translate-x-full'}`} />
                                        </SheetTrigger>
                                        <SheetContent side="left" className="w-full p-4 bg-white dark:bg-neutral-950 dark:text-white border-r-[.2px] border-zinc-800 rounded-tr-3xl rounded-br-3xl transition-transform duration-300">
                                            <h2 className="font-semibold text-lg mb-4">Search</h2>
                                            <input
                                                type="text"
                                                value={query}
                                                onChange={handleSearchChange}
                                                placeholder="Search users"
                                                className="w-full p-2 rounded-md border dark:border-zinc-800 bg-white dark:bg-neutral-950"
                                            />
                                            <ScrollArea className="h-48 py-4">
                                                {results.length > 0 && results.map((user) => (
                                                    <Link to={`/profile/${user.username}`} key={user._id} className="flex items-center gap-2 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-2">
                                                        <Avatar className="w-10 h-10">
                                                            <AvatarImage src={user.profilePicture} alt={user.username} className="object-cover object-top" />
                                                            <AvatarFallback>{user.username}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex flex-col">
                                                            <p className="font-medium text-sm">{user.username}</p>
                                                            <p className="text-sm text-gray-500">{user.fullName}</p>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </ScrollArea>
                                        </SheetContent>
                                    </Sheet>
                                </>
                            ) : link.label === "Create" ? <>
                                <Dialog open={isOpen} onOpenChange={handleOpenChange}>
                                    <DialogTrigger asChild>
                                        {/* <Button variant="outline">Create New</Button> */}
                                        <div className="flex ml-4 cursor-pointer">
                                            <span>{link.icon}</span>
                                            {!compact && <span className="hidden lg:inline">{link.label}</span>}
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[800px] h-auto">
                                        <DialogHeader>
                                            {!selectedOption ? (
                                                <DialogTitle className="dark:text-white">Select an Option</DialogTitle>
                                            ) : selectedOption === "post" ? (
                                                <DialogTitle className="dark:text-white">{step === 1 ? "Create Post" : "Add Caption"}</DialogTitle>
                                            ) : (
                                                <DialogTitle>Upload Story</DialogTitle>
                                            )}
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            {!selectedOption ? (
                                                // Initial options
                                                <div className="grid gap-2">
                                                    <Button onClick={() => handleOptionSelect("post")}>Create Post</Button>
                                                    <Button onClick={() => handleOptionSelect("story")}>Upload Story</Button>
                                                </div>
                                            ) : selectedOption === "post" ? (
                                                // Post creation flow
                                                <>
                                                    {step === 1 ? (
                                                        <div className="grid gap-4">
                                                            <div className="grid grid-cols-1 items-center gap-4">
                                                                <Input
                                                                    id="image"
                                                                    type="file"
                                                                    accept="image/*,video/*"
                                                                    onChange={handleMediaChange}
                                                                    className="w-full"
                                                                    multiple
                                                                />
                                                            </div>

                                                            {filePreview.length > 0 && (
                                                                <div className="grid grid-cols-4 gap-2">
                                                                    {filePreview.map((preview, index) => (
                                                                        <div key={index} className="relative aspect-square">
                                                                            {preview.isImage ? (
                                                                                <img
                                                                                    src={preview.url || "/placeholder.svg"}
                                                                                    alt="Selected"
                                                                                    className="w-full h-full object-cover rounded-md"
                                                                                />
                                                                            ) : (
                                                                                <video src={preview.url} controls className="w-full h-full object-cover rounded-md" />
                                                                            )}
                                                                            <button
                                                                                onClick={() => clearFile(index)}
                                                                                className="absolute right-1 top-1 p-1 bg-black/50 rounded-full"
                                                                                type="button"
                                                                            >
                                                                                <X className="text-white h-4 w-4" />
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}

                                                            <Button onClick={handleNext} className="w-full" disabled={filePreview.length === 0}>
                                                                Next
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className="grid gap-4">
                                                            <div className="border p-4 rounded-lg">
                                                                <textarea
                                                                    value={caption}
                                                                    onChange={(e) => setCaption(e.target.value)}
                                                                    placeholder="Write a caption..."
                                                                    rows={4}
                                                                    className="w-full border-none focus:outline-none bg-transparent dark:text-white resize-none"
                                                                />
                                                            </div>

                                                            <Button onClick={handleSubmit} className="w-full" disabled={isSubmitting}>
                                                                {isSubmitting ? (
                                                                    <>
                                                                        <svg
                                                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            fill="none"
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            <circle
                                                                                className="opacity-25"
                                                                                cx="12"
                                                                                cy="12"
                                                                                r="10"
                                                                                stroke="currentColor"
                                                                                strokeWidth="4"
                                                                            ></circle>
                                                                            <path
                                                                                className="opacity-75"
                                                                                fill="currentColor"
                                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                            ></path>
                                                                        </svg>
                                                                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                                                        Creating Post...
                                                                    </>
                                                                ) : (
                                                                    "Create Post"
                                                                )}
                                                            </Button>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                // Story upload flow
                                                <div className="grid gap-4">
                                                    <div className="grid grid-cols-1 items-center gap-4">
                                                        <Input
                                                            id="story"
                                                            type="file"
                                                            accept="image/*,video/*"
                                                            onChange={handleStoryFileChange}
                                                            className="w-full"
                                                            multiple
                                                        />
                                                    </div>

                                                    {storyPreviews.length > 0 && (
                                                        <div className="grid grid-cols-3 gap-2">
                                                            {storyPreviews.map((preview, index) => (
                                                                <div key={index} className="relative aspect-square">
                                                                    {preview.isImage ? (
                                                                        <img
                                                                            src={preview.url || "/placeholder.svg"}
                                                                            alt={`Story Preview ${index + 1}`}
                                                                            className="w-full h-full object-cover rounded-md"
                                                                        />
                                                                    ) : (
                                                                        <video src={preview.url} controls className="w-full h-full object-cover rounded-md" />
                                                                    )}
                                                                    <button
                                                                        onClick={() => clearStoryFile(index)}
                                                                        className="absolute right-1 top-1 p-1 bg-black/50 rounded-full"
                                                                        type="button"
                                                                    >
                                                                        <X className="text-white h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <Button onClick={handleStoryUpload} className="w-full" disabled={isSubmitting || storyMedia.length === 0}>
                                                        {isSubmitting ? (
                                                            <>
                                                                <svg
                                                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <circle
                                                                        className="opacity-25"
                                                                        cx="12"
                                                                        cy="12"
                                                                        r="10"
                                                                        stroke="currentColor"
                                                                        strokeWidth="4"
                                                                    ></circle>
                                                                    <path
                                                                        className="opacity-75"
                                                                        fill="currentColor"
                                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                                    ></path>
                                                                </svg>
                                                                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                                                                Uploading Story...
                                                            </>
                                                        ) : (
                                                            "Upload Story"
                                                        )}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </> : (
                                <Button variant="ghost" className="w-full justify-start" asChild>
                                    <Link to={link.link}>
                                        <span className='w-8 h-8'>{link.icon}</span>
                                        <span className="hidden lg:inline">{link.label}</span>
                                    </Link>
                                </Button>
                            )}
                        </div>
                    ))}
                </nav>
                <Button variant="ghost" className="w-full justify-start mt-auto" asChild>
                    <Link to='/' >
                        <Menu className="mr-2 h-6 w-6" />
                        <span className="hidden lg:inline">More</span>
                    </Link>
                </Button>
            </aside>

            {/* Bottom navigation bar for small screens */}
            <nav className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-around border-t border-zinc-300 dark:border-zinc-800 bg-white dark:text-white dark:bg-neutral-950 md:hidden p-2">
                {smLinks.map((link) => (
                    <Button variant="ghost" className="w-full justify-center" asChild key={link.id}>
                        {link.onClick ?
                            <>
                                <Link to={link.link} onClick={handleSearchClickMobile}>
                                    <span className="w-6 h-6">{link.icon}</span>
                                </Link>
                            </>
                            :
                            <>
                                <Link to={link.link}>
                                    <span className="w-6 h-6">{link.icon}</span>
                                </Link>
                            </>
                        }
                    </Button>
                ))}
            </nav>

            {/* Search drawer for small screens */}
            <Sheet open={isSearchOpenMobile} onOpenChange={setIsSearchOpenMobile}>
                <SheetTrigger asChild>
                    <div />
                </SheetTrigger>
                <SheetContent side="bottom" className="w-full p-4 bg-white dark:bg-neutral-950 dark:text-white border-t-[.2px] border-zinc-800 rounded-tr-3xl rounded-tl-3xl transition-transform duration-300">
                    <h2 className="font-semibold text-lg mb-4">Search</h2>
                    <input
                        type="text"
                        value={query}
                        onChange={handleSearchChange}
                        placeholder="Search users"
                        className="w-full p-2 rounded-md border dark:border-zinc-800 bg-white dark:bg-neutral-950"
                    />
                    <ScrollArea className="h-48 py-4">
                        {results.length > 0 && results.map((user) => (
                            <Link to={`/profile/${user.username}`} key={user._id} className="flex items-center gap-2 py-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-2">
                                <Avatar className="w-10 h-10">
                                    <AvatarImage src={user.profilePicture} alt={user.username} className="object-cover object-top" />
                                    <AvatarFallback>{user.username}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <p className="font-medium text-sm">{user.username}</p>
                                    <p className="text-sm text-gray-500">{user.fullName}</p>
                                </div>
                            </Link>
                        ))}
                    </ScrollArea>
                </SheetContent>
            </Sheet>
        </>
    );
}

export default Sidebar;