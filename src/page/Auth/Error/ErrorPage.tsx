import React from "react";
import { Link } from "react-router-dom";
import "../../../components/css/style.css";
import PageNotFound from "./warning-yellow.gif";
import "../Error/ErrorPage.css";

const ErrorPage = () => {
  return (
    <div>
      <img src={PageNotFound} className="page-not-found" />

      <h4 className="text-align">
        The page you were looking for is not found!
      </h4>
      <p className="text-align">
        You may have mistyped the address or the page may have moved.
      </p>
      <p className="text-align">
        <Link className="btn btn-primary" to="/">
          Back to Home
        </Link>
      </p>
    </div>
  );
};
export default ErrorPage;
