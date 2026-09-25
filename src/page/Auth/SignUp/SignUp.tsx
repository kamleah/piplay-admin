import React, { Fragment, useState } from "react";
import { Card, Col, Row, Form, Input, Button } from "antd";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../../components/css/style.css";
//@ts-ignore
import logoImage from "../../../assets/image/Picture1.png";
//@ts-ignore
import logoImage1 from "../../../assets/image/Picture2.png";
import { FcGoogle } from "react-icons/fc";
import { BsApple } from "react-icons/bs";
import { FaFacebookSquare } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
//@ts-ignore
import showPwdImg from "../../../assets/svg/show-password.svg";
//@ts-ignore
import hidePwdImg from "../../../assets/svg/hide-password.svg";

const SignUp = () => {
  const [isRevealPwd, setIsRevealPwd] = useState(false);
  const navigate = useNavigate();
  const [isSpin, setIsSpin] = useState(false);

  let { state } = useLocation();
  if (!state) {
    state = {
      lastname: "",
      firstname: "",
      businessMailId: "",
      clubName: "",
      pwd: "",
    };
  }

  // validate
  const [input, setInput] = useState({
    lastname: "",
    firstname: "",
    businessMailId: "",
    clubName: "",
    pwd: "",
  });
  const [error, setError] = useState({
    lastname: "",
    firstname: "",
    businessMailId: "",
    clubName: "",
    pwd: "",
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
        case "firstname":
          if (!value) {
            stateObj[name] = "Please Enter Full Name.";
          }
          break;
        case "lastname":
          if (!value) {
            stateObj[name] = "Please Enter Last Name.";
          }
          break;
        case "businessMailId":
          if (!value) {
            stateObj[name] = "Please Enter business Mail Id.";
          }
          if (value) {
            stateObj[name] =
              [/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/].every((pattern) =>
                pattern.test(value)
              ) || "Invalid User Email";
          }
          break;
        case "clubName":
          if (!value) {
            stateObj[name] = "Please Enter club name.";
          }
          break;
        case "pwd":
          if (!value) {
            stateObj[name] = "Please Enter password.";
          }
          break;

        default:
          break;
      }
      return stateObj;
    });
  };
  const [loginData, setLoginData] = useState({});
  const handleBlur = (e) => {
    const newLoginData = { ...loginData };
    newLoginData[e.target.name] = e.target.value;
    setLoginData(newLoginData);
  };

  const handleLogin = (e: any) => {
    e.preventDefault();
    toast.success("Almost Complete", {
      position: "top-right",
      // autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    //setIsSpin(true);
    setTimeout(() => {
      setIsSpin(false);
      navigate("/SignUpNext");
      // setLoginData({});
    }, 3000);
  };
  return (
    <>
      <Fragment>
        <div
          className="signup-card"
          style={{
            marginTop: "20px",
            width: "700px",
            height: "auto",
            marginLeft: "200px",
            borderRadius: "20px",
          }}
        >
          <Card>
            <Row gutter={16}>
              <Col span={6}>
                <img
                  loading="lazy"
                  src={logoImage}
                  style={{
                    width: "350px",
                    height: "100%",
                    background: "#524f7e",
                    borderRadius: "20px",
                  }}
                  className="d-lg-none  text-start float-start mb-4"
                  alt="logo"
                />
                <img
                  loading="lazy"
                  src={logoImage1}
                  style={{
                    width: "200px",
                    position: "absolute",
                    margin: "auto",
                    marginLeft: "80px",
                    marginTop: "-360px",
                  }}
                  className="d-lg-none  text-start float-start mb-4"
                  alt="logo"
                />
              </Col>
              <Col span={10} style={{ marginLeft: "auto" }}>
                <Form>
                  <h1 style={{ fontSize: "16px", fontWeight: "bold" }}>
                    Get Started with your club account!
                  </h1>
                  <div style={{ marginTop: "auto" }}>
                    <br />
                    <label>Full Name</label>
                    <Input
                      type="text"
                      placeholder="Enter your full name"
                      name="firstname"
                      className={
                        error.firstname.length > 0
                          ? "is-invalid form-control"
                          : "form-control Color-box"
                      }
                      onChange={onInputChange}
                      onBlur={validateInput}
                      minLength={6}
                      maxLength={16}
                    />
                    {error.firstname && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "13px",
                          marginLeft: "10px",
                        }}
                        className="err"
                      >
                        {error.firstname}
                      </span>
                    )}
                  </div>
                  <br />
                  <div>
                    <label>Business Email</label>
                    <Input
                      type="email"
                      placeholder="Enter your business email"
                      name="businessMailId"
                      className={
                        error.businessMailId.length > 0
                          ? "is-invalid form-control"
                          : "form-control Color-box"
                      }
                      onChange={onInputChange}
                      onBlur={validateInput}
                    />
                    {error.businessMailId && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "13px",
                          marginLeft: "10px",
                        }}
                        className="err"
                      >
                        {error.businessMailId}
                      </span>
                    )}
                  </div>
                  <br />
                  <div>
                    <label>Club Name</label>
                    <Input
                      type="text"
                      placeholder="Enter your clubs Name"
                      name="clubName"
                      className={
                        error.clubName.length > 0
                          ? "is-invalid form-control"
                          : "form-control Color-box"
                      }
                      onChange={onInputChange}
                      onBlur={validateInput}
                      minLength={6}
                      maxLength={16}
                    />
                    {error.clubName && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "13px",
                          marginLeft: "10px",
                        }}
                        className="err"
                      >
                        {error.clubName}
                      </span>
                    )}
                  </div>{" "}
                  <br />
                  <Input
                    type="hidden"
                    value="Admin"
                    name="role"
                    onChange={handleBlur}
                  />
                  <div className="pwd-container">
                    <label>Password</label>
                    <Input
                      placeholder="Enter Password"
                      name="pwd"
                      minLength={6}
                      type={isRevealPwd ? "text" : "password"}
                      onChange={onInputChange}
                      onBlur={validateInput}
                    />
                    <img
                      title={isRevealPwd ? "Hide password" : "Show password"}
                      src={isRevealPwd ? hidePwdImg : showPwdImg}
                      onClick={() => setIsRevealPwd((prevState) => !prevState)}
                    />
                    {error.pwd && (
                      <span
                        style={{
                          color: "red",
                          fontSize: "13px",
                          marginLeft: "10px",
                        }}
                        className="err"
                      >
                        {error.pwd}
                      </span>
                    )}
                  </div>{" "}
                  <br />
                  <Button
                    className="mt-2 text-align"
                    onClick={(e) => handleLogin(e)}
                    style={{
                      color: "#ffffff",
                      width: "100%",
                      background: "#99b95d",
                      marginTop: "10px",
                      border: "none",
                    }}
                  >
                    SignUp
                  </Button>
                  <ToastContainer />
                  <div className="text-align" style={{ marginTop: "10px" }}>
                    Already have the account ?
                    <Link to="/Login" style={{ color: "#99b95d" }}>
                      {" "}
                      Sign In
                    </Link>
                  </div>
                  <br /> <hr />
                  <div className="text-align" style={{ marginTop: "10px" }}>
                    Sign up with
                  </div>{" "}
                  <br />
                  <div className="text-align">
                    <Link to="#" style={{ color: "black", fontSize: "18px" }}>
                      <BsApple />
                    </Link>
                    &nbsp;&nbsp;&nbsp;
                    <Link to="#" style={{ color: "black", fontSize: "18px" }}>
                      <FcGoogle />
                    </Link>
                    &nbsp;&nbsp;&nbsp;
                    <Link to="#" style={{ color: "blue", fontSize: "18px" }}>
                      <FaFacebookSquare />
                    </Link>
                  </div>
                </Form>
                <footer style={{ color: "gray" }}>
                  By signing up, you agree to the{" "}
                  <Link to="#">
                    <u>Terms of service</u>
                  </Link>{" "}
                  and{" "}
                  <Link to="#">
                    <u>Privacy Policy</u>
                  </Link>
                </footer>
              </Col>
            </Row>
          </Card>
        </div>
      </Fragment>
    </>
  );
};
SignUp.propTypes = {};

SignUp.defaultProps = {};

export default SignUp;
