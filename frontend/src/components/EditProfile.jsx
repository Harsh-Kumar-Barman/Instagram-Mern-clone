import React, { useState } from 'react'
import Settings from './Setting'
import Sidebar from './Sidebar'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EditProfile() {

    const { id } = useParams();
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();
console.log(id)

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
            await axios.post(`/api/users/edit/${id}`, formData, { withCredentials: true });
            navigate(`/profile/${username}`);
        } catch (error) {
            console.error('Error updating profile:', error.message);
        }
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfileImage(file);
        setPreviewImage(URL.createObjectURL(file));
    };
    return (
        <div>
            <Sidebar />
            <div className="flex w-[81.8%] ml-auto">
                <Settings />
                <div className="w-full min-h-screen bg-black text-white">
                    <div className="w-full min-h-screen flex items-center justify-center bg-black">
                        <form onSubmit={handleSubmit} className="bg-black rounded-lg p-5 w-full h-auto shadow-lg">
                            {/* Profile Header */}
                            <div className="flex items-center justify-center mb-6 bg-zinc-900 p-4 rounded">
                                <img
                                    src={previewImage}
                                    // src='{previewImage || assets.profile_picture}'
                                    alt="Profile"
                                    className="rounded-full w-20 h-20 object-cover object-top"
                                />
                                <div className="ml-4 flex flex-col justify-center items-start">
                                    <h2 className="text-md font-bold">{name}</h2>
                                    <p className="text-white text-xs">{username}</p>
                                </div>
                                <button
                                    type="button"
                                    className="bg-blue-500 hover:bg-blue-600 text-sm text-white font-bold py-2 px-4 rounded-xl ml-auto"
                                >
                                    Change photo
                                </button>
                            </div>

                            {/* Name Input */}
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-white text-sm font-bold mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="shadow appearance-none border text-sm border-zinc-600 rounded-xl w-full py-3 px-3 text-white bg-transparent leading-tight outline-none "
                                    placeholder="Enter your name"
                                />
                            </div>

                            {/* Username Input */}
                            <div className="mb-4">
                                <label htmlFor="username" className="block text-white text-sm font-bold mb-2">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="shadow appearance-none border text-sm border-zinc-600 rounded-xl w-full py-3 px-3 text-white bg-transparent leading-tight outline-none "
                                    placeholder="Enter your username"
                                />
                            </div>

                            {/* Bio Text Area */}
                            <div className="mb-4">
                                <label htmlFor="bio" className="block text-white text-sm font-bold mb-2">
                                    Bio
                                </label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="shadow appearance-none border text-sm border-zinc-600 rounded-xl resize-none w-full py-3 px-3 text-white bg-transparent leading-tight outline-none "
                                    placeholder="Write something about yourself (up to 160 words)"
                                    rows="3"
                                    maxLength="160"
                                />
                            </div>

                            {/* File Input for Profile Image */}
                            <div className="mb-4">
                                <label htmlFor="profileImage" className="block text-white text-sm font-bold mb-2">
                                    Profile Image
                                </label>
                                <input
                                    type="file"
                                    id="profileImage"
                                    name="profileImage"
                                    onChange={handleFileChange}
                                    className="shadow appearance-none border text-sm border-zinc-600 rounded-xl w-full py-4 px-3 text-white bg-transparent leading-tight outline-none "
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-start">
                                <button
                                    type="submit"
                                    className="bg-blue-500 w-1/2 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg outline-none  "
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default EditProfile