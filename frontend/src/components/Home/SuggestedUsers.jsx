import { useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";

// SuggestedUsers.js
const SuggestedUsers = () => {
  const userDetails = useSelector((state) => state.counter.userDetails);
  return (
    <aside className="w-80 p-4 hidden lg:block mt-2 bg-transparent text-on-surface">
      <div className="flex items-center mb-6 justify-between">
        <Link to={`/profile/${userDetails.username}`} >
          <Avatar className="w-12 h-12">
            <AvatarImage src={userDetails.profilePic} className="object-cover object-top" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
        </Link>
        <div className="ml-2">
          <Link to={`/profile/${userDetails.username}`} >
            <p className="text-sm font-display font-semibold transition-colors hover:text-primary">{userDetails.username}</p>
          </Link>
          <p className="text-sm font-body text-on-surface-variant">{userDetails.fullName}</p>
        </div>
        <Button variant="link" size="sm" className="ml-auto text-primary px-0 hover:text-primary-container">Switch</Button>
      </div>
      <div className="mb-4">
        <div className="flex justify-between">
          <h2
            className="text-sm font-display font-semibold text-on-surface-variant mb-4">Suggestions for you</h2>
          <p className="text-sm mr-2 font-display font-semibold text-on-surface hover:text-on-surface-variant transition-colors cursor-pointer">See All</p>
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4 mb-4">
             <Link to={`/profile/${userDetails.username}`} >
            <Avatar className="w-8 h-8">
              <AvatarImage src={`https://i.pravatar.cc/32?img=${i + 20}`} />
              <AvatarFallback>S{i + 1}</AvatarFallback>
            </Avatar>
             </Link>
            <div className="flex-grow">
            <Link to={`/profile/${userDetails.username}`} >
              <p className="text-sm font-display font-semibold transition-colors hover:text-primary">suggested_user{i + 1}</p>
            </Link>
              <p className="text-xs font-body text-on-surface-variant">Followed by user{i + 5}</p>
            </div>
            <Button variant="link" size="sm" className="text-primary no-underline hover:text-primary-container">Follow</Button>
          </div>
        ))}
      </div>
      <footer className="text-xs font-body text-on-surface-variant mt-6">
        © 2023 Instagram Clone
      </footer>
    </aside>
  );
};

export default SuggestedUsers;
