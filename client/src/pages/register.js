import { Form, Input } from 'antd'
import React from 'react'
import { Button } from 'antd'

const onFinish = (values) => {
  console.log('Success:', values); 
};

function Register() {
  return (
      <div className='authentication'>
        <div className='authentication-form card p-2'>
        <h1 className='card-title'> NAMASTE 🙏 </h1>

        <Form layout='vertical' onFinish={onFinish}>

          <Form.Item label='Name' name='name'> 
            <Input placeholder='Enter your name'/>
          </Form.Item>
          <Form.Item label='Email' name='Email'> 
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

export default Register
