import React, { Fragment, useState, useContext, useEffect } from "react";
import { Card, Col, Row, Form, Input, Button, Divider } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import "../../../components/css/style.css";
//@ts-ignore
import logoImage from "../../../assets/image/Picture2.png";
//@ts-ignore
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CircularProgress, Container } from "@mui/material";
import * as Constants from "../../../components/apiFile/Constants";
import { AuthContext } from "../../../routes/AuthContext";
import OTPInput, { AllowedInputTypes } from "react-otp-input";
import {
  verifyOtpApi,
  resendOtpApi,
} from "../../../components/apiFile/Service";
import ToastMessage from "../../facilator/ToastMessage/ToastMessage";
import "../Otp/EnterOtp.css";

const EnterOtp = () => {
  const navigate = useNavigate();
  const [isSpin, setIsSpin] = useState(false);
  const [loginData, setLoginData] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let { state } = useLocation();
  console.log(state, "navgateCall");
  if (!state) {
    state = {
      login_id: "",
      password: "",
      role: "Admin",
    };
  }
  const [form] = Form.useForm();
  const [OTP, setOTP] = useState("");
  const handleChange = (OTP) => {
    setOTP(OTP);
  };
  const handleResetPassword = async (OTP) => {
    console.log(OTP);
    let enterOtpData = {
      login_id: state.phoneNumber.toString(),
      login_type: "mobile number",
      otp: "" + OTP,
    };
    let result = await verifyOtpApi(enterOtpData);
    console.log(result, "enterOtpData");

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
        navigate("/ResetPassword", {
          state: { otp: OTP, phoneNumber: state.phoneNumber },
        });
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
    //navigate("/ResetPassword", {state:{otp:OTP,phoneNumber:state.phoneNumber}})
  };
  const handleResendOtp = async (phone) => {
    let resendData = {
      login_id: state.phoneNumber.toString(),
      login_type: "mobile number",
    };
    let result = await resendOtpApi(resendData);
    console.log(result, "resendData");
    window.location.reload();
    if (result.error === false) {
      toast(<ToastMessage body={result.message} type="success" />, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
    //  navigate("/ResetPassword", { replace: true })
    // navigate("/ResetPassword", {state:{otp:OTP}})
  };

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
        case "login_id":
          if (!value) {
            stateObj[name] = "Invalid email id !";
          }
          if (value) {
            stateObj[name] =
              [/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/].every((pattern) =>
                pattern.test(value)
              ) || "Invalid Email Id";
          }
          break;
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
  useEffect(() => {
    window
      .matchMedia("(min-width: 768px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  return (
    <Container className="enterOtp-container">
      <Row className="enterOtp-row">
        <Col lg={"auto"}>
          <div className="m-20">
            <div className="otp-logo">
              <img src={logoImage} width="200px" height="80px" />
            </div>
            <Form form={form}>
              <h1 className="form-title">Enter OTP</h1>
              <br />
              <p>
                Please enter the code we just sent to +91 {state.phoneNumber} to
                proceed
              </p>
              <div className="mt-15">
                <OTPInput
                  onChange={handleChange}
                  value={OTP}
                  inputStyle="inputOtpStyle"
                  numInputs={6}
                  //   renderSeparator={<span>-</span>}
                  renderInput={(props) => <input {...props} />}
                />
              </div>
              <br />
              <p
                onClick={() => handleResendOtp(state.phoneNumber)}
                className="text-align"
              >
                <a className="resend-txt">Resend OTP</a>
              </p>
              <Button
                disabled={OTP.length < 6}
                onClick={() => handleResetPassword(OTP)}
                className={OTP.length < 6 ? "otpDisableButton" : "otpButton"}
              >
                Reset Password
              </Button>
              <div className="mt-10">
                <p className="text-align">
                  Remember your password?{" "}
                  <a
                    className="remember-txt"
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

export default EnterOtp;
