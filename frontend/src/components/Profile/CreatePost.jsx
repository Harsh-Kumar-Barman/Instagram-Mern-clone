import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';


const BASE_URL =
import.meta.env.VITE_NODE_ENV === "development"
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD;


const CreatePost = () => {
  const userDetails = useSelector((state) => state.counter.userDetails);
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState([]); // Update to handle multiple files (images or videos)
  const [isResOk, setIsResOk] = useState(true);
  const navigate = useNavigate();

  const handleMediaChange = (e) => {
    setMedia([...e.target.files]); // Store multiple selected files in state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Append each file to formData
    media.forEach((file) => {
      formData.append('media', file);
    });
    
    formData.append('caption', caption);
    formData.append('author', userDetails.id); // Assuming you have author/user info

    try {
      setIsResOk(false);
      const response = await axios.post(`${BASE_URL}/api/posts/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/');

    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsResOk(true);
    }
  };

  return (
    <section aria-labelledby="create-post-title" className="max-w-md mx-auto p-6 bg-surface-container rounded-xl shadow-ambient text-on-surface">
      <h1 id="create-post-title" className="text-2xl font-display font-bold mb-6 text-on-surface">Create a New Post</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="caption" className="block text-xs font-display font-semibold uppercase tracking-wider text-on-surface mb-2">
          Caption
        </label>
        <Input
          id="caption"
          type="text"
          placeholder="Enter your caption here"
          className="mb-4 w-full p-3 bg-surface-container-highest border-none rounded-md text-on-surface outline-none focus-visible:ring-1 focus-visible:ring-primary shadow-none font-body"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          required
        />

        <label htmlFor="media" className="block text-xs font-display font-semibold uppercase tracking-wider text-on-surface mb-2 mt-4">
          Image or Video
        </label>
        <Input
          id="media"
          type="file"
          className="mb-6 w-full border-none bg-surface-container-highest rounded-md file:bg-primary file:text-on-primary file:border-none file:px-4 file:py-1 file:rounded-full file:mr-4 hover:file:opacity-90 shadow-none text-on-surface font-body"
          name="media"
          onChange={handleMediaChange}
          accept="image/*,video/*" // Accept both images and videos
          multiple // Allow multiple files
          required
        />
        {isResOk ? (
          <Button
            type="submit"
            className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary border-none py-6 px-4 rounded-full font-display tracking-wide font-semibold hover:opacity-90 shadow-none"
          >
            Create Post
          </Button>
        ) : (
          <Button
            disabled
            type="submit"
            className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary border-none py-6 px-4 rounded-full font-display tracking-wide font-semibold opacity-80 shadow-none"
          >
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Create Post
          </Button>
        )}
      </form>
    </section>
  );
};

export default CreatePost;