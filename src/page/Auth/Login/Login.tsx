import React, { useState, useContext, useEffect, Fragment, useMemo } from "react";
import { Card, Col, Row, Form, Input, Button } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import "../../../components/css/style.css";
//@ts-ignore
import logoImage from "../../../assets/image/Picture1.png";
import appStore from "../../../assets/image/appStore.png";
import googlePlayStore from "../../../assets/image/playStore.png";
//@ts-ignore
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Container } from "@mui/material";
//@ts-ignore
import showPwdImg from "../../../assets/svg/show-password.svg";
//@ts-ignore
import hidePwdImg from "../../../assets/svg/hide-password.svg";
import * as Constants from "../../../components/apiFile/Constants";
import ToastMessage from "../../facilator/ToastMessage/ToastMessage";
import { GetSideBarAPI, getAdminRolesAPI, loginApi } from "../../../components/apiFile/Service";
import setBodyColor from "../../../components/css/setBodyColor";
import "../Login/Login.css";
import { useDispatch } from "react-redux";
import { setLoggedUser, setLoggedUserDetails, setRoleIs } from "../../../redux/Slices/LoginSlice";
import { setCreatedRoles, setSideBarData } from "../../../redux/Slices/DataSlice";

const Login = () => {
  setBodyColor({ color: "#F17121" });
  // const { authenticated, setAuthenticated } = useContext(AuthContext);
  const [isRevealPwd, setIsRevealPwd] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  dispatch(setLoggedUser(false));

  let { state } = useLocation();
  if (!state) {
    state = {
      login_id: "",
      password: "",
      role: "Admin",
    };
  }
  const [form] = Form.useForm();
  const [wrongPass, setWrongPass] = useState("");
  const [enableReset, setEnableReset] = useState(false);

  const getAdminRoles = async (access, id) => {
    let response = await getAdminRolesAPI(access, id);
    dispatch(setCreatedRoles(response?.result))
  };

  const getSideBarData = async (access, id) => {
    if (id) {
      let response = await GetSideBarAPI(access, id);
      dispatch(setSideBarData(response?.result));

      const firstViewItem = response?.result.find((item: any) => {
        if (item.children.length > 0) {
          const firstChildViewItem = item.children.find((child: any) => child.view === true);
          if (firstChildViewItem) {
            navigate(firstChildViewItem.path);
            return true;
          }
        } else if (item.view === true) {
          navigate(item.path);
          return true;
        }
        return false;
      });

      if (!firstViewItem) {
        console.log("No valid items found for navigation.");
      }
    } else {
      dispatch(setSideBarData([]));
    }
  };


  const handleLogin = async (e: any) => {
    if (enableReset != true) { } else {
      setEnableReset(false)
      let result = await loginApi(email, password, "email");
      console.log(result.message, "loginResult");
      if (result?.error == true || result?.data?.err_code == 'INVALID_LOGIN') {
        setEnableReset(true)
        toast(<ToastMessage body={"Invalid Login"} type="error" />, {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true
        });
      } else {
        // if (result.data.role.includes('Admin')) {                                //---------------------------------------------For Admin only Enable
        await getSideBarData(result.data.access_token, result.data.user.roleId)
        localStorage.setItem("auth", result.data.access_token);
        dispatch(setRoleIs('Admin'));
        dispatch(setLoggedUser(true));
        dispatch(setLoggedUserDetails(result.data.user));
        if (!result.data.user.roleId) {
          navigate("/");
        }
        await getAdminRoles(result.data.access_token, result.data.user._id)
        toast(<ToastMessage body={"Logged In Successfully"} type="success" />, {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true
        })
        console.log("ASDfasdfsadfsadfsadf")

        // } else {
        //   toast(<ToastMessage body={"Only Admin Roles can Login"} type="error" />, {
        //     position: 'top-center',
        //     autoClose: 3000,
        //     hideProgressBar: true,
        //     closeOnClick: true
        //   })
        // }
      }
    }
  };

  const emailReg = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
  const passReg =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*["!#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[A-Za-z\d"!#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,16}$/;


  // Screen Responsive media screen
  const [matches, setMatches] = useState(
    window.matchMedia("(min-width: 768px)").matches
  );

  useMemo(() => {
    password.length > 0 && passReg.test(password) && emailReg.test(email)
      ? setEnableReset(true)
      : setEnableReset(false);
    console.log("password", password)
  }, [password, email])

  useEffect(() => {
    window
      .matchMedia("(min-width: 768px)")
      .addEventListener("change", (e) => setMatches(e.matches));
  }, []);

  return (
    <Container className="login-container">
      <Card className="login-card-container">
        <Row className="login-row">
          <Col className="poster-col" lg={"auto"}>
          <div className="poster-container">
        <Card className="poster-card">
          <div className="m-20">
            <img
              loading="lazy"
              src={logoImage}
              className="login-logo d-lg-none  text-start float-start mb-4"
              alt="logo"
            />
          </div>
        </Card>
        {/* <p>Mobile App Download Link</p> */}

        <Card className="app-button-card">
          <div>
            <Button
              className="appButton"
              href="https://apps.apple.com/us/app/pi-play/id6451375568"
            >
              <img
                loading="lazy"
                src={appStore}
                className="app-logo d-lg-none  text-start float-start mb-4"
                alt="logo"
              />
            </Button>
            {/* &nbsp;&nbsp; */}
            <Button
              className="appButton ml-10"
              href="https://play.google.com/store/apps/details?id=com.padelplay.piplay"
            >
              <img
                loading="lazy"
                src={googlePlayStore}
                className="app-logo d-lg-none  text-start float-start mb-4"
                alt="logo"
              />
            </Button>
          </div>
        </Card>
      </div>
          </Col>
          <Col className="poster-col" lg={"auto"}>
            <div className="login-form-container">
              <Form form={form}>
                <h1 className="login-title">Are you a venue manager?</h1>
                <h1 className="signin">Sign in to your admin account.</h1>
                <div className="mt-30">
                  <label className="font-bold">Email</label>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    name="login_id"
                    value={email}
                    className={"form-control Color-box"}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    maxLength={64}
                    required={true}
                  />
                </div>
                <div className="pwd-container mt-20">
                  <label className="font-bold">Password</label>
                  <Input
                    placeholder="Enter Password"
                    name="password"
                    value={password}
                    type={isRevealPwd ? "text" : "password"}
                    className={"form-control Color-box"}
                    onChange={(e) => { setPassword(e.target.value); }}
                    maxLength={16}
                    required={true}
                  />
                  <img
                    title={isRevealPwd ? "Hide password" : "Show password"}
                    src={isRevealPwd ? showPwdImg : hidePwdImg}
                    onClick={() => setIsRevealPwd((prevState) => !prevState)}
                  />
                </div>
                <div className="forgotPassword-div">
                  <a
                    className="forgotPassword-link"
                    onClick={() =>
                      navigate("/ForgotPassword", { replace: true })
                    }
                  >
                    Forgot Password?
                  </a>
                </div>
                <Button
                  disabled={!enableReset}
                  className={!enableReset ? "otpDisableButton" : "otpButton"}
                  onClick={(e) => handleLogin(e)}
                >
                  Sign In
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
      </Card>
    </Container>
  );
};

Login.propTypes = {};

Login.defaultProps = {};

export default Login;
