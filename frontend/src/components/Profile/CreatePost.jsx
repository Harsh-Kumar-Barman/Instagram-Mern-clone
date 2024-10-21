import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';

const CreatePost = () => {
  const userDetails = useSelector((state) => state.counter.userDetails);
  const [caption, setCaption] = useState('');
  const [media, setMedia] = useState(null); // Update to handle both images and videos
  const [isresOk, setIsResOk] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('media', media); // File input
    formData.append('caption', caption);
    formData.append('author', userDetails.id); // Assuming you have author/user info

    try {
      setIsResOk(false)
      const response = await axios.post('/api/posts/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data)
      navigate('/');

    } catch (error) {
      console.error('Error creating post:', error);
    }
    finally{
      setIsResOk(true)
    }
  };




  return (
    <section aria-labelledby="create-post-title" className="max-w-md mx-auto p-4 text-black bg-white rounded-lg shadow-lg">
      <h1 id="create-post-title" className="text-2xl font-bold mb-4">Create a New Post</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
          Caption
        </label>
        <Input
          id="caption"
          type="text"
          placeholder="Enter your caption here"
          className="mb-4 w-full p-3 border rounded-lg text-black outline-none"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          required
        />

        <label htmlFor="media" className="block text-sm font-medium text-gray-700 mb-2">
          Image or Video
        </label>
        <Input
          id="media"
          type="file"
          className="mb-4 w-full border rounded-lg"
          name="media"
          onChange={(e) => setMedia(e.target.files[0])}
          accept="image/*,video/*" // Accept both images and videos
          required
        />
        {isresOk ?
          <Button
            type="submit"
            className="w-full bg-blue-500 dark:bg-blue-500 text-white dark:text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Post
          </Button>
          :
          <Button disabled
            type="submit"
            className="w-full bg-blue-500 dark:bg-blue-500 text-white dark:text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
            Create Post
          </Button>
        }

      </form>
    </section>
  );
};

export default CreatePost;


// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';
// import { Input } from '../ui/input';
// import { Button } from '../ui/button';
// import { ReloadIcon } from '@radix-ui/react-icons';

// const CreatePost = () => {
//   const userDetails = useSelector((state) => state.counter.userDetails);
//   const [caption, setCaption] = useState('');
//   const [media, setMedia] = useState([]); // Array to hold multiple media files
//   const [isresOk, setIsResOk] = useState(true);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append('caption', caption);
//     formData.append('author', userDetails.id);

//     // Append all selected media files
//     for (let i = 0; i < media.length; i++) {
//       formData.append('media', media[i]);
//     }

//     try {
//       setIsResOk(false);
//       const response = await axios.post('/api/posts/create', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       console.log(response.data);
//       navigate('/');
//     } catch (error) {
//       console.error('Error creating post:', error);
//     } finally {
//       setIsResOk(true);
//     }
//   };

//   return (
//     <section aria-labelledby="create-post-title" className="max-w-md mx-auto p-4 text-black bg-white rounded-lg shadow-lg">
//       <h1 id="create-post-title" className="text-2xl font-bold mb-4">Create a New Post</h1>
//       <form onSubmit={handleSubmit}>
//         <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
//           Caption
//         </label>
//         <Input
//           id="caption"
//           type="text"
//           placeholder="Enter your caption here"
//           className="mb-4 w-full p-3 border rounded-lg text-black outline-none"
//           value={caption}
//           onChange={(e) => setCaption(e.target.value)}
//           required
//         />

//         <label htmlFor="media" className="block text-sm font-medium text-gray-700 mb-2">
//           Image or Video
//         </label>
//         <Input
//           id="media"
//           type="file"
//           className="mb-4 w-full border rounded-lg"
//           name="media"
//           multiple // Allow selecting multiple files
//           onChange={(e) => setMedia(Array.from(e.target.files))} // Store multiple files
//           accept="image/*,video/*" // Accept both images and videos
//           required
//         />

//         {isresOk ?
//           <Button 
//             type="submit"
//             className="w-full bg-blue-500 dark:bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             Create Post
//           </Button>
//           :
//           <Button disabled
//             type="submit"
//             className="w-full bg-blue-500 dark:bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
//             Create Post
//           </Button>
//         }
//       </form>
//     </section>
//   );
// };

// export default CreatePost;
