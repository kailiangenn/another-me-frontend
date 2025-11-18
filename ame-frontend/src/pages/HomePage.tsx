import { useState, useEffect } from 'react';
import { Card, Row, Col, Alert, Button, Space, Typography, Spin, Statistic } from 'antd';
import { 
  CheckCircleOutlined,
  WarningOutlined,
  RocketOutlined,
  FileTextOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/api/client';

const { Title, Paragraph } = Typography;

export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    documents: 0,
    messages: 0,
  });
  const [systemHealth, setSystemHealth] = useState<'healthy' | 'error' | 'unconfigured'>('unconfigured');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      // 调用首页总览接口（Mock 数据）
      const overviewRes = await apiClient.getHomeOverview();
      
      if (overviewRes.code === 200 && overviewRes.data) {
        const { document_num, mem_num, complete_config } = overviewRes.data;
        
        setStats({
          documents: document_num,
          messages: mem_num,
        });
        
        // 根据 complete_config 决定系统状态
        setSystemHealth(complete_config ? 'healthy' : 'unconfigured');
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
      // Mock 环境下也会成功，这里仅作容错处理
      setSystemHealth('unconfigured');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      {/* 顶部标题 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          🌟 欢迎使用 Another Me
        </Title>
        <Paragraph style={{ fontSize: '16px', color: '#666' }}>
          基于 RAG 技术和记忆模仿的 AI 数字分身系统
        </Paragraph>
      </div>

      {/* 系统状态提示 */}
      {systemHealth === 'unconfigured' && (
        <Alert
          message="系统未配置"
          description="请先前往配置页面设置 API Key 后再使用"
          type="warning"
          icon={<WarningOutlined />}
          showIcon
          action={
            <Button size="small" onClick={() => navigate('/config')}>
              去配置
            </Button>
          }
          style={{ marginBottom: 24 }}
        />
      )}

      {systemHealth === 'healthy' && (
        <Alert
          message="系统运行正常"
          type="success"
          icon={<CheckCircleOutlined />}
          showIcon
          closable
          style={{ marginBottom: 24 }}
        />
      )}

      {/* 统计卡片 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" tip="加载统计信息..." />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Card hoverable>
              <Statistic
                title="RAG 知识库"
                value={stats.documents}
                prefix={<FileTextOutlined style={{ color: '#1890ff' }} />}
                suffix="个文档"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12}>
            <Card hoverable>
              <Statistic
                title="MEM 对话"
                value={stats.messages}
                prefix={<MessageOutlined style={{ color: '#52c41a' }} />}
                suffix="条消息"
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
        </Row>
      )}

      {/* 快速开始指引 */}
      <Card style={{ marginTop: 24 }}>
        <Title level={4}>
          <RocketOutlined /> 快速开始
        </Title>
        <Paragraph style={{ fontSize: '15px', lineHeight: '2' }}>
          <strong>1. 配置系统</strong><br />
          前往 <a href="#" onClick={(e) => { e.preventDefault(); navigate('/config'); }}>配置</a> 页面，设置你的 OpenAI API Key 和相关参数
          <br /><br />
          <strong>2. 开始使用</strong><br />
          配置完成后，就可以开始使用工作模式和生活模式了
        </Paragraph>
        <Space style={{ marginTop: 16 }}>
          <Button 
            type="primary" 
            icon={<RocketOutlined />}
            onClick={() => navigate(systemHealth === 'unconfigured' ? '/config' : '/work')}
          >
            {systemHealth === 'unconfigured' ? '开始配置' : '开始使用'}
          </Button>
          <Button onClick={loadStats}>
            刷新统计
          </Button>
        </Space>
      </Card>
    </div>
  );
}
