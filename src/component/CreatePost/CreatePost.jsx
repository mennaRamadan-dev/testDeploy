import style from "./CreatePost.module.css";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";

export default function CreatePost() {
  const token = localStorage.getItem("userToken");
  let query = useQueryClient();
  let form = useForm({
    defaultValues: {
      body: "",
      image: "",
    },
  });
  let { register, handleSubmit } = form;

  async function handleAddPost(values) {
    if (!values?.body && !values?.image?.[0]) {
      toast.error("Please add text or select an image before posting.");
      return;
    }

    let myData = new FormData();
    try {
      if (values?.body) {
        myData.append("body", values.body);
      }
      if (values?.image?.[0]) {
        myData.append("image", values.image[0]);
      }

      let res = await axios.post(
        `https://route-posts.routemisr.com/posts`,
        myData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      // console.log("CreatePost response:", res);
      // console.log("CreatePost response data:", res.data);
      if (res.data.data.success) {
        toast.success("Post added successfully");
      }
      query.invalidateQueries({ queryKey: ["getAllPosts"] });
      query.invalidateQueries({ queryKey: ["getUserDetails"] });
    } catch (err) {
      toast.error(err.response.data.data.message);
    }
  }

  return (
    <>
      <div className=" md:w-[80%] lg:w-[40%]  mx-auto bg-slate-200 rounded-lg p-4 mb-6 ">
        <form
          onSubmit={handleSubmit(handleAddPost)}
          className="flex items-center"
        >
          <div className="flex-1">
            <input
              type="text"
              {...register("body")}
              className="w-full bg-slate-400 rounded-lg p-4"
              placeholder="What is in your mind?"
            />
          </div>
          <div>
            <label htmlFor="photo" className="cursor-pointer ">
              <i className="fa-solid fa-image fa-2xl text-black"></i>
            </label>
            <input
              type="file"
              {...register("image")}
              id="photo"
              className="hidden"
            />
          </div>
          <div>
            <button className="bg-blue-800 text-white px-4 py-2 rounded-lg ">
              Add Post
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
