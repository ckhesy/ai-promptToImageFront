import React, { useState } from 'react';
import { Card, Form, Input, Button, message, Select, List, Pagination, InputNumber } from 'antd';
import axios from 'axios';
import { convertLocalPathToUrl } from '../../utils/format';
import ImageToVideoPage from './imagetoVideo';
import './chat-page-ultra-cool.css';
const { Option } = Select;


// 1. 用户注册
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
        message.success('注册成功');
      } else {
        throw new Error(msgText || '注册失败');
      }
    } catch (e: any) {
      message.error(e?.message || '注册失败');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="注册新用户" style={{ marginBottom: 24 }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="用户名" name="username" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="邮箱" name="email" rules={[{ required: true, type: 'email' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="密码" name="password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>注册</Button>
      </Form>
      {user && (
        <div style={{ marginTop: 16 }}>
          <b>注册成功：</b>
          <div>ID: {user.id}</div>
          <div>用户名: {user.username}</div>
          <div>邮箱: {user.email}</div>
          <div>注册时间: {user.created_at}</div>
        </div>
      )}
    </Card>
  );
};

// 2. 生成消息和媒体
const GenerateMessageForm = () => {
  const [loading, setLoading] = useState(false);
  const [media, setMedia] = useState<any>(null);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/api/v1/messages/generate', { ...values, image_url: '' });
      const { code, message: msgText, data } = res.data || {};
      if (code === 0) {
        setMedia(data);
        message.success('消息生成成功');
      } else {
        throw new Error(msgText || '生成失败');
      }
    } catch (e: any) {
      message.error(e?.message || '生成失败');
      setMedia(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="生成消息和媒体" style={{ marginBottom: 24 }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item label="Prompt" name="prompt" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="用户ID" name="user_id" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="媒体类型" name="type">
          <Select allowClear placeholder="请选择">
            <Option value="image">图片</Option>
            <Option value="video">视频</Option>
            <Option value="text">文本</Option>
            <Option value="image2video">图生视频</Option>
          </Select>
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>生成</Button>
      </Form>
      {media && (
        <div style={{ marginTop: 16 }}>
          <b>生成结果：</b>
          {(
            <div style={{ marginTop: 8 }}>
              <div>图片ID: {media.id}</div>
              <div>图片地址: {media.image_url}</div>
              <div>尺寸: {media.width} x {media.height}</div>
              <div>格式: {media.format}</div>
              <div>创建时间: {media.created_at}</div>
              <img src={convertLocalPathToUrl(media.image_url)} alt="media" style={{ maxWidth: 300, display: 'block', marginTop: 8 }} />
            </div>
          )}
          {(
            <div style={{ marginTop: 8 }}>
              <div>视频ID: {media.id}</div>
              <div>视频地址: {media.video_url}</div>
              <div>创建时间: {media.created_at}</div>
              <video src={convertLocalPathToUrl(media.video_url)} controls style={{ maxWidth: 300, display: 'block', marginTop: 8 }} />
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

// 3. 按ID查询消息
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
        message.success('查询成功');
      } else {
        throw new Error(msgText || '查询失败');
      }
    } catch (e: any) {
      message.error(e?.message || '查询失败');
      setMsg(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="按ID查询消息" style={{ marginBottom: 24 }}>
      <Form layout="inline" onFinish={onFinish}>
        <Form.Item label="消息ID" name="message_id" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>查询</Button>
      </Form>
      {msg && (
        <div style={{ marginTop: 16 }}>
          <div>ID: {msg.id}</div>
          <div>Prompt: {msg.prompt}</div>
          <div>用户ID: {msg.user_id}</div>
          <div>媒体类型: {msg.media_type}</div>
          <div>创建时间: {msg.created_at}</div>
        </div>
      )}
    </Card>
  );
};

// 4. 按用户ID查询消息（带分页和类型筛选）
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
        throw new Error(msgText || '查询失败');
      }
    } catch (e: any) {
      message.error(e?.message || '查询失败');
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
    <Card title="按用户ID查询消息" style={{ marginBottom: 24 }}>
      <Form layout="inline" form={form} onFinish={onFinish}>
        <Form.Item label="用户ID" name="user_id" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="媒体类型" name="media_type">
          <Select allowClear style={{ width: 120 }}>
            <Option value="image">图片</Option>
            <Option value="video">视频</Option>
          </Select>
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>查询</Button>
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
              <div>媒体类型: {item.media_type}</div>
              <div>创建时间: {item.created_at}</div>
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

// 5. 获取消息媒体
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
        message.success('获取成功');
      } else {
        throw new Error(msgText || '获取失败');
      }
    } catch (e: any) {
      message.error(e?.message || '获取失败');
      setMedia(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card title="获取消息媒体" style={{ marginBottom: 24 }}>
      <Form layout="inline" onFinish={onFinish}>
        <Form.Item label="消息ID" name="message_id" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>获取</Button>
      </Form>
      {media && (
        <div style={{ marginTop: 16 }}>
          {media.image_url && (
            <div>
              <div>图片ID: {media.id}</div>
              <div>图片地址: {media.image_url}</div>
              <img src={convertLocalPathToUrl(media.image_url)} alt="media" style={{ maxWidth: 300 }} />
            </div>
          )}
          {media.video_url && (
            <div>
              <div>视频ID: {media.id}</div>
              <div>视频：</div>
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
      <h1>AI 消息与媒体演示</h1>
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