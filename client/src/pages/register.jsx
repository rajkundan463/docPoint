import React from "react";
import { Form, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

function Register() {

  const navigate = useNavigate();

  const onFinish = async(values)=>{
    try{

      const response = await axios.post(
        "/api/user/register",
        values
      );

      if(response.data.success){

        toast.success(response.data.message);
        navigate("/login");

      }else{
        toast.error(response.data.message);
      }

    }catch(error){
      toast.error("Something went wrong");
    }
  }

  return (

    <div className="auth-page">

      <div className="auth-container">

        {/* LEFT BRAND PANEL */}

        <div className="auth-left">

          <h1 className="brand">DOCPOINT</h1>

          <p className="tagline">
            Smart Healthcare Appointment Platform
          </p>

        </div>


        {/* RIGHT FORM PANEL */}

        <div className="auth-right">

          <div className="authentication-form">

            <h2 className="card-title">Create Account</h2>

            <Form layout="vertical" onFinish={onFinish}>

              <Form.Item label="Name" name="name">
                <Input placeholder="Full Name"/>
              </Form.Item>

              <Form.Item label="Email" name="email">
                <Input placeholder="Email"/>
              </Form.Item>

              <Form.Item label="Password" name="password">
                <Input type="password" placeholder="Password"/>
              </Form.Item>

              <Button
                className="primary-button"
                htmlType="submit"
              >
                REGISTER
              </Button>

              <Link
                to="/login"
                className="anchor"
              >
                ALREADY HAVE ACCOUNT ?
              </Link>

            </Form>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;