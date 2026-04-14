import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function LikeComment({
  postId,
  commentId,
  likedByUser,
  likesCount,
}) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  async function handleLike() {
    const token = localStorage.getItem("userToken");
    if (!token) {
      toast.error("Please login first to like comments.");
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${commentId}/like`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      queryClient.invalidateQueries({ queryKey: ["getAllComments", postId] });
      queryClient.invalidateQueries({ queryKey: ["getUserDetails"] });
      queryClient.invalidateQueries({ queryKey: ["getSinglePost", postId] });
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to update comment like.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={loading}
      className={`hover:text-slate-200 disabled:opacity-50 ${likedByUser ? "text-blue-400" : ""}`}
    >
      {loading ? "Please wait..." : `Likes(${likesCount})`}
    </button>
  );
}
