import React, { Fragment, useState, useContext, useEffect } from "react";
import { Card, Col, Row, Form, Input, Button } from "antd";
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
//@ts-ignore
import showPwdImg from "../../../assets/svg/show-password.svg";
//@ts-ignore
import hidePwdImg from "../../../assets/svg/hide-password.svg";
import { resetPasswordApi } from "../../../components/apiFile/Service";
import ToastMessage from "../../facilator/ToastMessage/ToastMessage";
import "../ResetPassword/ResetPassword.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");

  let { state } = useLocation();
  const [form] = Form.useForm();
  const [isRevealPwd, setIsRevealPwd] = useState(false);
  const [isRevealPwd1, setIsRevealPwd1] = useState(false);

  // Screen Responsive media screen
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 768px)").matches
  );
  const passReg =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*["!#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[A-Za-z\d"!#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,16}$/;
  const [wrongPass, setWrongPass] = useState("");
  const [enableReset, setEnableReset] = useState(false);
  useEffect(() => {
    window
      .matchMedia("(min-width: 768px)")
      .addEventListener("change", (e) => setMatches(e.matches));

    password.length > 0 &&
    passReg.test(password) &&
    reEnterPassword.length > 0 &&
    password === reEnterPassword
      ? setEnableReset(true)
      : setEnableReset(false);
    console.log(passReg.test(password));
  }, [password, reEnterPassword]);

  const resetPasswordHandler = async (newPassword) => {
    let resetData = {
      login_id: state.phoneNumber.toString(),
      login_type: "mobile number",
      otp: state.otp,
      password: newPassword,
    };
    let result = await resetPasswordApi(resetData);
    console.log(result, "resetpwdData");
    //navigate("/Login", { replace: true })
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
        navigate("/Login", { replace: true });
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
    <Container className="resetPassword-container">
      <Row className="resetPassword-row">
        <Col lg={"auto"}>
          <div className="m-20">
            <div className="resetPassword-logo">
              <img src={logoImage} width="200px" height="80px" />
            </div>
            <Form form={form}>
              <h1 className="form-title">Reset Password?</h1>
              <p>Set up a new password for your account.</p>
              <div className="pwd-container m-10">
                <label className="font-bold">New Password</label>
                <Input
                  type={isRevealPwd ? "text" : "password"}
                  placeholder="Enter your Password"
                  name="login_id"
                  value={password}
                  id="login_id"
                  className="form-control Color-box"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  maxLength={16}
                  required={true}
                />
                <img
                  src={isRevealPwd ? showPwdImg : hidePwdImg}
                  onClick={() => setIsRevealPwd((prevState) => !prevState)}
                />
              </div>
              <div className="pwd-container m-10">
                <label className="font-bold">Re-enter Password</label>
                <Input
                  type={isRevealPwd1 ? "text" : "password"}
                  placeholder="Enter your Password"
                  name="login_id"
                  value={reEnterPassword}
                  id="login_id"
                  className="form-control Color-box"
                  onChange={(e) => {
                    setReEnterPassword(e.target.value);
                  }}
                  maxLength={16}
                  required={true}
                />
                <img
                  title={isRevealPwd1 ? "Hide password" : "Show password"}
                  src={isRevealPwd1 ? showPwdImg : hidePwdImg}
                  onClick={() => setIsRevealPwd1((prevState) => !prevState)}
                />
              </div>
              {password.length > 0 && !passReg.test(password) && (
                <p className="resetpassword-condition">
                  Password should be 8 chars or more including 1 Special Char, 1
                  Number, 1 Upper Case,1 Lower Case.
                </p>
              )}
              {password.length > 0 &&
                reEnterPassword.length > 0 &&
                password !== reEnterPassword && (
                  <p className="resetPassword-notmatch">
                    Password doesn't match.
                  </p>
                )}
              <Button
                onClick={() => resetPasswordHandler(password)}
                disabled={!enableReset}
                className={!enableReset ? "otpDisableButton" : "otpButton"}
              >
                Reset Password
              </Button>

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

export default ResetPassword;
