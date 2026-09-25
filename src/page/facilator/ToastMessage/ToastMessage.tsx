import React, { Fragment } from "react";
import "../../../components/css/style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import succesIcon from "../../../assets/icon/success.png";
import errorIcon from "../../../assets/icon/error.png";

const ToastMessage = ({ title = "Pi Play", body, type }) => {
  return (
    <div className="toastWrapper">
      <img
        width="26px"
        height="26px"
        src={type === "success" ? succesIcon : errorIcon}
      />
      <div className="toastBodyWrapper">
        <h4 className="toastTitle">{title}</h4>
        <p className="toastBody">{body}</p>
      </div>
    </div>
  );
};
export default ToastMessage;
