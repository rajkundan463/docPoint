import { Form, Input } from 'antd'
import React from 'react'
import { Button } from 'antd'
import axios from 'axios';
import toast from 'react-hot-toast';    // pop for success and error messages and for negivation
import { Link, useNavigate } from 'react-router-dom'; // for navigation after successful registration


function Login() {
const navigate = useNavigate();
const onFinish = async(values) => {
  try {
    const response = await axios.post('/api/user/login', values);
    if (response.data.success) {
      toast.success(response.data.message);
      toast("Redirecting to Home page..."); // redirect to login page after successful registration
      localStorage.setItem('token', response.data.data); // store token in local storage
      navigate('/home');
    } 
    else {
      toast.error(response.data.message);
    }
  } catch (error) {
    toast.error("Something went wrong!");
  } 
};

  return (
      <div className='authentication'>
        <div className='authentication-form card p-2'>
        <h1 className='card-title'> Welcome Back </h1>

        <Form layout='vertical' onFinish={onFinish}>

          <Form.Item label='Email' name='email'> 
            <Input placeholder='Enter your Email'/>
          </Form.Item>
          <Form.Item label='Password' name='password'> 
            <Input placeholder='Enter your password'/>
          </Form.Item> 

          <Form.Item>
            <Button type="primary" htmlType="submit" className="btn btn-success">Login</Button>
          </Form.Item>
          <p>Don't have an account? <a href='/register'>Register</a></p>
        </Form>

      </div>
    </div>
  )
}

export default Login;
