import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_BACKEND_URL);
import axios from "axios";

function LikeButton({ blogId, userId, initialLikes }) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    // Fetch the user's like status when the component mounts
    const fetchUserLikeStatus = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/likes/status?blogId=${blogId}&userId=${userId}`
        );
        const data = await response.json();
        setLiked(data.liked);
      } catch (error) {
        console.error("Failed to fetch like status:", error);
      }
    };

    fetchUserLikeStatus();

    socket.on(`likeUpdate-${blogId}`, (updatedLikes) => {
      setLikes(updatedLikes);
    });

    return () => {
      socket.off(`likeUpdate-${blogId}`);
    };
  }, [blogId, userId]);

  const handleLike = async () => {
    try {
        if (liked) {
            console.log(userId, blogId);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/likes/remove`,{ blogId, userId });
            setLikes(response.data.likesCount);
            socket.emit("like", { blogId, userId, action: "remove" });
            setLiked(false);
        } else {
            console.log(userId, blogId);
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/likes/add`,{ blogId, userId });
            setLikes(response.data.likesCount);
            socket.emit("like", { blogId, userId, action: "add" });
            setLiked(true);
        }
    } catch (error) {
        console.error("Failed to update like:", error);
    }
};

  return (
    <button
      onClick={handleLike}
      className={`px-4 py-2 rounded-lg ${
        liked ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
      }`}
    >
      {liked ? "Unlike" : "Like"} ({likes})
    </button>
  );
}

export default LikeButton;