// SuggestedUsers.js
const SuggestedUsers = ({ allPosts }) => {
    return (
      <div className="accounts flex flex-col gap-5">
        {allPosts.map((post, index) => (
          <div key={index} className="acc flex justify-between items-center">
            <div className="imgAbout flex items-center gap-4">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img className="w-full h-full object-cover" src={`http://localhost:5000/${post.image}`} alt={post.author.username} />
              </div>
              <div className="about">
                <h2 className="text-sm font-semibold">{post.author.username}</h2>
                <p className="text-xs text-zinc-400">New to Instagram</p>
              </div>
            </div>
            <button className="text-xs font-semibold text-sky-500">Follow</button>
          </div>
        ))}
      </div>
    );
  };
  
  export default SuggestedUsers;
  