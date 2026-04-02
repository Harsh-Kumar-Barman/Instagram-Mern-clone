"'use client'"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { BellIcon, LockIcon, UserIcon } from "lucide-react"
import { TiDeviceLaptop } from "react-icons/ti"
import { settingsLinks } from "./settingsLinks"
import { useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
import axios from "axios"
import Sidebar from "../Home/Sidebar"
import { addUser } from "@/features/userDetail/userDetailsSlice"
import { useDispatch } from "react-redux"
import { ReloadIcon } from "@radix-ui/react-icons"


const BASE_URL =
import.meta.env.VITE_NODE_ENV === "development"
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD;


export function ProfileEdit() {
  const { id } = useParams();
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isresOk, setIsResOk] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('name', name);
    formData.append('bio', bio); // Include bio in the form data
    if (profileImage) {
      formData.append('media', profileImage);
    }

    try {
      setIsResOk(false)
      const response = await axios.post(`${BASE_URL}/api/users/edit/${id}`, formData, { withCredentials: true });
      // console.log(response)
      const profilePic = response?.data?.user?.profilePicture
      dispatch(addUser({
        fullName: response?.data?.user?.fullName,
        username: response?.data?.user?.username,
        email: response?.data?.user?.email,
        id: response?.data?.user?._id,
        profilePic: profilePic
      }));
      navigate(`/profile/${username}`);
    } catch (error) {
      console.error('Error updating profile:', error.message);
      if (error.response.statusText === "Unauthorized"||error.response?.status===403) navigate('/login')

    } finally {
      setIsResOk(true)
    }
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };
  return (
    (
      <>
        {/* <Sidebar /> */}
        <div className="flex w-[81.8%] ml-auto">
          <div className="container mx-auto bg-transparent text-on-surface h-screen overflow-y-auto">
            <div className="flex flex-col md:flex-row gap-1">
              <aside className="w-full md:w-80 bg-background text-on-surface p-6 h-screen overflow-y-auto">
                <h2 className="text-2xl font-display font-bold text-on-surface mb-4">Settings</h2>
                <div className="space-y-2 rounded-xl shadow-none p-3 bg-surface-container-low hover:bg-surface-container transition-colors">
                  <div className="font-display font-semibold text-on-surface">Meta</div>
                  <div className="font-display font-semibold text-on-surface">Account Center</div>
                  <div className="text-xs font-body text-on-surface-variant mb-4">
                    Manage your connected experiences and account settings across Meta technologies.
                  </div>
                  <Button variant="ghost" className="w-full px-1 justify-start text-on-surface text-xs font-body hover:bg-surface-container">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Personal details
                  </Button>
                  <Button variant="ghost" className="w-full px-1 justify-start text-on-surface text-xs font-body hover:bg-surface-container">
                    <LockIcon className="mr-2 h-4 w-4" />
                    Password and security
                  </Button>
                  <Button variant="ghost" className="w-full px-1 justify-start text-on-surface text-xs font-body hover:bg-surface-container">
                    <TiDeviceLaptop className="mr-2 h-4 w-4" /> Ad preferences
                  </Button>
                  <Button variant="link" className="text-xs font-body text-primary mt-2 px-0 hover:text-primary-container">See more in Accounts Center</Button>
                </div>
                <div className="mt-8 space-y-2">
                  <div className="font-display font-semibold text-on-surface">How you use Instagram</div>
                  <Button
                    variant="ghost"
                    className="w-full justify-start bg-surface-container text-on-surface font-body">
                    <UserIcon className="mr-2 h-4 w-4" />
                    Edit profile
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-on-surface font-body hover:bg-surface-container">
                    <BellIcon className="mr-2 h-4 w-4" />
                    Notifications
                  </Button>
                </div>
                <div className="mt-8 space-y-2">
                  <div className="font-display font-semibold text-on-surface">Who can see your content</div>
                  {settingsLinks.map((link) => (
                    <Button key={link.id} variant="ghost" className="w-full justify-start text-on-surface font-body hover:bg-surface-container">
                      <span className="mr-2">{link.icon}</span>
                      {link.label}
                    </Button>
                  ))}
                </div>
              </aside>
              <main className="flex-1 bg-background text-on-surface p-6 shadow-none">
                <h1 className="text-3xl font-display font-bold mb-6 text-on-surface">Edit profile</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex items-center gap-4 bg-surface-container p-4 rounded-none">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={previewImage} className="object-cover object-top" />
                      <AvatarFallback>HK</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-display font-semibold text-on-surface">{username}</div>
                      <div className="text-sm font-body text-on-surface-variant">{name}</div>
                    </div>
                    <Button className="ml-auto bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full hover:opacity-90 transition-opacity">Change photo</Button>
                  </div>
                  <div>
                    <Label htmlFor="username" className="font-display text-on-surface font-semibold uppercase text-xs tracking-wider">Username</Label>
                    <Input value={username} onChange={(e) => setUsername(e.target.value)} id="username" placeholder="username" className="resize-none mt-1 h-12 bg-surface-container-high border-none text-on-surface rounded-md font-body focus-visible:ring-1 focus-visible:ring-primary shadow-none" />
                  </div>
                  <div>
                    <Label htmlFor="name" className="font-display text-on-surface font-semibold uppercase text-xs tracking-wider">Name</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} id="name" placeholder="name" className="mt-1 h-12 bg-surface-container-high border-none text-on-surface rounded-md font-body focus-visible:ring-1 focus-visible:ring-primary shadow-none" />
                  </div>
                  <div>
                    <Label htmlFor="bio" className="font-display text-on-surface font-semibold uppercase text-xs tracking-wider">Bio</Label>
                    <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Bio" className="resize-none mt-1 min-h-[100px] bg-surface-container-high border-none text-on-surface rounded-md font-body focus-visible:ring-1 focus-visible:ring-primary shadow-none" />
                    <div className="text-sm font-body text-on-surface-variant text-right mt-2">0 / 150</div>
                  </div>
                  <div>
                    <Label htmlFor="profileImage" className="font-display text-on-surface font-semibold uppercase text-xs tracking-wider">Profile Image</Label>
                    <Input
                      type="file"
                      id="profileImage"
                      name="profileImage"
                      onChange={handleFileChange}
                      className="mt-1 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full hover:opacity-90 transition-opacity dark:text-black"
                    />
                  </div>
                  {
                    isresOk ?
                      <Button className="w-full sm:w-auto bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full hover:opacity-90 py-6 px-10 border-none font-display font-bold">Submit</Button>
                      :
                      <Button disabled className="w-full sm:w-auto bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full opacity-80 py-6 px-10 border-none font-display">  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Submit</Button>
                  }
                </form>
              </main>
            </div>
          </div>
        </div>
      </>)
  );
}