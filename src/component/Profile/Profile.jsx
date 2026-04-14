import { useQuery } from "@tanstack/react-query";
import style from "./Profile.module.css";
import React from "react";
import axios from "axios";
import UserDetails from "../UserDetails/UserDetails";
import ChangePasswordModal from "../ChangePasswordModal/ChangePasswordModal";
import UploadProfilePic from "./../UploadProfilePic/UploadProfilePic";
import CreatePost from "./../CreatePost/CreatePost";

export default function Profile() {
  let token = localStorage.getItem("userToken");
  function getProfile() {
    return axios.get("https://route-posts.routemisr.com/users/profile-data", {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  let { data, isError, isLoading, error } = useQuery({
    queryKey: ["getProfile"],
    queryFn: getProfile,
    select: (data) => data?.data?.data?.user,
  });
  // console.log(data);
  if (isLoading)
    return (
      <div className="text-center p-8">
        <span className="loader"></span>
      </div>
    );
  if (isError)
    return <div className="text-center p-8 text-red-500">{error?.message}</div>;
  return (
    <>
      <div className=" md:w-[60%] lg:w-[40%] mx-auto border-2 text-center bg-slate-800 rounded-lg p-4 text-warning-medium mb-6">
        <img
          src={data?.photo}
          className="size-[50px] mx-auto rounded-full"
          alt=""
        />
        <p>Name: {data?.name}</p>
        <p>Email: {data?.email}</p>
        <p>Date of Birth: {data?.dateOfBirth}</p>
        <div className="  my-6 flex items-center md:w-[80%] gap-3 lg:w-[60%] mx-auto border-2 text-center bg-slate-800 rounded-lg p-4">
          <ChangePasswordModal />
          <UploadProfilePic />
        </div>
        <CreatePost />
      </div>

      {data && <UserDetails id={data?._id} />}
    </>
  );
}
