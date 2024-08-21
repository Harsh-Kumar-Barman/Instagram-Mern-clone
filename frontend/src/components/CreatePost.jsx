// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';


// const CreatePost = () => {
//   const userDetails=useSelector((state)=>state.counter.userDetails)
//   const [caption, setCaption] = useState('');
//   const [image, setImage] = useState(null);
//   const navigate = useNavigate()


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append('caption', caption);
//     formData.append('image', image);
//     formData.append('author', userDetails.id);

//     try {
//       await axios.post('/api/posts', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       navigate('/')
//       // Redirect or refresh posts after successful submission
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input
//         type="text"
//         placeholder="Caption"
//         className="mb-3 w-full p-2 border rounded"
//         value={caption}
//         onChange={(e) => setCaption(e.target.value)}
//       />
//       <input
//         type="file"
//         className="mb-3 w-full p-2 border rounded"
//         name='image'
//         onChange={(e) => setImage(e.target.files[0])}
//       />
//       <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
//         Create Post
//       </button>
//     </form>
//   );
// };

// export default CreatePost;


import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const CreatePost = () => {
  const userDetails = useSelector((state) => state.counter.userDetails);
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('image', image);
    formData.append('author', userDetails.id);

    try {
      await axios.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      navigate('/');
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  return (
    <section aria-labelledby="create-post-title" className="max-w-md mx-auto p-4 text-black bg-white rounded-lg shadow-lg">
      <h1 id="create-post-title" className="text-2xl font-bold mb-4">Create a New Post</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-2">
          Caption
        </label>
        <input
          id="caption"
          type="text"
          placeholder="Enter your caption here"
          className="mb-4 w-full p-3 border rounded-lg text-black outline-none"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          required
        />
        
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
          Image
        </label>
        <input
          id="image"
          type="file"
          className="mb-4 w-full p-3 border rounded-lg"
          name="image"
          onChange={(e) => setImage(e.target.files[0])}
          accept="image/*"
          required
        />
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Create Post
        </button>
      </form>
    </section>
  );
};

export default CreatePost;
