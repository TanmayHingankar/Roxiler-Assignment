import React, { useState, useEffect, useContext } from 'react';
import { Card, Table, Button, Space, Modal, Form, Input, Select, message } from 'antd';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const { Option } = Select;

const AdminDashboard = () => {
  const { logout } = useContext(AuthContext);
  const [stats, setStats] = useState({});
  const [stores, setStores] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [storeModalVisible, setStoreModalVisible] = useState(false);
  const [userForm] = Form.useForm();
  const [storeForm] = Form.useForm();

  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchStores();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/dashboard');
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStores = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/stores');
      setStores(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleCreateUser = async (values) => {
    try {
      await axios.post('http://localhost:5000/api/admin/users', values);
      message.success('User created successfully');
      setUserModalVisible(false);
      userForm.resetFields();
      fetchUsers();
      fetchStats();
    } catch (err) {
      message.error(err.response?.data?.error || 'Failed to create user');
    }
  };

  const handleCreateStore = async (values) => {
    try {
      await axios.post('http://localhost:5000/api/admin/stores', values);
      message.success('Store created successfully');
      setStoreModalVisible(false);
      storeForm.resetFields();
      fetchStores();
      fetchStats();
    } catch (err) {
      message.error(err.response?.data?.error || 'Failed to create store');
    }
  };

  const storeColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    { title: 'Avg Rating', dataIndex: 'avg_rating', key: 'avg_rating', render: (val) => val ? val.toFixed(1) : 'N/A' },
  ];

  const userColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    { title: 'Role', dataIndex: 'role', key: 'role' },
  ];

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Admin Dashboard</h1>
        <Button onClick={logout}>Logout</Button>
      </div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', gap: 20 }}>
          <Card title="Total Users" style={{ flex: 1 }}>
            <h2>{stats.users}</h2>
          </Card>
          <Card title="Total Stores" style={{ flex: 1 }}>
            <h2>{stats.stores}</h2>
          </Card>
          <Card title="Total Ratings" style={{ flex: 1 }}>
            <h2>{stats.ratings}</h2>
          </Card>
        </div>
        <Card title="Stores">
          <Button type="primary" onClick={() => setStoreModalVisible(true)} style={{ marginBottom: 16 }}>
            Add New Store
          </Button>
          <Table dataSource={stores} columns={storeColumns} rowKey="id" />
        </Card>
        <Card title="Users">
          <Button type="primary" onClick={() => setUserModalVisible(true)} style={{ marginBottom: 16 }}>
            Add New User
          </Button>
          <Table dataSource={users} columns={userColumns} rowKey="id" />
        </Card>
      </Space>

      {/* User Creation Modal */}
      <Modal
        title="Create New User"
        open={userModalVisible}
        onCancel={() => setUserModalVisible(false)}
        footer={null}
      >
        <Form form={userForm} onFinish={handleCreateUser} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, min: 20, max: 60 }]}>
            <Input placeholder="Full name (20-60 characters)" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="Email address" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, min: 8, max: 16 }]}>
            <Input.Password placeholder="Password (8-16 chars, uppercase + special)" />
          </Form.Item>
          <Form.Item name="address" label="Address" rules={[{ max: 400 }]}>
            <Input.TextArea placeholder="Address (max 400 characters)" />
          </Form.Item>
          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select placeholder="Select role">
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
              <Option value="owner">Owner</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create User
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Store Creation Modal */}
      <Modal
        title="Create New Store"
        open={storeModalVisible}
        onCancel={() => setStoreModalVisible(false)}
        footer={null}
      >
        <Form form={storeForm} onFinish={handleCreateStore} layout="vertical">
          <Form.Item name="name" label="Store Name" rules={[{ required: true, min: 20, max: 60 }]}>
            <Input placeholder="Store name (20-60 characters)" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="Store email" />
          </Form.Item>
          <Form.Item name="address" label="Address" rules={[{ max: 400 }]}>
            <Input.TextArea placeholder="Store address (max 400 characters)" />
          </Form.Item>
          <Form.Item name="owner_id" label="Owner" rules={[{ required: true }]}>
            <Select placeholder="Select store owner">
              {users.filter(u => u.role === 'owner').map(owner => (
                <Option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Create Store
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;