import React, { useState, useEffect } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthWrapper";
import { Table, Select, Button } from "antd";

const { Option } = Select;

const UserPermissions = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState("");
  const [folders, setFolders] = useState("");
  const navigate = useNavigate();

  const handleConfirm = async (data) => {
    //console.log(data);
    const resp = await API.updateUserPermissions(data, {
      accesscode: user.code,
      email: user.email,
    });
    if (resp.success) {
      alert(resp.message);
    } else {
      alert(resp.message);
    }
  };

  const getFolders = async (headers) => {
    const resp = await API.getDirectories(headers);

    if (resp.success) {
      setFolders([...resp.data]);
    }
  };

  const getData = async (headers) => {
    const resp = await API.getUsers(headers);

    if (resp.success) {
      const data = resp.data.map((user) => ({ ...user, key: user.perfName }));
      setUserData([...data]);
    }
  };

  useEffect(() => {
    if (!userData) {
      getData({ accesscode: user.code, email: user.email });
    }

    if (!folders) {
      getFolders({ accesscode: user.code, email: user.email });
    }
  }, []);

  const columns = [
    {
      title: "Performer Name",
      dataIndex: "perfName",
      key: "perfName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          style={{ width: "100%" }}
          value={status}
          options={[
            { value: "pending", label: "pending" },
            { value: "active", label: "active" },
          ]}
          onChange={(selectedValues) =>
            handleChange(selectedValues, record, "status")
          }
          key={record.key}
        ></Select>
      ),
    },
    {
      title: "Permissions",
      dataIndex: "canAccess",
      key: "canAccess",
      render: (canAccess, record) => (
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          value={canAccess}
          onChange={(selectedValues) =>
            handleChange(selectedValues, record, "canAccess")
          }
          key={record.key}
        >
          {folders
            ? folders.map((data, index) => (
                <Option key={data + index} value={data}>
                  {data}
                </Option>
              ))
            : ""}
        </Select>
      ),
    },
    {
      title: "Send Mail",
      key: "sendMail",
      render: (text, record) => (
        <Button onClick={() => handleButtonClick(record)}>Send Email</Button>
      ),
    },
  ];

  const handleButtonClick = async (record) => {
    try {
      const res = await API.mailSingleUsercode(
        {
          email: record.email,
          perfName: record.perfName,
        },
        { accesscode: user.code, email: user.email }
      );
      if (res.success) {
        alert(`Successfully sent email to ${record.perfName}!`);
      }
    } catch (error) {
      alert("Failed to send email");
      throw error;
    }
  };

  const sendCode = async () => {
    try {
      const res = await API.mailUserCode({
        accesscode: user.code,
        email: user.email,
      });
      if (res.success) {
        alert("Successfully sent all user's their access code.");
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (selectedValues, record, field) => {
    setUserData((prevUserData) =>
      prevUserData.map((user) =>
        user.key === record.key ? { ...user, [field]: selectedValues } : user
      )
    );
  };

  return (
    <div style={{ padding: "20px", boxSizing: "border-box" }}>
      <h1>User Permissions</h1>
      <div
        style={{
          width: "100%",
          overflow: "auto",
        }}
      >
        <Table
          dataSource={userData}
          columns={columns}
          style={{ width: "1000px" }}
          pagination={false}
        />
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <Button
          style={{
            width: "100px",
            background: "#1890ff",
            color: "#fff",
            borderColor: "#1890ff",
            marginRight: "50px",
          }}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
        <Button
          style={{
            width: "100px",
            background: "#1890ff",
            color: "#fff",
            borderColor: "#1890ff",
            marginLeft: "50px",
          }}
          type="primary"
          onClick={() => handleConfirm(userData)}
        >
          Confirm
        </Button>
      </div>
      <Button type="primary" onClick={() => sendCode()}>
        Send Mail to All Users
      </Button>
    </div>
  );
};

export default UserPermissions;
