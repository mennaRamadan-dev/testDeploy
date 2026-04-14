import style from "./UpdatePost.module.css";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export default function UpdatePost({ postId }) {
  let queryClient = useQueryClient(); //==>دى خلتنى اعمل ابديت وانا واقفة مكانى فى البروفايل من غير ما اعمل ريفريش للصفحة عشان اشوف البوست
  const [isShow, setisShow] = useState(false);
  const form = useForm({
    defaultValues: {
      body: "",
      image: "",
    },
  });
  let { register, handleSubmit } = form;

  function UpdatePost(value) {
    console.log(value);
    let myData = new FormData();
    myData.append("body", value.body);
    myData.append("image", value.image[0]);

    const token = localStorage.getItem("userToken");
    axios
      .put(`https://route-posts.routemisr.com/posts/${postId}`, myData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        toast.success("Post updated successfully");
        queryClient.invalidateQueries({ queryKey: ["getAllPosts"] });
        queryClient.invalidateQueries({ queryKey: ["getUserDetails"] });
        queryClient.invalidateQueries({ queryKey: ["getSinglePost"] });
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });
  }

  function changeToggle() {
    setisShow(true);
  }

  return (
    <>
      <button
        onClick={changeToggle}
        data-modal-target="authentication-modal"
        data-modal-toggle="authentication-modal"
        className="text-slate-900 mt-2.5 focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
        type="button"
      >
        <i className="fa-solid fa-pen "></i>
      </button>

      {isShow && (
        <div
          id="authentication-modal"
          aria-hidden="true"
          className=" overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
              <div className="flex items-center justify-between border-b border-default pb-4 md:pb-5">
                <h3 className="text-lg font-medium text-heading">Update</h3>
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
                onSubmit={handleSubmit(UpdatePost)}
                action="#"
                className="pt-4 md:pt-6"
              >
                <div className="mb-4">
                  <label
                    htmlFor="comment"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    Update Post
                  </label>
                  <input
                    {...register("body")}
                    type="text"
                    id="comment"
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    placeholder="Add your comment here..."
                  />
                </div>
                <div>
                  <label
                    htmlFor="postid"
                    className=" mb-2.5 text-sm font-medium text-heading "
                  >
                    <i class="fa-solid fa-image fa-2xl mb-4"></i>
                  </label>
                  <input
                    //  value={postId}
                    {...register("image")}
                    type="file"
                    id="postid"
                    className="bg-neutral-secondary-medium hidden border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand  w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    placeholder="•••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none w-full mb-3"
                >
                  Update Post
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
