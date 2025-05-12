import React, { useState } from "react";

export default function SortAndSearch({ posts, setFilteredPosts }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  const sortPosts = (option) => {
    let sortedPosts = [...posts];
    if (option === "newest") {
      sortedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (option === "mostLiked") {
      sortedPosts.sort((a, b) => b.likes - a.likes);
    } else if (option === "mostCommented") {
      sortedPosts.sort((a, b) => b.comments - a.comments);
    }
    setFilteredPosts(sortedPosts);
    setSortOption(option);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.country.toLowerCase().includes(query)
    );
    setFilteredPosts(filtered);
  };

  return (
    <div className="w-full flex justify-between px-[6%] items-center mt-6 mb-12">
      {/* Filters */}
      <div className="flex space-x-4">
        <button
          onClick={() => sortPosts("newest")}
          className={`px-4 py-2 rounded-lg font-medium ${
            sortOption === "newest"
              ? "bg-primary-600 text-primary-100"
              : "bg-black bg-opacity-20 text-primary-900 border-[1px] border-[#1ea8a1]"
          }`}
        >
          Newest
        </button>
        <button
          onClick={() => sortPosts("mostLiked")}
          className={`px-4 py-2 rounded-lg font-medium ${
            sortOption === "mostLiked"
              ? "bg-primary-600 text-primary-100"
              : "bg-black bg-opacity-20 text-primary-900 border-[1px] border-[#1ea8a1]"
          }`}
        >
          Most Liked
        </button>
        <button
          onClick={() => sortPosts("mostCommented")}
          className={`px-4 py-2 rounded-lg font-medium ${
            sortOption === "mostCommented"
              ? "bg-primary-600 text-primary-100"
              : "bg-black bg-opacity-20 text-primary-900 border-[1px] border-[#1ea8a1]"
          }`}
        >
          Most Commented
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-center w-[400px]">
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={handleSearch}
          className="placeholder:text-primary-900 text-primary-900 bg-black bg-opacity-20 border-[1px] border-[#1ea8a1] px-4 py-2 rounded-lg w-[80%]"
        />
      </div>
    </div>
  );
}