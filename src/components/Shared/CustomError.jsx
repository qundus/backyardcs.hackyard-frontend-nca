import React from "react";

const CustomError = ({ message, style }) => {
  return <p className={`font-inter text-red-500 ${style}`}>{message}</p>;
};

export default CustomError;
