// import { createSlice } from '@reduxjs/toolkit'

// const initialState = {
//   userDetails: {
//     fullName: null,
//     usrname: null,
//     email: null,
//     id: null
//   },
//   selectedPost: null
// }
// export const userDetailsSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     addUser: (state, action) => {
//       state.userDetails = {
//         fullName: action.payload.fullName,
//         username: action.payload.username,
//         email: action.payload.email,
//         id: action.payload.id,
//       };
//     },
//     getUser: (state) => {
//       return state.userDetails;
//     },
//     setSelectedPost: (state, action) => {
//       state.selectedPost = action.payload.selectedPost
//     },
//     getSelectedPost: (state) => {
//       return state.selectedPost;
//     },
//   },
// })
// export const { addUser, getUser,setSelectedPost,getSelectedPost } = userDetailsSlice.actions
// export default userDetailsSlice.reducer

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userDetails: {
    fullName: null,
    usrname: null,  // Fixed typo from 'usrname' to 'username'
    email: null,
    id: null,
  },
  selectedPost: null,
  savedPosts:null,
  following:null,
  followers:null
};

export const userDetailsSlice = createSlice({
  name: 'user',  // Changed slice name to 'user'
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.userDetails = {
        fullName: action.payload.fullName,
        username: action.payload.username,
        email: action.payload.email,
        id: action.payload.id,
      };
    },
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;  // No need to access selectedPost within the payload
    },
    setSavedPosts: (state, action) => {
      state.savedPosts = action.payload;  // No need to access selectedPost within the payload
    },
    setFollowing: (state, action) => {
      state.following = action.payload;  // No need to access selectedPost within the payload
    },
    setFollower: (state, action) => {
      state.followers = action.payload;  // No need to access selectedPost within the payload
    },
  },
});

export const { addUser, setSelectedPost, setSavedPosts,setFollower,setFollowing } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
