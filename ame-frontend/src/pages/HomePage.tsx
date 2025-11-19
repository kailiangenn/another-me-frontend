import { useState, useEffect } from 'react';
import { Card, Row, Col, Alert, Button, Space, Typography, Spin } from 'antd';
import { 
  CheckCircleOutlined,
  WarningOutlined,
  RocketOutlined,
  CoffeeOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/api/client';

const { Title, Paragraph } = Typography;

export default function HomePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
        const { complete_config } = overviewRes.data;
        
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

      {/* 快速入口卡片 */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" tip="加载中..." />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {/* 开始工作 */}
          <Col xs={24} sm={12}>
            <Card 
              hoverable
              style={{ 
                textAlign: 'center',
                height: '280px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/work')}
            >
              <div style={{ color: '#fff' }}>
                <RocketOutlined style={{ fontSize: 80, marginBottom: 24 }} />
                <Title level={2} style={{ color: '#fff', marginBottom: 16 }}>开始工作</Title>
                <Paragraph style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.9)' }}>
                  项目拆解 · 待办管理 · 智能建议
                </Paragraph>
              </div>
            </Card>
          </Col>

          {/* 休息一下 */}
          <Col xs={24} sm={12}>
            <Card 
              hoverable
              style={{ 
                textAlign: 'center',
                height: '280px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                border: 'none',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/life')}
            >
              <div style={{ color: '#fff' }}>
                <CoffeeOutlined style={{ fontSize: 80, marginBottom: 24 }} />
                <Title level={2} style={{ color: '#fff', marginBottom: 16 }}>休息一下</Title>
                <Paragraph style={{ fontSize: 16, color: 'rgba(255, 255, 255, 0.9)' }}>
                  心情记录 · 兴趣追踪 · 生活建议
                </Paragraph>
              </div>
            </Card>
          </Col>
        </Row>
      )}

      {/* 快速开始指引 */}
      <Card style={{ marginTop: 24 }}>
        <Title level={4}>
          💡 使用提示
        </Title>
        <Paragraph style={{ fontSize: '15px', lineHeight: '2' }}>
          <strong>1. 配置系统</strong><br />
          前往 <a href="#" onClick={(e) => { e.preventDefault(); navigate('/config'); }}>配置</a> 页面，设置你的 OpenAI API Key 和相关参数
          <br /><br />
          <strong>2. 选择模式</strong><br />
          • <strong>开始工作</strong>：进入工作模式，管理项目和待办事项<br />
          • <strong>休息一下</strong>：进入生活模式，记录心情和追踪兴趣
        </Paragraph>
        <Space style={{ marginTop: 16 }}>
          <Button 
            type="primary" 
            icon={<RocketOutlined />}
            onClick={() => navigate(systemHealth === 'unconfigured' ? '/config' : '/work')}
          >
            {systemHealth === 'unconfigured' ? '开始配置' : '进入工作模式'}
          </Button>
          <Button 
            icon={<CoffeeOutlined />}
            onClick={() => navigate('/life')}
          >
            进入生活模式
          </Button>
        </Space>
      </Card>
    </div>
  );
}
