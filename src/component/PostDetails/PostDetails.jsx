import { useParams } from "react-router-dom";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Comment from "./../comment/comment";
import CreatCommentModal from "../CreatCommentModal/CreateCommentModal";
import GetAllComments from "../GetAllComments/getAllComments";
import DeletePosting from "./../DeletePosting/DeletePosting";
import UpdatePost from "./../UpdatePost/UpdatePost";
import { jwtDecode } from "jwt-decode";
import LikePosts from "../LikePosts/LikePosts";

export default function PostDetails() {
  let { id } = useParams();
  const token = localStorage.getItem("userToken");
  let userId = null;

  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.user;
  }

  function getSinglePost() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  let { data, isLoading, isError, error } = useQuery({
    queryKey: ["getSinglePost", id],
    queryFn: getSinglePost,
    select: (data) => data?.data?.data?.post,
  });
  // console.log(data);
  // console.log(data?.commentsCount);

  if (isLoading)
    return (
      <div>
        <div className="text-center p-8">
          <span className="loader"></span>
        </div>
      </div>
    );
  if (isError) return <p>Error: {error?.message}</p>;
  if (!data) return <p>No post found</p>;

  return (
    <>
      <div className=" md:w-[80%] lg:w-[40%] rounded-md bg-slate-200 mx-auto p-2 mb-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 mb-3">
            <img src={data.user.photo} alt="" className="size-[36px]" />
            <p>{data.user.name}</p>
          </div>
          <div className="text-xs text-slate-400">
            <p>{data.createdAt}</p>
          </div>
        </div>
        {data.body && <h2 className="mb-4">{data.body}</h2>}
        {data.image && (
          <img src={data.image} alt={data.body} className="w-full rounded-md" />
        )}
        <div className="flex items-center justify-between gap-2 mb-3">
          <LikePosts
            postId={data?.id}
            likedByUser={data.likedByUser}
            likesCount={data.likesCount}
          />

          <CreatCommentModal postId={data?.id} />

          {(data.user?._id === userId || data.user?.id === userId) && (
            <div className="flex gap-2">
              <DeletePosting postId={data?.id} />
              <UpdatePost postId={data?.id} />
            </div>
          )}
        </div>
        {data?.comments?.map((comment) => (
          <Comment key={comment._id} Comment={comment} postId={data?.id} />
        ))}
        <GetAllComments postId={data?.id} />
      </div>
    </>
  );
}
