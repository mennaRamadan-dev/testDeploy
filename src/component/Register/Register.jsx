import style from "./Register.module.css";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [apiError, setapiError] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();
  const schema = z
    .object({
      name: z
        .string()
        .min(2, "Name must be at least 2 characters long")
        .max(50, "Name must be at most 50 characters long"),
      username: z
        .string()
        .min(2, "Username must be at least 2 characters long")
        .max(30, "Username must be at most 30 characters long"),
      email: z.email("Invalid email address"),
      password: z
        .string()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
          "Password must contain upper, lower, number and special character",
        ),

      rePassword: z.string(),
      dateOfBirth: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .refine((date) => {
          const dob = new Date(date);
          const today = new Date();
          today.setHours(0, 0, 0, 0); //عشان ميرجعليش بالثانية والهبل دا
          return dob < today;
        }, "Invalid date"),
      gender: z.enum(["male", "female"], "Gender must be either"),
    })
    .refine((object) => object.password === object.rePassword, {
      error: "Passwords do not match",
      path: ["rePassword"], //يشاور للحقل اللي
    });

  const form = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    resolver: zodResolver(schema), // دى بتركبلى الااتنين مع بعض
  });
  const { register, handleSubmit, formState } = form;
  function handleRegister(x) {
    setisLoading(true);
    //لازم تاخد باراميتر عشان تجيب
    // console.log(x);
    //call api to register user
    axios
      .post(`https://route-posts.routemisr.com/users/signup`, x)
      .then((res) => {
        setisLoading(false);

        if (res.data.success) {
          //go to login page
          navigate("/login");
        }
      })
      .catch((err) => {
        setisLoading(false);

        // console.log(err.response?.data);
        setapiError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            err.response?.statusText ||
            err.message,
        );
        //show error message to user
      });
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(handleRegister)} //<====مبتعملش ريلود للصفحة
        className="max-w-md mx-auto text-left"
      >
        {/* //بعمل اتشيك الاول لو فى ايرور ظاهر او لا    */}
        {apiError && (
          <h2 className="text-center text-red-500 mb-4">{apiError}</h2>
        )}
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            {...register("name")} //<====
            id="name"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          <label
            htmlFor="name"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Enter Your Name
          </label>
          {formState.errors.name &&
          (formState.touchedFields.name || formState.isSubmitted) ? (
            <p className="text-red-500 text-sm">
              {formState.errors.name.message}
            </p>
          ) : (
            ""
          )}
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            {...register("username")}
            id="username"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          <label
            htmlFor="username"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Enter Your Username
          </label>
          {formState.errors.username &&
          (formState.touchedFields.username || formState.isSubmitted) ? (
            <p className="text-red-500 text-sm">
              {formState.errors.username.message}
            </p>
          ) : (
            ""
          )}
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="email"
            {...register("email")}
            id="email"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          <label
            htmlFor="email"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Enter Your Email
          </label>
          {formState.errors.email &&
          (formState.touchedFields.email || formState.isSubmitted) ? (
            <p className="text-red-500 text-sm">
              {formState.errors.email.message}
            </p>
          ) : (
            ""
          )}
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="password"
            {...register("password")}
            id="password"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          <label
            htmlFor="password"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Enter Your Password
          </label>
          {formState.errors.password &&
          (formState.touchedFields.password || formState.isSubmitted) ? (
            <p className="text-red-500 text-sm">
              {formState.errors.password.message}
            </p>
          ) : (
            ""
          )}
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="password"
            {...register("rePassword")}
            id="rePassword"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          <label
            htmlFor="rePassword"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Re-enter Your Password
          </label>
          {formState.errors.rePassword &&
          (formState.touchedFields.rePassword || formState.isSubmitted) ? (
            <p className="text-red-500 text-sm">
              {formState.errors.rePassword.message}
            </p>
          ) : (
            ""
          )}
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="date"
            {...register("dateOfBirth")}
            id="dateOfBirth"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          <label
            htmlFor="dateOfBirth"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Enter Your Date of Birth
          </label>
          {formState.errors.dateOfBirth &&
          (formState.touchedFields.dateOfBirth || formState.isSubmitted) ? (
            <p className="text-red-500 text-sm">
              {formState.errors.dateOfBirth.message}
            </p>
          ) : (
            ""
          )}
        </div>
        {formState.errors.gender &&
        (formState.touchedFields.gender || formState.isSubmitted) ? (
          <p className="text-red-500 text-sm mb-3">
            {formState.errors.gender.message}
          </p>
        ) : (
          ""
        )}
        <div className="flex gap-4">
          <div className="flex items-center mb-4">
            <input
              id="male"
              type="radio"
              {...register("gender")}
              value="male"
              className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
            />
            <label
              htmlFor="male"
              className="select-none ms-2 text-sm font-medium text-heading"
            >
              Male
            </label>
          </div>
          <div className="flex items-center mb-4">
            <input
              id="female"
              type="radio"
              {...register("gender")}
              value="female"
              className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
            />
            <label
              htmlFor="female"
              className="select-none ms-2 text-sm font-medium text-heading"
            >
              Female
            </label>
          </div>
        </div>
        <button //<=====
          disabled={isLoading}
          type="submit"
          className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
        >
          {isLoading ? (
            <i className="fas fa-spinner fa-spin text-white"></i>
          ) : (
            "Submit"
          )}
        </button>
      </form>
    </>
  );
}
