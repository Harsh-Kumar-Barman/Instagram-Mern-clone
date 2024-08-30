// AccountInfo.js
import { Link } from 'react-router-dom';
import myPic from '../assets/myPic.jpeg';

const AccountInfo = ({ userDetails }) => {
    return (
        <div className="profileInfo flex justify-between">
            <Link to={`/profile/${userDetails.username}`}>
            <div className="flex items-center gap-2">
                <div className="profileImg w-14 h-14 rounded-full overflow-hidden">
                    <img className="w-full h-full object-cover" src={myPic} alt={userDetails.username} />
                </div>
                <div>
                    <h2 className="font-semibold">{userDetails.username}</h2>
                    <p className="text-sm text-zinc-400">My Name</p>
                </div>
            </div>
             </Link>
            <button className="text-sky-500 text-xs font-semibold">Switch</button>
        </div>
    );
};

export default AccountInfo;
