import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function CreatCommentModal({ postId }) {
  let query = useQueryClient();
  const [isShow, setisShow] = useState(false);
  const form = useForm({
    defaultValues: {
      content: "",
    },
  });
  let { register, handleSubmit, reset } = form;

  async function addComment(value) {
    try {
      const token = localStorage.getItem("userToken");
      //    console.log(value);
      let res = await axios.post(
        `https://route-posts.routemisr.com/posts/${postId}/comments`,
        value,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      console.log(res);
      if (res.data.success) {
        toast.success("Comment added successfully");
        query.invalidateQueries({ queryKey: ["getAllPosts"] });
        query.invalidateQueries({ queryKey: ["getSinglePost", postId] });
        query.invalidateQueries({ queryKey: ["getAllComments", postId] });
        query.invalidateQueries({ queryKey: ["getUserDetails"] });
        reset();
        setisShow(false);
      }
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  }

  function changeToggle() {
    setisShow(true);
  }

  return (
    <>
      <div className="flex justify-center">
        <i
          onClick={changeToggle}
          data-modal-target="authentication-modal"
          data-modal-toggle="authentication-modal"
          className="fa-regular fa-comment text-slate-900 text-2xl cursor-pointer hover:text-slate-600 mt-2.5"
        ></i>
      </div>
      {isShow && (
        <div
          id="authentication-modal"
          aria-hidden="true"
          className=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
              <div className="flex items-center justify-between border-b border-default pb-4 md:pb-5">
                <button
                  onClick={() => setisShow(false)}
                  type="button"
                  className="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
                  data-modal-hide="authentication-modal"
                >
                  <i className="fas fa-close cursor-pointer"></i>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <form
                onSubmit={handleSubmit(addComment)}
                action="#"
                className="pt-4 md:pt-6"
              >
                <div className="mb-4">
                  <label
                    htmlFor="comment"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    Add Comment
                  </label>
                  <input
                    {...register("content")}
                    type="text"
                    id="comment"
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    placeholder="Add your comment here..."
                  />
                </div>

                <button
                  type="submit"
                  className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none w-full mb-3"
                >
                  Add Comment
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
