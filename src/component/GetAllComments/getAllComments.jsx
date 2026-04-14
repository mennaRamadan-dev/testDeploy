import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Comment from "../comment/comment";

export default function GetAllComments({ postId }) {
  const token = localStorage.getItem("userToken");

  async function getAllComments() {
    const page = 1;
    const limit = 10;
    const endpoint = `https://route-posts.routemisr.com/posts/${postId || ""}/comments?page=${page}&limit=${limit}`;

    return axios.get(endpoint, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["getAllComments", postId],
    queryFn: getAllComments,
    enabled: !!postId,
  });

//   console.log("GetAllComments response:", data);

  const comments =
    data?.data?.data?.comments ?? data?.data?.comments ?? data?.data ?? [];

  if (isLoading)
    return (
      <div className="text-center p-8">
        <span className="loader"></span>
      </div>
    );

  if (isError) return <p>Error: {error?.message}</p>;

  if (!comments || comments.length === 0)
    return <p className="text-center p-4">No comments found.</p>;

  return (
    <>
      {comments.map((comment) => (
        <Comment
          key={comment._id || comment.id}
          Comment={comment}
          postId={postId}
        />
      ))}
    </>
  );
}
