import React, { useState, useEffect } from "react";
import { Card, Col, Row, Form, Input, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import "../../../components/css/style.css";
//@ts-ignore
import logoImage from "../../../assets/image/Picture2.png";
//@ts-ignore
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container } from "@mui/material";
import { forgotPasswordApi } from "../../../components/apiFile/Service";
import ToastMessage from "../../facilator/ToastMessage/ToastMessage";
import * as Constants from "../../../components/apiFile/Constants";
import setBodyColor from "../../../components/css/setBodyColor";
import { AuthContext } from "../../../routes/AuthContext";
import "../ForgotPassword/ForgotPassword.css";

const ForgotPassword = () => {
  setBodyColor({ color: "#f1f1f3" });
  const navigate = useNavigate();
  const [isSpin, setIsSpin] = useState(false);
  const [loginData, setLoginData] = useState({});
  const [phone, setPhone] = useState("");

  let { state } = useLocation();
  if (!state) {
    state = {
      login_id: "",
      password: "",
      role: "Admin",
    };
  }
  const [form] = Form.useForm();

  // validate
  const [input, setInput] = useState({
    login_id: "",
    password: "",
    role: "Admin",
  });
  const [error, setError] = useState({
    login_id: "",
    password: "",
    role: "Admin",
  });

  const onInputChange = (e) => {
    const { name, value } = e.target;
    const newLoginData = { ...loginData };
    newLoginData[e.target.name] = e.target.value;
    setLoginData(newLoginData);
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateInput(e);
  };
  const validateInput = (e) => {
    let { name, value } = e.target;
    setError((prev) => {
      const stateObj = { ...prev, [name]: "" };
      switch (name) {
        case "password":
          if (!value) {
            stateObj[name] = "Enter a password !";
          }
          break;
        default:
          break;
      }
      return stateObj;
    });
  };

  // Screen Responsive media screen
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 768px)").matches
  );
  const loggedInUser = localStorage.getItem("auth");
  useEffect(() => {
    window
      .matchMedia("(min-width: 768px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  const handleForgotPwd = async () => {
    let forgotPwddata = {
      login_id: phone.toString(),
      login_type: "mobile number",
    };
    let result = await forgotPasswordApi(forgotPwddata);
    console.log(result, "forgotpwdApi");
    if (result.error === false) {
      toast(<ToastMessage body={result.message} type="success" />, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
        navigate("/EnterOtp", { state: { phoneNumber: phone } });
      }, 3000);
    } else if (result.error) {
      toast(<ToastMessage body={result.message} type="error" />, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
        // setIsSpin(false);
      }, 3000);
    } else {
      toast(
        <ToastMessage body={Constants.network_unavailable} type="error" />,
        {
          position: "top-right",
          autoClose: 10000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      setTimeout(() => {
        // setIsSpin(false);
      }, 3000);
    }
  };

  return (
    <Container className="forgotPassword-container">
      <Row className="forgotPassword-row">
        <Col lg={"auto"}>
          <div className="m-20">
            <div className="forgotPassword-logo">
              <img src={logoImage} width="200px" height="80px" />
            </div>
            <Form form={form}>
              <h1 className="form-title">Forgot Password?</h1>
              <br />
              <p>
                Please enter the phone number associated with the account. We
                will send an OTP to reset your password.
              </p>
              <div>
                <br />
                <label className="font-bold">Phone Number</label>
                <Input
                  type="number"
                  placeholder="Enter your Phone Number"
                  name="login_id"
                  value={phone}
                  className="form-control Color-box"
                  onChange={(e) => {
                    setPhone(e.target.value.slice(0, 10));
                  }}
                  pattern="\d*"
                  maxLength={10}
                  required={true}
                />
              </div>
              <br />
              <Button
                onClick={handleForgotPwd}
                disabled={phone.length < 10}
                className={phone.length < 10 ? "otpDisableButton" : "otpButton"}
              >
                Send OTP
              </Button>
              <div className="mt-10">
                <p className="text-align">
                  Remember your password?{" "}
                  <a
                    className="forgotPassword-link"
                    onClick={() => navigate("/Login", { replace: true })}
                  >
                    Sign In
                  </a>
                </p>
              </div>

              <ToastContainer
                toastStyle={{
                  backgroundColor: "#032037",
                  color: "#ffffff",
                }}
              />
              <br />
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
export default ForgotPassword;
