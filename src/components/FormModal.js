import React, { useState } from "react";
import { Form, Input, Modal, Typography } from "antd";
import API from "../api";

const { Link } = Typography;

const FormModal = () => {
  const [visibility, setVisibility] = useState(false);
  const [form] = Form.useForm();

  // This will make API call to add to MongoDB with the current form values.
  const onConfirm = async (values) => {
    setVisibility(false);
    const data = {
      _id: values.perfName + values.email,
      perfName: values.perfName,
      email: values.email,
    };
    // Send API call to backend
    const response = await API.addUser(data);
    if (response.success) {
      // Redirect to new page later. This will look better. Look up React Routes
      alert(
        "Your subscription has been received. Please wait for Bakano to contact you."
      );
    } else {
      if (response.status === 500) {
        alert("Server is currently down -- sorry for any inconvenience.");
      } else if (response.message === "pending") {
        alert("Your application is pending. Please wait");
      } else {
        alert(
          "You are already subscribed! Please message Bakano if this is a mistake."
        );
      }
    }
    form.resetFields();
  };

  return (
    <>
      <div onClick={() => setVisibility(true)}>
        <Link href="#" style={{ fontSize: 24 }}>
          Not yet subscribed?
        </Link>
      </div>

      <Modal
        open={visibility}
        title="Please fill in the following details:"
        okText="Subscribe"
        cancelText="Cancel"
        onCancel={() => setVisibility(false)}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              onConfirm(values);
            })
            .catch((info) => {
              //console.log("Validate Failed:", info);
            });
        }}
      >
        <Form
          form={form}
          layout="vertical"
          name="form_in_modal"
          initialValues={{
            modifier: "public",
          }}
        >
          <Form.Item
            name="perfName"
            label="Performer Name"
            rules={[
              {
                required: true,
                message: "Please input your performer name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please provide your email!",
              },
            ]}
          >
            <Input type="textarea" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default FormModal;
