import style from "./comment.module.css";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import UpdateComment from "./../UpdateComment/UpdateComment";
import DeleteComment from "../DeleteComment/DeleteComment";
import LikeComment from "../LikeComment/LikeComment";
import CommentRepaly from "../CommentReplay/commentRepaly";
import { jwtDecode } from "jwt-decode";

function getRepliesFromResponse(response) {
  const data = response?.data;
  if (!data) return [];
  if (Array.isArray(data)) return data;

  function findArray(value) {
    if (Array.isArray(value)) return value;
    if (value && typeof value === "object") {
      for (const key of Object.keys(value)) {
        const found = findArray(value[key]);
        if (found) return found;
      }
    }
    return null;
  }

  const replies = findArray(data);
  if (replies) return replies;

  if (typeof data?.data?.total === "number") return [];
  if (typeof data?.total === "number") return [];
  return [];
}

export default function Comment({ Comment, postId }) {
  if (!Comment) return null; // حماية من undefined

  const token = localStorage.getItem("userToken");
  let userId = null;

  if (token) {
    const decoded = jwtDecode(token);
    userId = decoded.user; // userId عبارة عن string
  }

  const { commentCreator, content, createdAt, _id, likes } = Comment;
  const commentAuthor =
    commentCreator?.name ;
  const likedByUser = Array.isArray(likes)
    ? likes.some(
        (like) =>
          like === userId ||
          like?._id === userId ||
          like?.user === userId ||
          like?.user?._id === userId,
      )
    : false;
  const [showReplies, setShowReplies] = useState(false);

  const { data: replyCount = 0 } = useQuery({
  queryKey: ["commentReplyCount", postId, _id],
  queryFn: async () => {
    const response = await axios.get(
      `https://route-posts.routemisr.com/posts/${postId}/comments/${_id}/replies?page=1&limit=100`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
// console.log("Reply count response:", response.data);
    const replies = response?.data?.data?.replies;

    return Array.isArray(replies) ? replies.length : 0;
  },
  enabled: !!postId && !!_id,
});

  return (
    <div className="rounded-xl w-full border border-slate-700 bg-slate-950 text-slate-100 p-3 mt-2 shadow-sm">
      <div className="flex justify-between items-center gap-3">
        <div className="flex items-center gap-3">
          <img
            src={commentCreator?.photo}
            alt={commentAuthor}
            className="w-9 h-9 rounded-full object-cover"
          />
          <p className="text-sm font-medium text-slate-100">{commentAuthor}</p>
        </div>
        <span className="text-xs text-slate-500">{createdAt}</span>
      </div>

      <div className="content p-3 border border-slate-700 bg-slate-900 my-3 rounded-2xl">
        <p className="text-sm leading-6 text-slate-100">{content}</p>

        {commentCreator?._id === userId && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <DeleteComment id={_id} postId={postId} />
            <UpdateComment id={_id} postId={postId} />
          </div>
        )}
      </div>
      <div
        className={`${style.commentActions} flex flex-wrap items-center gap-3 px-3 pb-2 text-xs text-slate-400`}
      >
        <LikeComment
          postId={postId}
          commentId={_id}
          likedByUser={likedByUser}
          likesCount={likes?.length || 0}
        />
        <button
          type="button"
          onClick={() => setShowReplies((prev) => !prev)}
          className="hover:text-slate-200"
        >
          Reply ({replyCount})
        </button>
      </div>
      {showReplies && (
        <CommentRepaly
          postId={postId}
          commentId={_id}
          onReplyAdded={() => setShowReplies(false)}
        />
      )}
    </div>
  );
}
