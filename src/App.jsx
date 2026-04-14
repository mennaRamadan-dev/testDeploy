import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./component/Layout/Layout";
import Home from "./component/Home/Home";
import Profile from "./component/Profile/Profile";
import Register from "./component/Register/Register";
import Notfound from "./component/Notfound/Notfound";
import Login from "./component/Login/Login";
import "flowbite";
// import CounterContextProvider from "./Context/CounterContext";
import UserContextProvider from "./Context/UserContext";
import ProtectedRout from "./component/ProtectedRout/ProtectedRout";
// import PostContextProvider from "./Context/PostContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import PostDetails from "./component/PostDetails/PostDetails";
import toast, { Toaster } from 'react-hot-toast';

const query = new QueryClient(); //باخد منه نسخة

function App() {
  let x = createBrowserRouter([
    {
      path: "",
      element: <Layout />,
      children: [
        {
          index: true,
          element: (
            <ProtectedRout>
              <Home />
            </ProtectedRout>
          ),
        },
        {
          path: "profile",
          element: (
            <ProtectedRout>
              <Profile />
            </ProtectedRout>
          ),
        },
        {
          path: "postdetails/:id",
          element: (
            <ProtectedRout>
              <PostDetails />
            </ProtectedRout>
          ),
        },
        { path: "register", element: <Register /> },
        { path: "login", element: <Login /> },
        { path: "*", element: <Notfound /> },
      ],
    },
  ]);
  return (
    <>
      {/* <CounterContextProvider>
        <RouterProvider router={x} />
      </CounterContextProvider> */}
      <UserContextProvider>
        {/* <PostContextProvider>
          <RouterProvider router={x} />
        </PostContextProvider> */}
        <QueryClientProvider client={query}>
          <RouterProvider router={x} />
          <Toaster />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </UserContextProvider>
    </>
  );
}

export default App;
