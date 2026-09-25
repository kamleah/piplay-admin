import React, { Fragment, useState } from "react";
import { Card, Form, Input, Button, Select } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import "../../css/style.css";
//@ts-ignore
import logoImage1 from "../../../assets/image/Picture2.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as Constants from "../../../components/apiFile/Constants";

const SignUpNext = () => {
  const navigate = useNavigate();
  const handleLogin = (e: any) => {
    e.preventDefault();
    fetch(`${Constants.SignupUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(loginData),
    })
      .then((res) => res.json())
      .then((result) => {
        setLoginData({});
      });
  };
  let { state } = useLocation();
  if (!state) {
    state = {
      phoneNumber: "",
      streetaddress: "",
      city: "",
      pinCode: "",
    };
  }
  // validate
  const [input, setInput] = useState({
    phoneNumber: "",
    streetaddress: "",
    city: "",
    pinCode: "",
  });
  const [error, setError] = useState({
    phoneNumber: "",
    streetaddress: "",
    city: "",
    pinCode: "",
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
        case "phoneNumber":
          if (!value) {
            stateObj[name] = "Please Enter phone Number.";
          } else if (value.length < 10) {
            stateObj[name] = "Should be 10 digit phone Number";
          }
          break;
        case "streetaddress":
          if (!value) {
            stateObj[name] = "Please Enter street address.";
          }
          break;
        case "city":
          if (!value) {
            stateObj[name] = "Please Enter city.";
          }
          break;
        case "pinCode":
          if (!value) {
            stateObj[name] = "Please Enter pin Code.";
          } else if (value.length < 6) {
            stateObj[name] = "Should be 6 digit pin Code";
          }
          break;
        default:
          break;
      }
      return stateObj;
    });
  };
  const [loginData, setLoginData] = useState({});
  return (
    <>
      <Fragment>
        <div
          className="signup-card"
          style={{
            marginTop: "20px",
            width: "35%",
            marginLeft: "30%",
            borderRadius: "20px",
          }}
        >
          <Card>
            <Form>
              <img
                loading="lazy"
                src={logoImage1}
                style={{ width: "180px", marginLeft: "30%" }}
                className="d-lg-none  text-start float-start mb-4"
                alt="logo"
              />
              <h1 style={{ fontSize: "22px", fontWeight: "bold" }}>
                Almost Done!
              </h1>
              <div>Please enter the following details.</div>
              <br />
              <div style={{ marginTop: "auto" }}>
                <label>Phone</label>
                <Input
                  type="number"
                  name="mobileno"
                  placeholder="Enter your phone number"
                  min={0}
                  maxLength={10}
                  className={
                    error.phoneNumber.length > 0
                      ? "is-invalid form-control"
                      : "form-control Color-box"
                  }
                  onChange={onInputChange}
                  onBlur={validateInput}
                />
                {error.phoneNumber && (
                  <span
                    style={{
                      color: "red",
                      fontSize: "13px",
                      marginLeft: "10px",
                    }}
                    className="err"
                  >
                    {error.phoneNumber}
                  </span>
                )}
              </div>
              <br />
              <div>
                <label>Street Address</label>
                <Input
                  type="text"
                  placeholder="Enter your street address"
                  maxLength={16}
                  minLength={6}
                  name="address"
                  className={
                    error.streetaddress.length > 0
                      ? "is-invalid form-control"
                      : "form-control Color-box"
                  }
                  onChange={onInputChange}
                  onBlur={validateInput}
                />
                {error.streetaddress && (
                  <span
                    style={{
                      color: "red",
                      fontSize: "13px",
                      marginLeft: "10px",
                    }}
                    className="err"
                  >
                    {error.streetaddress}
                  </span>
                )}
              </div>
              <br />
              <div>
                <label>City</label>
                <Input
                  type="text"
                  placeholder="Enter your city"
                  name="city"
                  maxLength={16}
                  minLength={6}
                  className={
                    error.city.length > 0
                      ? "is-invalid form-control"
                      : "form-control Color-box"
                  }
                  onChange={onInputChange}
                  onBlur={validateInput}
                />
                {error.city && (
                  <span
                    style={{
                      color: "red",
                      fontSize: "13px",
                      marginLeft: "10px",
                    }}
                    className="err"
                  >
                    {error.city}
                  </span>
                )}
              </div>
              <br />
              <div>
                <label>State</label>
                <br />
                <Select value={state} style={{ width: "100%" }}>
                  <option>Select State</option>
                </Select>
              </div>
              <br />
              <div>
                <label>Pin Code</label>
                <Input
                  type="number"
                  name="pincode"
                  min={0}
                  maxLength={6}
                  placeholder="Enter your Pin Code"
                  className={
                    error.pinCode.length > 0
                      ? "is-invalid form-control"
                      : "form-control Color-box"
                  }
                  onChange={onInputChange}
                  onBlur={validateInput}
                />
                {error.pinCode && (
                  <span
                    style={{
                      color: "red",
                      fontSize: "13px",
                      marginLeft: "10px",
                    }}
                    className="err"
                  >
                    {error.pinCode}
                  </span>
                )}
              </div>
              <br />
              <Button
                className="mt-2 text-align"
                onClick={(e) => handleLogin(e)}
                style={{
                  width: "100%",
                  color: "#ffffff",
                  background: "#99b95d",
                  marginTop: "10px",
                  border: "none",
                }}
              >
                Save & Continue
              </Button>
              <ToastContainer />
            </Form>
          </Card>
        </div>
      </Fragment>
    </>
  );
};
SignUpNext.propTypes = {};

SignUpNext.defaultProps = {};

export default SignUpNext;
