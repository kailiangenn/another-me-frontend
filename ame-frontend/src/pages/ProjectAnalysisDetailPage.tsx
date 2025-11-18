/**
 * 项目拆解详情页面
 * 显示 Markdown 格式的分析结果
 */
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, Button, Spin, message, Typography } from 'antd';
import { ArrowLeftOutlined, DownloadOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

const { Title } = Typography;

export default function ProjectAnalysisDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [markdownContent, setMarkdownContent] = useState('');
  const [fileTitle, setFileTitle] = useState('');

  useEffect(() => {
    loadAnalysisDetail();
  }, []);

  const loadAnalysisDetail = async () => {
    setLoading(true);
    try {
      const title = searchParams.get('title') || '项目拆解分析';
      const fileUrl = searchParams.get('fileUrl') || '';

      setFileTitle(title);

      // TODO: 待后端就绪后，通过 fileUrl 获取真实的 Markdown 内容
      // const response = await fetch(`/api/v1/work/project/file/${fileUrl}`);
      // const content = await response.text();
      // setMarkdownContent(content);

      // Mock Markdown 内容
      setTimeout(() => {
        setMarkdownContent(getMockMarkdownContent(title));
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('加载分析详情失败:', error);
      message.error('加载分析详情失败');
      setLoading(false);
    }
  };

  // Mock Markdown 内容生成
  const getMockMarkdownContent = (title: string): string => {
    return `# ${title}

## 项目概述

这是一个基于现代前端技术栈的项目拆解分析报告。本报告将从多个维度对项目进行详细分析。

## 技术架构

### 前端技术栈
- **React 18**: 最新的 React 版本，支持并发特性
- **TypeScript**: 提供类型安全
- **Vite**: 快速的构建工具
- **Ant Design**: UI 组件库

### 后端技术栈
- **FastAPI**: 高性能的 Python Web 框架
- **PostgreSQL**: 关系型数据库
- **Redis**: 缓存和消息队列

## 功能模块拆解

### 1. 用户认证模块
- [ ] 用户注册
- [ ] 用户登录
- [ ] JWT Token 认证
- [ ] 权限管理

### 2. 数据管理模块
- [ ] 数据 CRUD 操作
- [ ] 数据导入导出
- [ ] 数据统计分析
- [ ] 数据可视化

### 3. 系统配置模块
- [ ] 系统参数配置
- [ ] 用户偏好设置
- [ ] 主题切换

## 开发计划

### 阶段一：基础架构搭建（第 1-2 周）
1. 项目初始化
2. 技术选型确认
3. 开发环境配置
4. CI/CD 流程搭建

### 阶段二：核心功能开发（第 3-6 周）
1. 用户认证模块开发
2. 核心业务逻辑实现
3. API 接口开发
4. 前端页面开发

### 阶段三：测试与优化（第 7-8 周）
1. 单元测试
2. 集成测试
3. 性能优化
4. 安全加固

## 技术难点

### 1. 性能优化
- 前端打包优化
- 接口响应速度优化
- 数据库查询优化

### 2. 安全性
- XSS 防护
- CSRF 防护
- SQL 注入防护

### 3. 可维护性
- 代码规范统一
- 文档完善
- 日志系统

## 风险评估

| 风险项 | 影响程度 | 应对措施 |
|--------|---------|---------|
| 技术难度高 | 高 | 提前技术调研，寻求专家支持 |
| 需求变更频繁 | 中 | 采用敏捷开发，快速迭代 |
| 人员流动 | 中 | 知识文档化，代码规范化 |
| 第三方依赖 | 低 | 选择成熟稳定的库 |

## 总结

本项目采用现代化的技术栈，具有良好的扩展性和可维护性。通过合理的模块拆解和开发计划，可以确保项目按时高质量交付。

---

**生成时间**: ${new Date().toLocaleString('zh-CN')}
**分析引擎**: Another Me AI Assistant
`;
  };

  const handleDownload = () => {
    const blob = new Blob([markdownContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileTitle}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message.success('下载成功');
  };

  return (
    <div style={{ minHeight: '100vh', padding: '24px', backgroundColor: '#f5f5f5' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 顶部操作栏 */}
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/work')}
          >
            返回工作模式
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            disabled={loading}
          >
            下载 Markdown
          </Button>
        </div>

        {/* 内容卡片 */}
        <Card>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <Spin size="large" tip="加载分析详情中..." />
            </div>
          ) : (
            <div>
              <Title level={2} style={{ marginBottom: 24 }}>
                {fileTitle}
              </Title>
              <div
                style={{
                  lineHeight: '1.8',
                  fontSize: '15px',
                }}
                className="markdown-content"
              >
                <ReactMarkdown>{markdownContent}</ReactMarkdown>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Markdown 样式 */}
      <style>{`
        .markdown-content h1 {
          font-size: 28px;
          font-weight: bold;
          margin-top: 24px;
          margin-bottom: 16px;
          border-bottom: 2px solid #e8e8e8;
          padding-bottom: 8px;
        }
        .markdown-content h2 {
          font-size: 24px;
          font-weight: bold;
          margin-top: 24px;
          margin-bottom: 12px;
          color: #1890ff;
        }
        .markdown-content h3 {
          font-size: 20px;
          font-weight: bold;
          margin-top: 20px;
          margin-bottom: 12px;
        }
        .markdown-content p {
          margin-bottom: 12px;
        }
        .markdown-content ul, .markdown-content ol {
          margin-left: 24px;
          margin-bottom: 12px;
        }
        .markdown-content li {
          margin-bottom: 6px;
        }
        .markdown-content code {
          background-color: #f5f5f5;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
        }
        .markdown-content pre {
          background-color: #f5f5f5;
          padding: 12px;
          border-radius: 6px;
          overflow-x: auto;
          margin-bottom: 12px;
        }
        .markdown-content table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 16px;
        }
        .markdown-content table th,
        .markdown-content table td {
          border: 1px solid #e8e8e8;
          padding: 8px 12px;
          text-align: left;
        }
        .markdown-content table th {
          background-color: #fafafa;
          font-weight: bold;
        }
        .markdown-content blockquote {
          border-left: 4px solid #1890ff;
          padding-left: 16px;
          margin: 16px 0;
          color: #666;
        }
        .markdown-content hr {
          border: none;
          border-top: 1px solid #e8e8e8;
          margin: 24px 0;
        }
      `}</style>
    </div>
  );
}
