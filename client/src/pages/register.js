import { Form, Input } from 'antd'
import React from 'react'
import { Button } from 'antd'
import axios from 'axios';
import toast from 'react-hot-toast';    // pop for success and error messages and for negivation
import { Link ,useNavigate } from 'react-router-dom'; // for navigation after successful registration
import {useDispatch} from 'react-redux'; // for dispatching actions
import { showLoading, hideLoading } from '../redux/alertSlices'; // for showing and hiding loading state

function Register() {
const dispatch = useDispatch();
const navigate = useNavigate();
const onFinish = async(values) => {
  try {
    dispatch(showLoading()); // show loading spinner
    const response = await axios.post('/api/user/register', values);
    dispatch(hideLoading()); // hide loading spinner
    if (response.data.success) {
      toast.success(response.data.message);
      toast("Redirecting to login page..."); // redirect to login page after successful registration
      navigate('/login');
    } 
    else {
      toast.error(response.data.message);
    }
  } catch (error) {
  dispatch(hideLoading());
  toast.error("Something went wrong!");
  } 
};


  return (
      <div className='authentication'>
        <div className='authentication-form card p-2'>
        <h1 className='card-title'> NAMASTE 🙏 </h1>

        <Form layout='vertical' onFinish={onFinish}>

          <Form.Item label='Name' name='name'> 
            <Input placeholder='Enter your name'/>
          </Form.Item>
          <Form.Item label='Email' name='email'> 
            <Input placeholder='Enter your Email'/>
          </Form.Item>
          <Form.Item label='Password' name='password'> 
            <Input placeholder='Enter your password'/>
          </Form.Item>
          <Form.Item label='Confirm Password' name='confirmPassword'> 
            <Input placeholder='Confirm your password'/>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="btn btn-success">Register</Button>
          </Form.Item>
            <p>Already have an account? <a href='/login'>Login</a></p>
        </Form>

      </div>
    </div>
  )
}

export default Register;
