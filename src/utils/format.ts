// 示例方法，没有实际意义
export function trim(str: string) {
  return str.trim();
}

/**
 * 将本地绝对路径转换为后端服务URL
 * @param localPath 本地绝对路径
 * @returns 后端服务URL
 */
export const convertLocalPathToUrl = (localPath: string): string => {
  if (!localPath) return '';
  
  // 提取文件名
  const fileName = localPath.split('/').pop();
  return `http://localhost:8000/media/${fileName}`;
};
