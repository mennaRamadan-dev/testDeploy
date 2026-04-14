import style from "./DeletePosting.module.css";
import React from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function DeletePosting({ postId }) {
  let queryClient = useQueryClient();

  function deletePost() {
    const token = localStorage.getItem("userToken");
    axios
      .delete(`https://route-posts.routemisr.com/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success("Post deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
        queryClient.invalidateQueries({ queryKey: ["getUserDetails"] });
        queryClient.invalidateQueries({ queryKey: ["getSinglePost"] });
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });
  }

  return (
    <>
      <button
        onClick={deletePost}
        data-modal-target="authentication-modal"
        data-modal-toggle="authentication-modal"
        className="text-slate-900 mt-2.5 focus:ring-4 focus:ring-red-300 shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
        type="button"
      >
        <i className="fa-solid fa-trash"></i>
      </button>
    </>
  );
}
