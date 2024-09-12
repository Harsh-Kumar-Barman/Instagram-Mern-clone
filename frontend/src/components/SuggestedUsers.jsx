// SuggestedUsers.js
const SuggestedUsers = ({ allPosts }) => {
    return (
      <div className="accounts flex flex-col gap-5">
         <div className="suggest flex justify-evenly items-center gap-20">
                    <p className="font-semibold text-zinc-300 text-xs">Suggested for you</p>
                    <p className="font-semibold text-xs cursor-pointer">See All</p>
                  </div>
        {allPosts.map((post, index) => (
          <div key={index} className="acc flex justify-evenly items-center gap-5">
            <div className="imgAbout flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img className="w-full h-full object-cover object-top" src={`http://localhost:5000/${post.mediaPath}`} alt={post.author.username} />
              </div>
              <div className="about">
                <h2 className="text-xs font-semibold">{post.author.username}</h2>
                <p className="text-xs text-zinc-400">Suggested for you</p>
              </div>
            </div>
            <button className="text-xs font-semibold text-sky-500">Follow</button>
          </div>
        ))}
      </div>
    );
  };
  
  export default SuggestedUsers;
  