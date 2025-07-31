export const DEFAULT_NAME = 'Umi Max';

// 图片基础URL配置
export const MEDIA_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8000' 
  : 'https://your-production-domain.com';
