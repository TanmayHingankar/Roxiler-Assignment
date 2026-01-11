import React, { useState, useEffect, useContext } from 'react';
import { Card, Table, Button, Space } from 'antd';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const OwnerDashboard = () => {
  const { logout } = useContext(AuthContext);
  const [data, setData] = useState({ avg_rating: 0, raters: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/owner/dashboard');
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const columns = [
    { title: 'Rater Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Rating', dataIndex: 'rating', key: 'rating' },
    { title: 'Date', dataIndex: 'created_at', key: 'created_at', render: (val) => new Date(val).toLocaleDateString() },
  ];

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Owner Dashboard</h1>
        <Button onClick={logout}>Logout</Button>
      </div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card title="Average Rating">
          <h2>{data.avg_rating}</h2>
        </Card>
        <Card title="Raters">
          <Table dataSource={data.raters} columns={columns} rowKey="email" loading={loading} />
        </Card>
      </Space>
    </div>
  );
};

export default OwnerDashboard;