import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addUser } from '@/features/userDetail/userDetailsSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleLogin } from '@react-oauth/google';

const BASE_URL =
import.meta.env.VITE_NODE_ENV === "development"
  ? import.meta.env.VITE_API_BASE_URL_DEV
  : import.meta.env.VITE_API_BASE_URL_PROD;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response =await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
      const token=response.data.token;
      const profilePic = response?.data?.user?.profilePicture
      dispatch(addUser({
        fullName: response?.data?.user?.fullName,
        username: response?.data?.user?.username,
        email: response?.data?.user?.email,
        id: response?.data?.user?._id,
        profilePic: profilePic
      }));
      localStorage.setItem('user-info', JSON.stringify({ token }));

      if (token) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7); // Expires in 7 days
        document.cookie = `token=${token}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Strict`;
      }
      toast.success('Login Successfull');
      navigate(`/`);

    } catch (err) {
      toast.error('Something went wrong!!!');
      console.error('Login error:', err);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/google`, { token: credentialResponse.credential });
      const token = response.data.token;
      const profilePic = response?.data?.user?.profilePicture;
      
      dispatch(addUser({
        fullName: response?.data?.user?.fullName,
        username: response?.data?.user?.username,
        email: response?.data?.user?.email,
        id: response?.data?.user?._id,
        profilePic: profilePic
      }));
      
      localStorage.setItem('user-info', JSON.stringify({ token }));

      if (token) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        document.cookie = `token=${token}; path=/; expires=${expiryDate.toUTCString()}; SameSite=Strict`;
      }
      
      toast.success('Login Successfull');
      navigate(`/`);
    } catch (err) {
      toast.error('Google Login Failed');
      console.error('Google Login error:', err);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google Login Failed');
    console.error('Google Login Failed');
  };

  return (
    <div className="flex justify-center items-center flex-col p-4 min-h-screen bg-background">
      <div className="bg-surface-container-lowest rounded-2xl p-8 w-full max-w-sm flex flex-col border border-outline-variant/30 shadow-ambient transition-all">
        <div className="flex justify-center mb-8">
          <h1 className="text-4xl font-display font-extrabold bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent">
            InstaClone
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-outline-variant/50 rounded-xl text-sm outline-none bg-surface-container-low text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            placeholder="Email address"
            aria-label="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-outline-variant/50 rounded-xl text-sm outline-none bg-surface-container-low text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            placeholder="Password"
            aria-label="Password"
            required
          />
          <button
            type="submit"
            className="bg-[#1a73e8] hover:opacity-90 text-sm text-white font-bold py-3 px-4 rounded-xl focus:outline-none transition-opacity mt-2 w-full shadow-md"
          >
            Log in
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-outline-variant/30"></div>
          <span className="px-4 text-sm text-outline font-semibold uppercase tracking-wider">or</span>
          <div className="flex-1 border-t border-outline-variant/30"></div>
        </div>

        <div className="flex justify-center w-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap
            shape="pill"
            theme="filled_blue"
          />
        </div>
      </div>

      <div className="bg-surface-container-lowest mt-6 rounded-2xl p-6 w-full max-w-sm flex justify-center items-center border border-outline-variant/30 shadow-ambient transition-all">
        <p className="text-on-surface">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:text-primary-container font-bold transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
