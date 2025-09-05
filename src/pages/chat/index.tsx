import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Select, List, Pagination } from 'antd';
import axios from 'axios';
import { convertLocalPathToUrl } from '../../utils/format';
import ImageToVideoPage from './imagetoVideo';
import './chat-page-ultra-cool.css';
const { Option } = Select;


// 1. User Registration
const RegisterUserForm = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/users/reg', { ...values, mock: true });
      const { code, message: msgText, data } = res.data || {};
      if (code === 0) {
        setUser(data);
        message.success('Registration successful');
      } else {
        throw new Error(msgText || 'Registration failed');
      }
    } catch (e: any) {
      message.error(e?.message || 'Registration failed');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Register New User" style={{ marginBottom: 24 }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Username" name="username" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>Register</Button>
      </Form>
      {user && (
        <div style={{ marginTop: 16 }}>
          <b>Registration successful:</b>
          <div>ID: {user.id}</div>
          <div>Username: {user.username}</div>
          <div>Email: {user.email}</div>
          <div>Registration time: {user.created_at}</div>
        </div>
      )}
    </Card>
  );
};

// 2. Generate Message and Media
const GenerateMessageForm = () => {
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState<any>(null);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/messages/generate', { ...values,image_url: '' });
      const { code, message: msgText, data } = res.data || {};
      if (code === 0) {
        setMedia(data);
        message.success('Message generated successfully');
      } else {
        throw new Error(msgText || 'Generation failed');
      }
    } catch (e: any) {
      message.error(e?.message || 'Generation failed');
      setMedia(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Generate Message and Media" style={{ marginBottom: 24 }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Prompt" name="prompt" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="User ID" name="user_id" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Media Type" name="media_type">
          <Select allowClear placeholder="Please select">
            <Option value="image">Image</Option>
            <Option value="video">Video</Option>
            <Option value="text">Text</Option>
            <Option value="image2video">Image to Video</Option>
          </Select>
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>Generate</Button>
      </Form>
      {media && (
        <div style={{ marginTop: 16 }}>
          <b>Generation Result:</b>
          {(
            media.image_url &&
            <div style={{ marginTop: 8 }}>
              <div>Image ID: {media.id}</div>
              <div>Image URL: {media.image_url}</div>
              <div>Dimensions: {media.width} x {media.height}</div>
              <div>Format: {media.format}</div>
              <div>Created at: {media.created_at}</div>
              <img src={convertLocalPathToUrl(media.image_url)} alt="media" style={{ maxWidth: 300, display: 'block', marginTop: 8 }} />
            </div>
          )}
          {(
            media.video_url &&
            <div style={{ marginTop: 8 }}>
              <div>Video ID: {media.id}</div>
              <div>Video URL: {media.video_url}</div>
              <div>Created at: {media.created_at}</div>
              <video src={convertLocalPathToUrl(media.video_url)} controls style={{ maxWidth: 300, display: 'block', marginTop: 8 }} />
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

// 3. Get Message by ID
const GetMessageByIdForm = () => {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<any>(null);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/messages/${values.message_id}`, { params: { mock: true } });
      const { code, message: msgText, data } = res.data || {};
      if (code === 0) {
        setMsg(data);
        message.success('Query successful');
      } else {
        throw new Error(msgText || 'Query failed');
      }
    } catch (e: any) {
      message.error(e?.message || 'Query failed');
      setMsg(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Get Message by ID" style={{ marginBottom: 24 }}>
      <Form layout="inline" onFinish={onFinish}>
        <Form.Item label="Message ID" name="message_id" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>Query</Button>
      </Form>
      {msg && (
        <div style={{ marginTop: 16 }}>
          <div>ID: {msg.id}</div>
          <div>Prompt: {msg.prompt}</div>
          <div>User ID: {msg.user_id}</div>
          <div>Media Type: {msg.media_type}</div>
          <div>Created at: {msg.created_at}</div>
        </div>
      )}
    </Card>
  );
};

// 4. Get Messages by User ID (with pagination and type filtering)
const GetMessagesByUserForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({ user_id: '', media_type: undefined as string | undefined, skip: 0, limit: 10 });

  const fetchData = async (p = params) => {
    if (!p.user_id) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/messages/by_user/${p.user_id}`, {
        params: {
          media_type: p.media_type,
          skip: p.skip,
          limit: p.limit,
          //mock: true,
        }
      });
      const { code, message: msgText, data } = res.data || {};
      if (code === 0) {
        setMessages(Array.isArray(data) ? data : []);
        const length = Array.isArray(data) ? data.length : 0;
        setTotal(length < p.limit ? p.skip + length : p.skip + p.limit + 1);
      } else {
        throw new Error(msgText || 'Query failed');
      }
    } catch (e: any) {
      message.error(e?.message || 'Query failed');
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values: any) => {
    const newParams = { ...params, ...values, skip: 0 };
    setParams(newParams);
    fetchData(newParams);
  };

  const onPageChange = (page: number, pageSize: number) => {
    const newParams = { ...params, skip: (page - 1) * pageSize, limit: pageSize };
    setParams(newParams);
    fetchData(newParams);
  };

  return (
    <Card title="Get Messages by User ID" style={{ marginBottom: 24 }}>
      <Form layout="inline" form={form} onFinish={onFinish}>
        <Form.Item label="User ID" name="user_id" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Media Type" name="media_type">
          <Select allowClear style={{ width: 120 }}>
            <Option value="image">Image</Option>
            <Option value="video">Video</Option>
          </Select>
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>Query</Button>
      </Form>
      <List
        style={{ marginTop: 16 }}
        bordered
        dataSource={messages}
        loading={loading}
        renderItem={item => (
          <List.Item>
            <div>
              <div>ID: {item.id}</div>
              <div>Prompt: {item.prompt}</div>
              <div>Media Type: {item.media_type}</div>
              <div>Created at: {item.created_at}</div>
            </div>
          </List.Item>
        )}
      />
      {messages.length > 0 && (
        <Pagination
          style={{ marginTop: 16, textAlign: 'right' }}
          total={total}
          pageSize={params.limit}
          current={params.skip / params.limit + 1}
          onChange={onPageChange}
        />
      )}
    </Card>
  );
};

// 5. Get Message Media
const GetMediaByMessageIdForm = () => {
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState<any>(null);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/messages/${values.message_id}/media`, { params: { mock: true } });
      const { code, message: msgText, data } = res.data || {};
      if (code === 0) {
        setMedia(data);
        message.success('Retrieved successfully');
      } else {
        throw new Error(msgText || 'Retrieval failed');
      }
    } catch (e: any) {
      message.error(e?.message || 'Retrieval failed');
      setMedia(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="Get Message Media" style={{ marginBottom: 24 }}>
      <Form layout="inline" onFinish={onFinish}>
        <Form.Item label="Message ID" name="message_id" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>Get</Button>
      </Form>
      {media && (
        <div style={{ marginTop: 16 }}>
          {media.image_url && (
            <div>
              <div>Image ID: {media.id}</div>
              <div>Image URL: {media.image_url}</div>
              <img src={convertLocalPathToUrl(media.image_url)} alt="media" style={{ maxWidth: 300 }} />
            </div>
          )}
          {media.video_url && (
            <div>
              <div>Video ID: {media.id}</div>
              <div>Video:</div>
              <video src={convertLocalPathToUrl(media.video_url)} controls style={{ maxWidth: 300 }} />
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

const ChatPage = () => {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
      <h1>AI Message and Media Demo</h1>
      <RegisterUserForm />
      <GenerateMessageForm />
      <GetMessageByIdForm />
      <GetMessagesByUserForm />
      <GetMediaByMessageIdForm />
      <ImageToVideoPage />
    </div>
  );
};

export default ChatPage;