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

const ImageToVideoPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [videoResult, setVideoResult] = useState<VideoResponse | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // 处理图片上传
  const handleUpload: UploadProps['onChange'] = (info) => {
    setFileList(info.fileList);
    
    if (info.file.status === 'done') {
      // 模拟上传成功，获取图片URL
      const imageUrl = URL.createObjectURL(info.file.originFileObj as Blob);
      setUploadedImage(imageUrl);
      message.success(`${info.file.name} 上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  };

  // 提交表单
  const onFinish = async (values: any) => {
    if (!uploadedImage) {
      message.error('请先上传图片');
      // return;
    }

    setLoading(true);
    try {
      // Mock API 调用
      const mockResponse: VideoResponse = {
        id: `video_${Date.now()}`,
        video_url: 'https://encrypted-vtbn0.gstatic.com/video?q=tbn:ANd9GcT5qERflVRX9_9-Vh41PdJgXu2vs60n2gToOw',
        // cover_url: uploadedImage,
        cover_url: 'https://dimg04.tripcdn.com/images/0a16l12000me97q2m0C6C.png',
        prompt: values.prompt,
        status: 'success',
        created_at: new Date().toISOString()
      };

      // 模拟网络延迟
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 2000);
      });
      
      setVideoResult(mockResponse);
      message.success('视频生成成功！');
    } catch (error) {
      message.error('视频生成失败，请重试');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 重置表单
  const handleReset = () => {
    form.resetFields();
    setUploadedImage('');
    setVideoResult(null);
    setFileList([]);
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
        图片转视频生成器
      </Title>

      <Row gutter={24}>
        {/* 左侧：输入区域 */}
        <Col xs={24} lg={12}>
          <Card title="输入信息" style={{ marginBottom: 24 }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              disabled={loading}
            >
              {/* 图片上传 */}
              <Form.Item
                label="上传图片"
                name="image"
                rules={[{ required: true, message: '请上传图片' }]}
              >
                <Upload
                  listType="picture-card"
                  fileList={fileList}
                  onChange={handleUpload}
                  beforeUpload={() => false} // 阻止自动上传
                  accept="image/*"
                  maxCount={1}
                >
                  {fileList.length < 1 && (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>上传图片</div>
                    </div>
                  )}
                </Upload>
              </Form.Item>

              {/* Prompt输入 */}
              <Form.Item
                label="描述提示词"
                name="prompt"
                rules={[
                  { required: true, message: '请输入描述提示词' },
                  { min: 10, message: '提示词至少10个字符' }
                ]}
              >
                <TextArea
                  rows={4}
                  placeholder="请详细描述您希望生成的视频内容，例如：将这张风景照片转换为一个动态的视频，包含云朵飘动、树叶摇曳等自然元素..."
                  showCount
                  maxLength={500}
                />
              </Form.Item>

              {/* 操作按钮 */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  icon={<PlayCircleOutlined />}
                  size="large"
                  style={{ marginRight: 16 }}
                >
                  生成视频
                </Button>
                <Button
                  onClick={handleReset}
                  size="large"
                >
                  重置
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* 右侧：预览和结果区域 */}
        <Col xs={24} lg={12}>
          {/* 上传的图片预览 */}
          {uploadedImage && (
            <Card title="上传的图片" style={{ marginBottom: 24 }}>
              <Image
                src={uploadedImage}
                alt="上传的图片"
                style={{ width: '100%', maxHeight: 300, objectFit: 'contain' }}
              />
            </Card>
          )}

          {/* 生成结果 */}
          {loading && (
            <Card title="生成中..." style={{ marginBottom: 24 }}>
              <div style={{ textAlign: 'center', padding: 40 }}>
                <Spin size="large" />
                <div style={{ marginTop: 16 }}>
                  <Text>正在生成视频，请稍候...</Text>
                </div>
              </div>
            </Card>
          )}

          {videoResult && (
            <Card title="生成结果" style={{ marginBottom: 24 }}>
              <div>
                {/* 视频封面 */}
                <div style={{ marginBottom: 16 }}>
                  <Text strong>视频封面：</Text>
                  <div style={{ marginTop: 8 }}>
                    <Image
                      src={videoResult.cover_url}
                      alt="视频封面"
                      style={{ width: '100%', maxHeight: 200, objectFit: 'contain' }}
                    />
                  </div>
                </div>

                <Divider />

                {/* 生成的视频 */}
                <div style={{ marginBottom: 16 }}>
                  <Text strong>生成的视频：</Text>
                  <div style={{ marginTop: 8 }}>
                    <video
                      controls
                      style={{ width: '100%', maxHeight: 300 }}
                      poster={videoResult.cover_url}
                    >
                      <source src={videoResult.video_url} type="video/mp4" />
                      您的浏览器不支持视频播放。
                    </video>
                  </div>
                </div>

                <Divider />

                {/* 详细信息 */}
                <div>
                  <Text strong>生成信息：</Text>
                  <div style={{ marginTop: 8 }}>
                    <div><Text>ID: {videoResult.id}</Text></div>
                    <div><Text>提示词: {videoResult.prompt}</Text></div>
                    <div><Text>状态: {videoResult.status}</Text></div>
                    <div><Text>创建时间: {new Date(videoResult.created_at).toLocaleString()}</Text></div>
                  </div>
                </div>

                {/* 下载按钮 */}
                <div style={{ marginTop: 16 }}>
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    onClick={() => window.open(videoResult.video_url, '_blank')}
                  >
                    下载视频
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
