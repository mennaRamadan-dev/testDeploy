import style from "./ProtectedRout.module.css"
import React from 'react';
import { Navigate } from 'react-router-dom';
export default function ProtectedRout(props) {

  if (localStorage.getItem("userToken")){
    return props.children
  }
  else{
    return <Navigate to="/login" />
  }
}