import { Form, Input } from 'antd'
import React from 'react'
import { Button } from 'antd'

const onFinish = (values) => {
  console.log('Success:', values); 
};

function Login() {
  return (
      <div className='authentication'>
        <div className='authentication-form card p-2'>
        <h1 className='card-title'> Welcome Back </h1>

        <Form layout='vertical' onFinish={onFinish}>

          <Form.Item label='Email' name='Email'> 
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
