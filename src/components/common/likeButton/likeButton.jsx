import { useState, useEffect } from "react";
import axios from "axios";
import { FaHeart, FaRegHeart } from "react-icons/fa";

function LikeButton({ blogId, userId, initialLikes }) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchUserLikeStatus = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/likes/status`,
          {
            params: { blogId, userId },
          }
        );
        setLiked(response.data.liked);
      } catch (error) {
        console.error("Failed to fetch like status:", error);
      }
    };
    const getLikesCount = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/likes/count`,
          {
            params: { blogId },
          }
        );
        setLikes(response.data.likesCount);
      } catch (error) {
        console.error("Failed to fetch like count:", error);
      }
    };
    getLikesCount();

    fetchUserLikeStatus();
  }, [blogId, userId]);

  const handleLike = async () => {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const endpoint = liked ? "remove" : "add";
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/likes/${endpoint}`,
        { blogId, userId }
      );
      setLikes(response.data.likesCount);
      setLiked(!liked);
    } catch (error) {
      console.error("Failed to update like:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <div className="flex items-center cursor-pointer" onClick={handleLike}>
        {liked ? (
          <FaHeart className="text-red-500 text-xl" />
        ) : (
          <FaRegHeart className="text-primary text-xl" />
        )}
        <span className="ml-2 text-primary">{likes}</span>
      </div>
    </div>
  );
}

export default LikeButton;
