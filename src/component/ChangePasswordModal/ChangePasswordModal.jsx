import style from "./ChangePasswordModal.module.css";
import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
export default function ChangePasswordModal() {
  let token = localStorage.getItem("userToken");
  const [isShow, setIsShow] = useState(false);
  const form = useForm({
    defaultValues: {
      password: "",
      newPassword: "",
    },
  });
  let { register, handleSubmit } = form;

  function Showing() {
    setIsShow(!isShow);
  }

  function handleChangePassword(values) {
    // console.log(values);
    axios
      .patch(
        `https://route-posts.routemisr.com/users/change-password`,
        values,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((res) => {
        console.log(res);
        if (res.data.success) {
          toast.success("Password changed successfully");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to change password");
      });
  }

  return (
    <>
      <button
        onClick={Showing}
        data-modal-target="authentication-modal"
        data-modal-toggle="authentication-modal"
        className="text-slate-900 cursor-pointer bg-slate-100 box-border border border-slate-400 hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
        type="button"
      >
        Change Password
        <i className="fa-solid fa-key ml-1"></i>
      </button>

      {isShow && (
        <div
          id="authentication-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
          <div className="relative p-4 w-full max-w-md max-h-full">
            <div className="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
              <div className="flex items-center justify-between border-b border-default pb-4 md:pb-5">
                <h3 className="text-lg font-medium text-heading">
                  Change Password
                </h3>
                <button
                  onClick={Showing}
                  type="button"
                  className="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
                  data-modal-hide="authentication-modal"
                >
                  <i className="fas fa-close"></i>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <form
                onSubmit={handleSubmit(handleChangePassword)}
                action="#"
                className="pt-4 md:pt-6"
              >
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    Your current Password
                  </label>
                  <input
                    type="password"
                    {...register("password")}
                    id="password"
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    placeholder="Enter your current password"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    Your new Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    {...register("newPassword")}
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    placeholder="•••••••••"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="mt-4 text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none w-full mb-3"
                >
                  Change Your Password
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
