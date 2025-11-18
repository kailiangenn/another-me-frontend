/**
 * 工作页面 - 一次滚动切换一个模块 + 右侧导航 + 暗版卡片边框 + 模块内独立滚动
 */
import { Card, Typography, Input, Button, Divider, Space, Table, Tabs, Tag, message, List, Spin, Pagination } from 'antd';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { workAPI } from '@/api/workAPI';
import type { ProjectAnalysisHistory, Pageable } from '@/types';

const { Title, Paragraph } = Typography;

export default function WorkPage() {
  const navigate = useNavigate();
  const [activeTabKey, setActiveTabKey] = useState('new');

  // 项目拆解相关状态
  const [projectDesc, setProjectDesc] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<ProjectAnalysisHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // 工作建议相关状态
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [suggestPageable, setSuggestPageable] = useState<Pageable>({
    page: 1,
    size: 3,
    total_count: 0,
  });

  // 当前模块索引：0=待办，1=项目，2=智能建议
  const [currentIndex, setCurrentIndex] = useState(0);

  // 滚动动画锁
  const isAnimatingRef = useRef(false);
  const currentIndexRef = useRef(0);

  const todoSectionRef = useRef<HTMLDivElement | null>(null);
  const projectSectionRef = useRef<HTMLDivElement | null>(null);
  const suggestionSectionRef = useRef<HTMLDivElement | null>(null);

  const sections = [todoSectionRef, projectSectionRef, suggestionSectionRef];
  const sectionLabels = ['待办管理', '项目拆解', '智能建议'];

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
    if (key === 'history') {
      loadAnalysisHistory();
    }
  };

  // 开始分析
  const handleAnalyze = async () => {
    if (!projectDesc.trim()) {
      message.warning('请输入项目描述');
      return;
    }

    setAnalyzing(true);
    try {
      const result = await workAPI.analyzeProject({ project_desc: projectDesc });
      
      if (result.code === 200) {
        message.success('分析完成！');
        
        // 添加到历史记录
        const newRecord: ProjectAnalysisHistory = {
          id: result.fileUrl,
          title: result.fileTitle,
          fileUrl: result.fileUrl,
          createdAt: new Date().toLocaleString('zh-CN'),
        };
        setAnalysisResults([newRecord, ...analysisResults]);
        
        // 跳转到详情页
        navigate(`/work/project-analysis-detail?title=${encodeURIComponent(result.fileTitle)}&fileUrl=${result.fileUrl}`);
      } else {
        message.error('分析失败：' + result.msg);
      }
    } catch (error) {
      console.error('项目分析失败:', error);
      message.error('分析失败，请稍后重试');
    } finally {
      setAnalyzing(false);
    }
  };

  // 重置输入
  const handleReset = () => {
    setProjectDesc('');
  };

  // 加载历史记录
  const loadAnalysisHistory = async () => {
    setLoadingHistory(true);
    try {
      const result = await workAPI.getProjectHistory();
      
      if (result.code === 200 && result.data) {
        // 转换为 ProjectAnalysisHistory 格式
        const historyList: ProjectAnalysisHistory[] = result.data.map(item => ({
          id: item.id || item.fileUrl,
          title: item.title,
          fileUrl: item.fileUrl,
          createdAt: item.createdAt || new Date().toLocaleString('zh-CN'),
        }));
        setAnalysisResults(historyList);
      }
    } catch (error) {
      console.error('加载历史记录失败:', error);
      message.error('加载历史记录失败');
    } finally {
      setLoadingHistory(false);
    }
  };

  // 查看详情
  const handleViewDetail = (item: ProjectAnalysisHistory) => {
    navigate(`/work/project-analysis-detail?title=${encodeURIComponent(item.title)}&fileUrl=${item.fileUrl}`);
  };

  // 加载工作建议
  const loadWorkSuggestions = async (page: number = 1) => {
    setLoadingSuggestions(true);
    try {
      const result = await workAPI.getWorkSuggestions({ page, size: 3 });
      
      if (result.code === 200) {
        setSuggestions(result.data);
        setSuggestPageable(result.pageable);
      }
    } catch (error) {
      console.error('加载工作建议失败:', error);
      message.error('加载工作建议失败');
    } finally {
      setLoadingSuggestions(false);
    }
  };

  // 分页变化
  const handleSuggestPageChange = (page: number) => {
    loadWorkSuggestions(page);
  };

  // 组件加载时加载建议
  useEffect(() => {
    loadWorkSuggestions();
  }, []);

  const scrollToIndex = (index: number) => {
    const target = sections[index]?.current;
    if (!target) return;

    isAnimatingRef.current = true;
    currentIndexRef.current = index;
    setCurrentIndex(index);

    const top = target.offsetTop;

    window.scrollTo({
      top,
      behavior: 'smooth',
    });

    setTimeout(() => {
      isAnimatingRef.current = false;
    }, 600);
  };

  // 找到最近的可滚动父元素（overflowY 为 auto/scroll 且内容超出）
  const findScrollableParent = (el: HTMLElement | null): HTMLElement | null => {
    let node: HTMLElement | null = el;
    while (node && node !== document.body) {
      const style = window.getComputedStyle(node);
      const overflowY = style.overflowY;
      const canScrollY =
        (overflowY === 'auto' || overflowY === 'scroll') &&
        node.scrollHeight > node.clientHeight;

      if (canScrollY) return node;
      node = node.parentElement;
    }
    return null;
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const deltaY = e.deltaY;
      const cur = currentIndexRef.current;

      const target = e.target as HTMLElement | null;
      const scrollableParent = findScrollableParent(target);

      // 如果在某个内部可滚容器里，而且该容器在当前滚动方向上还没到边界，就让它自己滚
      if (scrollableParent) {
        const { scrollTop, scrollHeight, clientHeight } = scrollableParent;
        const atTop = scrollTop <= 0;
        const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

        if ((deltaY < 0 && !atTop) || (deltaY > 0 && !atBottom)) {
          // 内部还可以继续滚动 -> 不打断，不切模块
          return;
        }
        // 否则已经到顶部/底部，滚一格就切模块（下面逻辑处理）
      }

      // 第一屏向上滚：放行默认行为
      if (cur === 0 && deltaY < 0) {
        return;
      }
      // 最后一屏向下滚：放行默认行为
      if (cur === sections.length - 1 && deltaY > 0) {
        return;
      }

      // 其他情况接管，实现一滚一屏
      e.preventDefault();

      if (isAnimatingRef.current) return;

      if (deltaY > 0 && cur < sections.length - 1) {
        scrollToIndex(cur + 1);
      } else if (deltaY < 0 && cur > 0) {
        scrollToIndex(cur - 1);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [sections.length]);

  // 初始进入时滚到第一个模块顶部
  useEffect(() => {
    const first = sections[0]?.current;
    if (first) {
      window.scrollTo({ top: first.offsetTop, behavior: 'auto' });
    }
  }, []);

  // 暗版卡片边框 + 阴影复用样式
  const darkCardFrame: React.CSSProperties = {
    borderRadius: 16,
    boxShadow: '0 18px 45px rgba(15, 23, 42, 0.15)',
    border: '1px solid rgba(148, 163, 184, 0.45)',
  };

  // 卡片内部内容区域：固定高度 + 独立滚动条
  const cardInnerScroll: React.CSSProperties = {
    maxHeight: 'calc(100vh - 220px)', // 留出标题、外边距等空间，自己可以调
    overflowY: 'auto',
    paddingRight: 4, // 给滚动条一点空间
  };

  return (
    <div>
      {/* 右侧悬浮导航（只有名称） */}
      <div
        style={{
          position: 'fixed',
          right: 24,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1000,
          padding: '10px 8px',
          borderRadius: 999,
          background: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          border: '1px solid #f0f0f0',
        }}
      >
        {sectionLabels.map((label, index) => {
          const active = index === currentIndex;
          return (
            <div
              key={label}
              onClick={() => scrollToIndex(index)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 10px',
                borderRadius: 999,
                background: active ? 'rgba(22, 119, 255, 0.08)' : 'transparent',
                transition: 'background 0.2s, opacity 0.2s',
                opacity: active ? 1 : 0.6,
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.opacity = '1';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.opacity = active ? '1' : '0.6';
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  border: '2px solid #1677ff',
                  backgroundColor: active ? '#1677ff' : '#fff',
                }}
              />
              <span
                style={{
                  fontSize: 13,
                  color: active ? '#1677ff' : '#666',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* 第一屏：标题 + 待办管理 */}
      <section
        ref={todoSectionRef}
        style={{
          height: '100vh',
          boxSizing: 'border-box',
          padding: '32px 24px 24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fafafa',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <Title level={1} style={{ margin: 0 }}>
              工作模式
            </Title>
            <Tag color="processing" style={{ borderRadius: 999 }}>
              Focus Mode
            </Tag>
          </div>

          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                <span style={{ fontSize: '20px' }}>🔄</span>
                <span>待办管理</span>
                <Tag color="blue" style={{ borderRadius: 999 }}>
                  Today
                </Tag>
              </div>
            }
            style={{
              ...darkCardFrame,
              padding: '24px',
            }}
            bodyStyle={{ paddingTop: 16 }}
          >
            <div style={cardInnerScroll}>
              <Paragraph strong>工作任务跟踪与管理</Paragraph>
              <Paragraph type="secondary">
                在此部分您可以查看和管理当前的工作任务。
              </Paragraph>

              <Space direction="vertical" style={{ width: '100%', margin: '16px 0' }} size={16}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Input
                    placeholder="输入新任务，例如：整理接口文档 / 准备周会汇报..."
                    style={{ flex: 1 }}
                  />
                  <Button type="primary">添加任务</Button>
                </div>

                <Table
                  columns={[
                    { title: '任务名称', dataIndex: 'name', key: 'name' },
                    { title: '优先级', dataIndex: 'priority', key: 'priority' },
                    { title: '状态', dataIndex: 'status', key: 'status' },
                    {
                      title: '操作',
                      key: 'action',
                      render: () => (
                        <Space size={8}>
                          <Button size="small" type="link">
                            编辑
                          </Button>
                          <Button size="small" type="link">
                            完成
                          </Button>
                        </Space>
                      ),
                    },
                  ]}
                  dataSource={[
                    { key: '1', name: '完成项目规划', priority: '高', status: '进行中' },
                    { key: '2', name: '准备会议材料', priority: '中', status: '待处理' },
                    { key: '3', name: '更新文档', priority: '低', status: '已完成' },
                    // 这里你后面可以塞很多行，滚动条会出现
                  ]}
                  pagination={false}
                  size="small"
                />
              </Space>
            </div>
          </Card>
        </div>
      </section>

      {/* 第二屏：项目拆解 */}
      <section
        ref={projectSectionRef}
        style={{
          height: '100vh',
          boxSizing: 'border-box',
          padding: '32px 24px 24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#ffffff',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                <span style={{ fontSize: '20px' }}>📊</span>
                <span>项目拆解</span>
                <Tag color="geekblue" style={{ borderRadius: 999 }}>
                  Analysis
                </Tag>
              </div>
            }
            style={{
              ...darkCardFrame,
              padding: '24px',
            }}
            bodyStyle={{ paddingTop: 16 }}
          >
            <div style={cardInnerScroll}>
              <Tabs
                activeKey={activeTabKey}
                onChange={handleTabChange}
                items={[
                  {
                    key: 'new',
                    label: '新增',
                    children: (
                      <div style={{ padding: '16px 0' }}>
                        <Paragraph strong>项目描述输入</Paragraph>
                        <Paragraph type="secondary">
                          请输入项目的详细描述，AI 将为您进行项目拆解分析。
                        </Paragraph>

                        <Space
                          direction="vertical"
                          style={{ width: '100%', margin: '16px 0' }}
                          size={16}
                        >
                          <Input.TextArea
                            value={projectDesc}
                            onChange={(e) => setProjectDesc(e.target.value)}
                            placeholder="请输入需要分析的项目描述，例如：&#10;项目名称：智能客服系统&#10;项目目标：构建一个基于 AI 的客服系统&#10;技术栈：前端 React、后端 Python、数据库 PostgreSQL&#10;主要功能：智能对话、工单管理、数据统计..."
                            rows={6}
                            disabled={analyzing}
                          />
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <Button onClick={handleReset} disabled={analyzing}>重置</Button>
                            <Button 
                              type="primary" 
                              onClick={handleAnalyze}
                              loading={analyzing}
                            >
                              {analyzing ? '分析中...' : '开始分析'}
                            </Button>
                          </div>
                        </Space>

                        <Divider orientation="left">分析结果预览</Divider>
                        {analyzing ? (
                          <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <Spin size="large" tip="AI 正在分析项目，请稍候..." />
                          </div>
                        ) : (
                          <div
                            style={{
                              backgroundColor: '#fafafa',
                              padding: '12px',
                              borderRadius: '8px',
                              minHeight: '80px',
                              border: '1px dashed #d9d9d9',
                            }}
                          >
                            <Paragraph type="secondary" style={{ margin: 0 }}>
                              输入项目描述并点击“开始分析”，分析结果将以 Markdown 文档形式展示
                            </Paragraph>
                          </div>
                        )}
                      </div>
                    ),
                  },
                  {
                    key: 'history',
                    label: '历史拆解',
                    children: (
                      <div style={{ padding: '16px 0' }}>
                        <Divider orientation="left">最近分析记录</Divider>
                        {loadingHistory ? (
                          <div style={{ textAlign: 'center', padding: '40px 0' }}>
                            <Spin tip="加载中..." />
                          </div>
                        ) : analysisResults.length > 0 ? (
                          <List
                            dataSource={analysisResults}
                            renderItem={(item) => (
                              <List.Item
                                actions={[
                                  <Button 
                                    type="link" 
                                    onClick={() => handleViewDetail(item)}
                                  >
                                    查看详情
                                  </Button>
                                ]}
                              >
                                <List.Item.Meta
                                  title={item.title}
                                  description={`创建时间：${item.createdAt}`}
                                />
                              </List.Item>
                            )}
                          />
                        ) : (
                          <div
                            style={{
                              backgroundColor: '#fafafa',
                              padding: '40px 12px',
                              borderRadius: '8px',
                              border: '1px dashed #d9d9d9',
                              textAlign: 'center',
                            }}
                          >
                            <Paragraph type="secondary" style={{ margin: 0 }}>
                              暂无历史分析记录，请先进行项目分析
                            </Paragraph>
                          </div>
                        )}
                      </div>
                    ),
                  },
                ]}
                tabBarStyle={{ marginBottom: 0 }}
              />
            </div>
          </Card>
        </div>
      </section>

      {/* 第三屏：智能建议 */}
      <section
        ref={suggestionSectionRef}
        style={{
          height: '100vh',
          boxSizing: 'border-box',
          padding: '32px 24px 24px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fafafa',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          <Card
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                <span style={{ fontSize: '20px' }}>🚀</span>
                <span>智能建议</span>
                <Tag color="green" style={{ borderRadius: 999 }}>
                  AI Tips
                </Tag>
              </div>
            }
            style={{
              ...darkCardFrame,
              padding: '24px',
            }}
            bodyStyle={{ paddingTop: 16 }}
          >
            <div style={cardInnerScroll}>
              <div style={{ padding: '16px 0' }}>
                <Paragraph strong>基于工作内容的智能建议</Paragraph>
                <Paragraph type="secondary">
                  系统根据您的工作模式和内容提供相关建议。
                </Paragraph>

                <div style={{ marginTop: '16px' }}>
                  <Card type="inner" title="今日工作建议" style={{ borderRadius: 10 }}>
                    {loadingSuggestions ? (
                      <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <Spin tip="加载中..." />
                      </div>
                    ) : suggestions.length > 0 ? (
                      <>
                        <ul style={{ margin: 0, paddingLeft: '20px' }}>
                          {suggestions.map((suggestion, index) => (
                            <li key={index} style={{ marginBottom: '12px', lineHeight: '1.6' }}>
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                        
                        {suggestPageable.total_count > suggestPageable.size && (
                          <div style={{ marginTop: '16px', textAlign: 'center' }}>
                            <Pagination
                              current={suggestPageable.page}
                              pageSize={suggestPageable.size}
                              total={suggestPageable.total_count}
                              onChange={handleSuggestPageChange}
                              showSizeChanger={false}
                              showTotal={(total) => `共 ${total} 条建议`}
                            />
                          </div>
                        )}
                      </>
                    ) : (
                      <Paragraph type="secondary" style={{ margin: 0 }}>
                        暂无建议
                      </Paragraph>
                    )}
                  </Card>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
