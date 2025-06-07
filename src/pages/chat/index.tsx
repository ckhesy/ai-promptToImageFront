import React, { useState } from 'react';

import { Form, Input, Button, message } from 'antd';
import axios from 'axios';


const GenerateImageForm = () => {
    const [loading, setLoading] = useState(false);
    const [imageData, setImageData] = useState<any>(null);

    const onFinish = async (values: { prompt: string; user_id: number }) => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8000/api/v1/chat/generate', values);
            setImageData(response.data);
            message.success('Image generated successfully!');
        } catch (error) {
            message.error('Failed to generate image.');
            setImageData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Prompt"
                    name="prompt"
                    rules={[{ required: true, message: 'Please input the prompt!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="User ID"
                    name="user_id"
                    rules={[{ required: true, message: 'Please input the user ID!' }]}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Generate Image
                    </Button>
                </Form.Item>
            </Form>
            {imageData && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Generated Image:</h3>
                    <p><strong>ID:</strong> {imageData.id}</p>
                    <p><strong>Prompt:</strong> {imageData.prompt}</p>
                    <p><strong>User ID:</strong> {imageData.user_id}</p>
                    <p><strong>Created At:</strong> {new Date(imageData.created_at).toLocaleString()}</p>
                    <p><strong>Updated At:</strong> {new Date(imageData.updated_at).toLocaleString()}</p>
                    <img src={imageData.image_url} alt={imageData.prompt} style={{ maxWidth: '100%' }} />
                </div>
            )}
        </>
    );
};

const SearchPromptForm = () => {
    const [loading, setLoading] = useState(false);
    const [promptData, setPromptData] = useState<any>(null);

    const onFinish = async (values: { message_id: string }) => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/api/v1/chat/${values.message_id}`);
            setPromptData(response.data);
            message.success('Prompt fetched successfully!');
        } catch (error) {
            message.error('Failed to fetch prompt.');
            setPromptData(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                    label="Message ID"
                    name="message_id"
                    rules={[{ required: true, message: 'Please input the message ID!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>
                        Search Prompt
                    </Button>
                </Form.Item>
            </Form>
            {promptData && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Prompt Details:</h3>
                    <p><strong>ID:</strong> {promptData.id}</p>
                    <p><strong>Prompt:</strong> {promptData.prompt}</p>
                    <p><strong>User ID:</strong> {promptData.user_id}</p>
                    <p><strong>Created At:</strong> {new Date(promptData.created_at).toLocaleString()}</p>
                    <p><strong>Updated At:</strong> {new Date(promptData.updated_at).toLocaleString()}</p>
                    <img src={promptData.image_url} alt={promptData.prompt} style={{ maxWidth: '100%' }} />
                </div>
            )}
        </>
    );
};
const ChatList = () => {
    return <div>
        <h1>chat</h1>
        <GenerateImageForm />
        <hr />
        <SearchPromptForm />
    </div>
}

export default ChatList;