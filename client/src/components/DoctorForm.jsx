import { Button, Col, Form, Input, Row, TimePicker } from "antd";
import React, { useState } from "react";
import moment from "moment";

function DoctorForm({ onFinish, initivalValues }) {

  const [image, setImage] = useState(null);

  const handleFinish = (values) => {

    const formattedTimings = [
      values.timings[0].format("HH:mm"),
      values.timings[1].format("HH:mm"),
    ];

    const formData = new FormData();

    Object.keys(values).forEach((key) => {
      if (key !== "timings") {
        formData.append(key, values[key]);
      }
    });

    formData.append("timings", JSON.stringify(formattedTimings));

    if (image) {
      formData.append("profileImage", image);
    }

    onFinish(formData);
  };

  return (
    <Form
      layout="vertical"
      onFinish={handleFinish}
      initialValues={{
        ...initivalValues,
        ...(initivalValues && {
          timings: [
            moment(initivalValues?.timings[0], "HH:mm"),
            moment(initivalValues?.timings[1], "HH:mm"),
          ],
        }),
      }}
    >

      <h1 className="card-title mt-3">Personal Information</h1>

      <Row gutter={20}>

        <Col span={8}>
          <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="Phone Number" name="phoneNumber" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="Website" name="website">
            <Input />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="Address" name="address" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="Profile Image">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Form.Item>
        </Col>

      </Row>

      <hr />

      <h1 className="card-title mt-3">Professional Information</h1>

      <Row gutter={20}>

        <Col span={8}>
          <Form.Item label="Specialization" name="specialization" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="Experience" name="experience" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="Fee Per Consultation" name="feePerConsultation" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item label="Timings" name="timings" rules={[{ required: true }]}>
            <TimePicker.RangePicker format="HH:mm" />
          </Form.Item>
        </Col>

      </Row>

      <div className="d-flex justify-content-end">
        <Button className="primary-button" htmlType="submit">
          SUBMIT
        </Button>
      </div>

    </Form>
  );
}

export default DoctorForm;