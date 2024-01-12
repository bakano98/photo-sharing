import React, { useState } from "react";
import { Button, Modal, Space } from "antd";

const ConfirmButton = ({
  handleConfirmation,
  handleReset,
  msg,
  okButtonMsg,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    // Callback function that triggers the API.
    handleConfirmation();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Space>
      <div
        style={{
          position: "fixed",
          bottom: 20,
          left: "10%", // Adjust the percentage as needed
          zIndex: 1000,
        }}
      >
        <Button type="primary" onClick={handleReset}>
          Reset
        </Button>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: "3%", // Adjust the percentage as needed
          zIndex: 1000,
        }}
      >
        <Button type="primary" onClick={showModal}>
          {okButtonMsg}
        </Button>
      </div>
      <Modal
        title="Confirmation"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Are you sure you want to {msg} these photos for editing?</p>
      </Modal>
    </Space>
  );
};

export default ConfirmButton;
