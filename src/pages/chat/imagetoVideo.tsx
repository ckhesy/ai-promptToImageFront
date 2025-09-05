import React, { useState } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  message, 
  Upload, 
  Image, 
  Spin,
  Row,
  Col,
  Typography,
  Divider
} from 'antd';
import { 
  UploadOutlined, 
  PlayCircleOutlined
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import axios from 'axios';

const { TextArea } = Input;
const { Title, Text } = Typography;

interface VideoResponse {
  id: string;
  video_url: string;
  cover_url: string;
  prompt: string;
  status: 'success' | 'processing' | 'failed';
  created_at: string;
}

interface UploadResponse {
  image_url: string;
  width: number;
  height: number;
  format: string;
}

const ImageToVideoPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [imageInfo, setImageInfo] = useState<UploadResponse | null>(null);
  const [videoResult, setVideoResult] = useState<VideoResponse | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // Handle image upload
  const handleUpload: UploadProps['onChange'] = async (info) => {
    setFileList(info.fileList);
    
    if (info.file.status === 'uploading') {
      setUploading(true);
      return;
    }
    
    if (info.file.status === 'done') {
      setUploading(false);
      const response = info.file.response;
      if (response && response.code === 0) {
        const { image_url, width, height, format } = response.data;
        setImageInfo({ image_url, width, height, format });
        setUploadedImage(`http://localhost:8000${image_url}`);
        message.success(`${info.file.name} uploaded successfully`);
      } else {
        message.error(response?.message || 'Upload failed');
      }
    } else if (info.file.status === 'error') {
      setUploading(false);
      message.error(`${info.file.name} upload failed`);
    }
  };

  // Custom upload function
  const customUpload = async (options: any) => {
    const { file, onSuccess, onError } = options;
    
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await axios.post('http://localhost:8000/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.code === 0) {
        onSuccess(response.data);
      } else {
        onError(new Error(response.data.message || 'Upload failed'));
      }
    } catch (error: any) {
      onError(error);
    }
  };

  // Submit form
  const onFinish = async (values: any) => {
    if (!uploadedImage) {
      message.error('Please upload an image first');
      // return;
    }
    //获取刚刚上传的图片url
    // const image_url = uploadedImage
    console.log(uploadedImage);
    setLoading(true);
    // 在这里调用生成视频的api
    const res = await axios.post('http://localhost:8000/api/v1/messages/generate', {
      image_url: uploadedImage,
      prompt: values.prompt,
      media_type: "image2video",
      user_id: "1",
      // mock: true
    });
    console.log(res);
    const response = res.data?.data || null;
    try {
      // Mock API call
      const mockResponse: VideoResponse = response || {
        id: `video_${Date.now()}`,
        video_url: 'https://encrypted-vtbn0.gstatic.com/video?q=tbn:ANd9GcT5qERflVRX9_9-Vh41PdJgXu2vs60n2gToOw',
        // cover_url: uploadedImage,
        cover_url: 'https://dimg04.tripcdn.com/images/0a16l12000me97q2m0C6C.png',
        prompt: values.prompt,
        status: 'success',
        created_at: new Date().toISOString()
      };

      // Simulate network delay
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 2000);
      });
      
      setVideoResult(mockResponse);
      message.success('Video generated successfully!');
    } catch (error) {
      message.error('Video generation failed, please try again');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    form.resetFields();
    setUploadedImage('');
    setImageInfo(null);
    setVideoResult(null);
    setFileList([]);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
        Image to Video Generator
      </Title>

      <Row gutter={24}>
        {/* Left: Input area */}
        <Col xs={24} lg={12}>
          <Card title="Input Information" style={{ marginBottom: 24 }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              disabled={loading}
            >
              {/* Image upload */}
              <Form.Item
                label="Upload Image"
                name="image"
                rules={[{ required: true, message: 'Please upload an image' }]}
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleUpload}
                  customRequest={customUpload}
                  accept="image/*"
                  maxCount={1}
                  showUploadList={{
                    showPreviewIcon: true,
                    showRemoveIcon: true,
                  }}
                >
                  {fileList.length < 1 && (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>Upload Image</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              {/* Prompt input */}
              <Form.Item
                label="Description Prompt"
                name="prompt"
                rules={[
                  { required: true, message: 'Please enter a description prompt' },
                  { min: 10, message: 'Prompt must be at least 10 characters' }
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="Please describe in detail the video content you want to generate, for example: Convert this landscape photo into a dynamic video with floating clouds, swaying leaves and other natural elements..."
                  showCount
                  maxLength={500}
                />
              </Form.Item>

              {/* Action buttons */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading || uploading}
                  icon={<PlayCircleOutlined />}
                  size="large"
                  style={{ marginRight: 16 }}
                  disabled={!uploadedImage}
                >
                  Generate Video
                </Button>
                <Button
                  onClick={handleReset}
                  size="large"
                >
                  Reset
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Right: Preview and result area */}
        <Col xs={24} lg={12}>
          {/* Uploaded image preview */}
          {uploadedImage && imageInfo && (
            <Card title="Uploaded Image" style={{ marginBottom: 24 }}>
              <Image
                src={uploadedImage}
                alt="Uploaded image"
                style={{ width: '100%', maxHeight: 300, objectFit: 'contain' }}
              />
              <div style={{ marginTop: 16 }}>
                <Text strong>Image Information:</Text>
                <div style={{ marginTop: 8 }}>
                  <div><Text>Dimensions: {imageInfo.width} x {imageInfo.height}</Text></div>
                  <div><Text>Format: {imageInfo.format}</Text></div>
                  <div><Text>URL: {imageInfo.image_url}</Text></div>
                </div>
              </div>
            </Card>
          )}

          {/* Generation result */}
          {loading && (
            <Card title="Generating..." style={{ marginBottom: 24 }}>
              <div style={{ textAlign: 'center', padding: 40 }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>
                  <Text>Generating video, please wait...</Text>
                </div>
              </div>
            </Card>
          )}

          {videoResult && (
            <Card title="Generation Result" style={{ marginBottom: 24 }}>
              <div>
                {/* Video cover */}
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Video Cover:</Text>
                  <div style={{ marginTop: 8 }}>
                    <Image
                      src={videoResult.cover_url}
                      alt="Video cover"
                      style={{ width: '100%', maxHeight: 200, objectFit: 'contain' }}
                    />
                  </div>
                </div>

                <Divider />

                {/* Generated video */}
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Generated Video:</Text>
                  <div style={{ marginTop: 8 }}>
                    <video
                      controls
                      style={{ width: '100%', maxHeight: 300 }}
                      poster={videoResult.cover_url}
                    >
                      <source src={videoResult.video_url} type="video/mp4" />
                      Your browser does not support video playback.
                    </video>
                  </div>
                </div>

                <Divider />

                {/* Detailed information */}
                <div>
                  <Text strong>Generation Info:</Text>
                  <div style={{ marginTop: 8 }}>
                    <div><Text>ID: {videoResult.id}</Text></div>
                    <div><Text>Prompt: {videoResult.prompt}</Text></div>
                    <div><Text>Status: {videoResult.status}</Text></div>
                    <div><Text>Created at: {new Date(videoResult.created_at).toLocaleString()}</Text></div>
                  </div>
                </div>

                {/* Download button */}
                <div style={{ marginTop: 16 }}>
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={() => window.open(videoResult.video_url, '_blank')}
                  >
                    Download Video
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default ImageToVideoPage;
