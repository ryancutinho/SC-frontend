import React, { useContext, useEffect, useState } from "react";
import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function AllPosts() {
  const { getAllPosts, handleLogout, user } =
    useContext(UserContext);

  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // CHANGE THIS TO YOUR BACKEND PORT
  const BACKEND_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);

        const postsData = await getAllPosts();

        console.log(postsData.data);

        setPosts(postsData.data);
      } catch (error) {
        console.log("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [getAllPosts]);

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-green-600">
              SocialConnect
            </h1>

            <p className="text-sm text-gray-600 mt-1">
              Welcome back, {user?.name || "User"}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/create-post")}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition"
            >
              + Create Post
            </button>

            <button
              onClick={handleLogoutClick}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p className="text-lg text-gray-500">
              Loading posts...
            </p>
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              {/* Post Header */}
              <div className="flex justify-between items-center p-5 border-b">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg">
                    {post.userId?.name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {post.userId?.name || "User"}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {new Date(
                        post.createdAt
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Caption */}
              <div className="px-5 pt-5">
                <p className="text-gray-800 text-lg leading-relaxed">
                  {post.caption}
                </p>
              </div>

              {/* Images */}
              {post.media && post.media.length > 0 && (
                <div
                  className={`grid gap-1 mt-5 ${
                    post.media.length === 1
                      ? "grid-cols-1"
                      : "grid-cols-2"
                  }`}
                >
                  {post.media.map((media, index) => {
                    let imagePath =
                      media.mediaUrl ||
                      media.url ||
                      media;

                    // Fix relative upload paths
                    if (
                      imagePath 
                    ) {
                      imagePath = `${BACKEND_URL}${imagePath}`;
                    }

                    return (
                      <img
                        key={index}
                        src={imagePath}
                        alt="Post media"
                        className={`w-full object-cover block ${
                          post.media.length === 1
                            ? "max-h-[500px]"
                            : "h-72"
                        }`}
                      />
                    );
                  })}
                </div>
              )}

              {/* Footer */}
              <div className="p-5">
                <div className="flex justify-between items-center text-gray-600 text-sm">
                  <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                      ❤️
                      <span>
                        {post.likesCount || 0} Likes
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      💬
                      <span>
                        {post.commentsCount || 0} Comments
                      </span>
                    </div>
                  </div>

                  {post.location && (
                    <p className="text-gray-500">
                      📍 {post.location}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-around mt-5 border-t pt-4">
                  <button className="flex-1 py-2 rounded-lg hover:bg-gray-100 transition font-medium text-gray-700">
                    ❤️ Like
                  </button>

                  <button className="flex-1 py-2 rounded-lg hover:bg-gray-100 transition font-medium text-gray-700">
                    💬 Comment
                  </button>

                  <button className="flex-1 py-2 rounded-lg hover:bg-gray-100 transition font-medium text-gray-700">
                    ↗ Share
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-700">
              No Posts Yet
            </h2>

            <p className="text-gray-500 mt-2">
              Start sharing your moments with everyone.
            </p>

            <button
              onClick={() => navigate("/create-post")}
              className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition"
            >
              Create Your First Post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}