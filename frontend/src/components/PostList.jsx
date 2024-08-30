// PostList.js
import Post from './Post';

const PostList = ({ allPosts, userDetails, savedPost, followingUserss, handleLike, handleSavePosts, showComments, handleFollowing, handleCommentSubmit }) => {
  return (
    <section className="mt-12 mx-auto w-[100vw] sm:w-[80vw] md:w-[60vw] lg:w-[468px]">
      {allPosts.map((post) => (
        <Post
          key={post._id}
          post={post}
          userDetails={userDetails}
          savedPost={savedPost}
          followingUserss={followingUserss}
          handleLike={handleLike}
          handleSavePosts={handleSavePosts}
          showComments={showComments}
          handleFollowing={handleFollowing}
          handleCommentSubmit={handleCommentSubmit}
        />
      ))}
    </section>
  );
};

export default PostList;
