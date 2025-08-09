// 示例方法，没有实际意义
export function trim(str: string) {
  return str.trim();
}

/**
 * 将后端返回的路径/URL转换为可直接访问的URL
 * - 如果已是 http/https 绝对URL，原样返回
 * - 如果是相对路径，如 "media/..."，拼接服务端地址
 * - 如果是本地绝对路径，尽力截取 /media/ 之后的相对路径
 */
export const convertLocalPathToUrl = (path: string): string => {
  if (!path) return '';

  // 绝对 URL 直接返回
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  // 相对 media 路径
  if (path.startsWith('media/')) {
    return `http://localhost:8000/${path}`;
  }

  // 本地绝对路径，尝试从 /media/ 开始截断
  const mediaIndex = path.indexOf('/media/');
  if (mediaIndex !== -1) {
    const relative = path.slice(mediaIndex + 1); // 去掉前导 '/'
    return `http://localhost:8000/${relative}`;
  }

  // 回退：仅取文件名
  const fileName = path.split('/').pop() || path;
  return `http://localhost:8000/${fileName}`;
};
