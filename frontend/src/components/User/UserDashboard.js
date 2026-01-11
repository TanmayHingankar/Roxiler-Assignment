import React, { useState, useEffect, useContext } from 'react';
import { Card, Table, Button, Rate, Input, Space } from 'antd';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const UserDashboard = () => {
  const { logout } = useContext(AuthContext);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');

  const fetchStores = async () => {
    try {
      const params = {};
      if (searchName) params.name = searchName;
      if (searchAddress) params.address = searchAddress;
      const res = await axios.get('http://localhost:5000/api/user/stores', { params });
      setStores(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStores();
  }, [searchName, searchAddress]);

  const handleRate = async (storeId, rating) => {
    try {
      await axios.post('http://localhost:5000/api/user/ratings', { store_id: storeId, rating });
      fetchStores(); // Refresh
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    { title: 'Avg Rating', dataIndex: 'avg_rating', key: 'avg_rating', render: (val) => val ? val.toFixed(1) : 'N/A' },
    { title: 'Your Rating', dataIndex: 'user_rating', key: 'user_rating', render: (val, record) => (
      <Rate value={val} onChange={(rating) => handleRate(record.id, rating)} />
    )},
  ];

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>User Dashboard</h1>
        <Button onClick={logout}>Logout</Button>
      </div>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <Space>
            <Input placeholder="Search by name" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
            <Input placeholder="Search by address" value={searchAddress} onChange={(e) => setSearchAddress(e.target.value)} />
            <Button onClick={fetchStores}>Search</Button>
          </Space>
        </Card>
        <Card title="Stores">
          <Table dataSource={stores} columns={columns} rowKey="id" loading={loading} />
        </Card>
      </Space>
    </div>
  );
};

export default UserDashboard;