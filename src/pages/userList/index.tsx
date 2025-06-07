import React, { useState } from 'react';

import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const CreateUserForm = () => {
    const [loading, setLoading] = useState(false);

    const onFinish = async (values: { username: string; email: string; password: string }) => {
        setLoading(true);
        try {
            const results = await axios.post('http://127.0.0.1:8000/api/v1/users/reg', values);

            message.success(`User created successfully! ID: ${results.data.id}`);
        } catch (error) {
            message.error('Failed to create user.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Email"
                name="email"
                rules={[
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Please enter a valid email!' },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>
                    Create User
                </Button>
            </Form.Item>
        </Form>
        </>
        
    );
};

const SearchUserForm = () => {
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    const onFinish = async (values: { id: string }) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/v1/users/${values.id}`);
            setUserData(response.data);
            message.success('User fetched successfully!');
        } catch (error) {
            message.error('Failed to fetch user.');
            setUserData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="User ID"
                    name="id"
                    rules={[{ required: true, message: 'Please input the user ID!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Search User
                    </Button>
                </Form.Item>
            </Form>
            {userData && (
                <div style={{ marginTop: '20px' }}>
                    <h3>User Details:</h3>
                    <p><strong>ID:</strong> {userData.id}</p>
                    <p><strong>Username:</strong> {userData.username}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Created At:</strong> {new Date(userData.created_at).toLocaleString()}</p>
                    <p><strong>Updated At:</strong> {new Date(userData.updated_at).toLocaleString()}</p>
                </div>
            )}
        </>
    );
};
const UserList = () => {
    return <div>
        <h1>user</h1>
        <CreateUserForm />
        <hr />
        <SearchUserForm />
    </div>
}

export default UserList;