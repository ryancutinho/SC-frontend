import React, { useState, useContext } from "react";
import UserContext from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [media, setMedia] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  const { handleCreatePost, handleLogout, user } =
    useContext(UserContext);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    setMedia(files);

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviewUrls(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await handleCreatePost({
        caption,
        location,
        media,
      });

      alert("Post created successfully");

      setCaption("");
      setLocation("");
      setMedia([]);
      setPreviewUrls([]);

      navigate("/allposts");
    } catch (error) {
      console.log(error);
      alert("Error creating post");
    } finally {
      setLoading(false);
    }
  };

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-black">
      {/* Header */}
      <div className="bg-white shadow-md p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-green-600">
              SocialConnect
            </h1>

            <p className="text-sm text-gray-700">
              Welcome, {user?.name || "User"}
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => navigate("/allposts")}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Back to Feed
            </button>

            <button
              onClick={handleLogoutClick}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Create Post Container */}
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Create New Post
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Caption */}
            <div>
              <label className="block text-gray-800 font-medium mb-2">
                Caption
              </label>

              <textarea
                rows={5}
                placeholder="What's on your mind?"
                value={caption}
                onChange={(e) =>
                  setCaption(e.target.value)
                }
                className="w-full border border-gray-300 rounded-xl p-4 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-gray-800 font-medium mb-2">
                Location
              </label>

              <input
                type="text"
                placeholder="Add location"
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                className="w-full border border-gray-300 rounded-xl p-3 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Upload */}
            <div>
              <label className="block text-gray-800 font-medium mb-2">
                Upload Photos
              </label>

              <label className="border-2 border-dashed border-gray-300 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition bg-gray-50">
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-700">
                    Click to upload images
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    PNG, JPG, JPEG
                  </p>
                </div>

                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Preview Images */}
            {previewUrls.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Preview
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {previewUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative"
                    >
                      <img
                        src={url}
                        alt="preview"
                        className="w-full h-64 object-cover rounded-xl shadow-md"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-white font-semibold text-lg transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading
                ? "Uploading..."
                : "Create Post"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}