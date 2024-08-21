import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const userDetails=useSelector((state)=>state.counter.userDetails)
  // console.log("okkkk : : : ",userDetails)
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.get('/api/logout');
      if (res.status === 200) {
        console.log('Logged out successfully');
        navigate('/login');

      }
    } catch (err) {
      console.error('Error during logout:', err);
    }
  };

  return (
    <nav className="bg-blue-500 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl">Instagram Clone</Link>
        <div>
          <Link to={`/profile/${userDetails.username}`} className="mr-4">Profile</Link>
          <Link to='/' className="mr-4">Home</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
