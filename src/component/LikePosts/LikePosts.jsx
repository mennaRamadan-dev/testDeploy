import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function LikePosts({ postId, likedByUser, likesCount = 0 }) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  async function handleLike() {
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login first to like posts.");
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `https://route-posts.routemisr.com/posts/${postId}/like`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

        queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
        queryClient.invalidateQueries({ queryKey: ["getSinglePost", postId] });
        queryClient.invalidateQueries({ queryKey: ["getAllComments", postId] });
        queryClient.invalidateQueries({ queryKey: ["getUserDetails"] });
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update post like.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
<span
  onClick={handleLike}
  className="flex items-center gap-1 cursor-pointer select-none"
>
  <span className="text-xl text-slate-900">{likesCount}</span>

 <i
  className={`text-2xl transition ${
    likedByUser
      ? "fa-solid fa-thumbs-up text-blue-700 scale-110"
      : "fa-regular fa-thumbs-up text-slate-900"
  }`}
/>
</span>
  );
}
