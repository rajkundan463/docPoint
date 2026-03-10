import { Button, Form, Input } from "antd";
import React from "react";
import toast from "react-hot-toast";

import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import { hideLoading, showLoading } from "../redux/alertsSlice";

function Login() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values) => {

    try {

      dispatch(showLoading());

      const response = await axios.post("/api/user/login", values);

      dispatch(hideLoading());

      if (response.data.success) {

        localStorage.setItem("token", response.data.data);

        toast.success(response.data.message);
        toast("Redirecting to home page");

        setTimeout(() => {
          navigate("/");
        }, 500);

      } else {
        toast.error(response.data.message);
      }

    } catch (error) {

      dispatch(hideLoading());
      toast.error("Something went wrong");

    }
  };

  return (
    <div className="auth-page">

      <div className="auth-container">

        <div className="auth-left">
          <h1 className="brand">DOCPOINT</h1>
          <p className="tagline">
            Smart Healthcare Appointment Platform
          </p>
        </div>

        <div className="auth-right">

          <div className="authentication-form">

            <h2 className="card-title">Welcome Back</h2>

            <Form layout="vertical" onFinish={onFinish}>

              <Form.Item label="Email" name="email">
                <Input placeholder="Email" />
              </Form.Item>

              <Form.Item label="Password" name="password">
                <Input type="password" placeholder="Password" />
              </Form.Item>

              <Button className="primary-button" htmlType="submit">
                LOGIN
              </Button>

              <Link to="/register" className="anchor">
                CLICK HERE TO REGISTER
              </Link>

            </Form>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;