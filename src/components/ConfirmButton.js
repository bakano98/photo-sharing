import React, { useState } from "react";
import { Button, Modal, Space } from "antd";

const ConfirmButton = ({ resetSelection, handleConfirmation, msg }) => {
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
      <Button type="primary" onClick={resetSelection}>
        Reset Selection
      </Button>
      <Button type="primary" onClick={showModal}>
        Confirm Selection
      </Button>
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
