import style from "./DeleteComment.module.css";
import React from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function DeleteComment({ id, postId }) {
  let token = localStorage.getItem("userToken");
  let query = useQueryClient();

  function handleDeleteComment() {
    if (!postId) {
      toast.error("Post id missing for delete comment");
      return;
    }

    axios
      .delete(
        `https://route-posts.routemisr.com/posts/${postId}/comments/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((res) => {
        if (res.data.success) {
          toast.success("Comment deleted successfully");
        }

        query.invalidateQueries({ queryKey: ["getSinglePost", postId] });
        query.invalidateQueries({ queryKey: ["getAllComments", postId] });
        query.invalidateQueries({ queryKey: ["getAllPosts"] });
        query.invalidateQueries({ queryKey: ["getUserDetails"] });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Comment cannot delete");
      });
  }

  return (
    <>
      <button
        onClick={handleDeleteComment}
        type="button"
        // className="text-red-500  box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none"
      >
        <i className="fa-solid fa-trash"></i>
      </button>
    </>
  );
}
