import { useQuery } from "@tanstack/react-query";
import style from "./UserDetails.module.css";
import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Comment from "./../comment/comment";
import DeletePosting from "./../DeletePosting/DeletePosting";
import UpdatePost from "./../UpdatePost/UpdatePost";
import CreatCommentModal from "./../CreatCommentModal/CreateCommentModal";
import LikePosts from "../LikePosts/LikePosts";

export default function UserDetails({ id }) {
  let token = localStorage.getItem("userToken");
  function getUserDetails() {
    return axios.get(`https://route-posts.routemisr.com/users/${id}/posts?`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  let { data, isError, isLoading, error } = useQuery({
    queryKey: ["getUserDetails"],
    queryFn: getUserDetails,
    select: (data) => data?.data?.data?.posts,
  });

  // console.log(data);
  return (
    <>
      {data
        ?.filter((post) => post?.body || post?.image)
        .map((post) => (
          <div className=" md:w-[60%] lg:w-[40%] rounded-md bg-slate-200 mx-auto p-2 mb-3">
            <Link to={`/postdetails/${post?.id}`} key={data?.id}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 mb-3">
                  <img
                    src={post?.user.photo}
                    alt=""
                    className="size-[36px] rounded-full"
                  />
                  <p>{post?.user.name}</p>
                </div>
                <div className="text-xs text-slate-400">
                  <p>{post?.createdAt}</p>
                </div>
              </div>
              {post?.body && <h2 className="mb-4">{post?.body}</h2>}
              {post?.image && (
                <img
                  src={post?.image}
                  alt={post?.body}
                  className="w-full max-h-[400px] object-cover rounded-lg"
                />
              )}
            </Link>
            {post?.topComment && (
              <Comment Comment={post?.topComment} postId={post.id} />
            )}
            <div className="flex items-center justify-between">
              <LikePosts
                postId={post.id}
                likedByUser={post.likedByUser}
                likesCount={post.likesCount}
              />

              <div>
                <CreatCommentModal postId={post.id} />
              </div>
              <div className="flex gap-1">
                <DeletePosting postId={post?.id} />
                <UpdatePost postId={post?.id} />
              </div>
            </div>
          </div>
        ))}
    </>
  );
}
