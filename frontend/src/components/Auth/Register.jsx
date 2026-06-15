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



const Register = () => {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/api/auth/register`, { fullName, username, email, password }); 
            const profilePic = response?.data?.newUser?.profilePicture
            dispatch(addUser({
                fullName: response?.data?.newUser?.fullName,
                username: response?.data?.newUser?.username,
                email: response?.data?.newUser?.email,
                id: response?.data?.newUser?._id,
                profilePic: profilePic
            }));
            toast.success('Account Created Successfully');
            navigate(`/profile/${response?.data?.newUser?.username}`);

        } catch (err) {
            if (err.response && err.response.statusText === "Unauthorized") navigate('/login')
            toast.error('Please check details');
            console.error(err);
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
            
            toast.success('Account Created/Logged in Successfully');
            navigate(`/profile/${response?.data?.user?.username}`);
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
                <div className="flex flex-col justify-center items-center mb-6">
                    <h1 className="text-4xl font-display font-extrabold bg-gradient-to-r from-primary to-tertiary bg-clip-text text-transparent mb-4">
                        InstaClone
                    </h1>
                    <p className="text-outline font-medium text-center text-sm">
                        Sign up to see photos and videos from your friends.
                    </p>
                </div>

                <div className="flex justify-center w-full mb-6">
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        useOneTap
                        shape="pill"
                        theme="filled_blue"
                    />
                </div>

                <div className="flex items-center mb-6">
                    <div className="flex-1 border-t border-outline-variant/30"></div>
                    <span className="px-4 text-sm text-outline font-semibold uppercase tracking-wider">or</span>
                    <div className="flex-1 border-t border-outline-variant/30"></div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 border border-outline-variant/50 rounded-xl text-sm outline-none bg-surface-container-low text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                        placeholder="Email address"
                        required
                    />
                    <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 border border-outline-variant/50 rounded-xl text-sm outline-none bg-surface-container-low text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                        placeholder="Full Name"
                        required
                    />
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-3 border border-outline-variant/50 rounded-xl text-sm outline-none bg-surface-container-low text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                        placeholder="Username"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-outline-variant/50 rounded-xl text-sm outline-none bg-surface-container-low text-on-surface focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                        placeholder="Password"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-[#1a73e8] hover:opacity-90 text-sm text-white font-bold py-3 px-4 rounded-xl focus:outline-none transition-opacity mt-2 w-full shadow-md"
                    >
                        Sign up
                    </button>
                </form>

                <p className="text-outline text-center text-xs mt-6 leading-relaxed">
                    By signing up, you agree to our{' '}
                    <Link to="#" className="text-primary font-medium hover:underline">Terms</Link>,{' '}
                    <Link to="#" className="text-primary font-medium hover:underline">Privacy Policy</Link> and{' '}
                    <Link to="#" className="text-primary font-medium hover:underline">Cookies Policy</Link>.
                </p>
            </div>

            <div className="bg-surface-container-lowest mt-6 rounded-2xl p-6 w-full max-w-sm flex justify-center items-center border border-outline-variant/30 shadow-ambient transition-all">
                <p className="text-on-surface">
                    Have an account?{' '}
                    <Link to="/login" className="text-primary hover:text-primary-container font-bold transition-colors">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
