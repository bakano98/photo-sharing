import React from "react";
import { Form, Input, Row, Col, Button, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthWrapper";

const { Title } = Typography;

const CodeBox = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const email = values.email;
    const accessCode = values.accessCode;
    const resp = await login(accessCode, email);
    //console.log(resp);
    if (resp.success) {
      navigate(resp.redirect);
    } else {
      alert(resp.message);
    }
  };

  return (
    <>
      <Title level={3}>Enter your access code and email</Title>
      <Title level={5}>(note that the access code is case sensitive!)</Title>
      <Form
        form={form}
        onFinish={onFinish}
        name="accessForm"
        layout="vertical"
        autoComplete="off"
        style={{ margin: 20 }}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: "Please enter your email address",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="accessCode"
          label="Access Code"
          rules={[
            {
              required: true,
              message: "Please enter your access code",
            },
            {
              type: "string",
              min: 3,
              message:
                "Access code is at least 3 characters. Please double check",
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Row justify="space-between">
            <Col>
              <Button type="primary" htmlType="reset">
                Reset
              </Button>
            </Col>
            <Col>
              <Button type="primary" htmlType="submit">
                Enter
              </Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>
    </>
  );
};

export default CodeBox;
