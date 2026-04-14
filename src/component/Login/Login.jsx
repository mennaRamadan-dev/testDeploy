import style from "./Login.module.css";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../Context/UserContext";

export default function Login() {
  const [apiError, setapiError] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const navigate = useNavigate();
  let { userLogin, setUserLogin } = useContext(UserContext);

  const schema = z.object({
    email: z.email("Invalid email address"),
    password: z
      .string()
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must contain upper, lower, number and special character",
      ),
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema), // دى بتركبلى الااتنين مع بعض
  });
  const { register, handleSubmit, formState } = form;
  function handleLogin(x) {
    setisLoading(true);
    //لازم تاخد باراميتر عشان تجيب
    console.log(x);
    //call api to login user
    axios
      .post(`https://route-posts.routemisr.com/users/signin`, x)
      .then((res) => {
        setisLoading(false);

        if (res.data.success) {
          //go to login page

          // console.log(res);

          localStorage.setItem("userToken", res.data.data.token);
          setUserLogin(res.data.data.user);
          navigate("/");
        }
      })
      .catch((err) => {
        setisLoading(false);

        // console.log(err.response.data.error);
        setapiError(err.response.data.message); //show error message to user
      });
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(handleLogin)} //<====مبتعملش ريلود للصفحة
        className="max-w-md mx-auto text-left"
      >
        {/* //بعمل اتشيك الاول لو فى ايرور ظاهر او لا    */}
        {apiError && (
          <h2 className="text-center text-red-500 mb-4">{apiError}</h2>
        )}
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
          {formState.errors.email && formState.touchedFields.email ? (
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
          {formState.errors.password && formState.touchedFields.password ? (
            <p className="text-red-500 text-sm">
              {formState.errors.password.message}
            </p>
          ) : (
            ""
          )}
        </div>
        <button //<=====
          disabled={isLoading}
          type="submit"
          className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
        >
          {isLoading ? (
            <i className="fas fa-spinner fa-spin text-white"></i>
          ) : (
            "Login"
          )}
        </button>
      </form>
    </>
  );
}
