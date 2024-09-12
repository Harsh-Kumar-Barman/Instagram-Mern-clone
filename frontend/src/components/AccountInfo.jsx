// AccountInfo.js
import { Link } from 'react-router-dom';

const AccountInfo = ({ userDetails }) => {
    return (
        <div className="profileInfo flex justify-evenly mt-2">
            <Link to={`/profile/${userDetails.username}`}>
            <div className="flex items-center gap-2 w-48">
                <div className="profileImg w-12 h-12 rounded-full overflow-hidden flex justify-center items-center">
                    <img className="w-full h-full object-cover object-topw" src={`http://localhost:5000/${userDetails.profilePic}`} alt={userDetails.username} />
                </div>
                <div>
                    <h2 className="font-semibold text-xs">{userDetails.username}</h2>
                    <p className="text-xs text-zinc-400">{userDetails.fullName}</p>
                </div>
            </div>
             </Link>
            <button className="text-sky-500 text-xs font-semibold">Switch</button>
        </div>
    );
};

export default AccountInfo;
