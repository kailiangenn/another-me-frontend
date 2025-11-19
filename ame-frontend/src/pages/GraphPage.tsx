import { useState, useEffect } from 'react';
import { Input, Button, Select, Space, Card, Row, Col, Statistic, message } from 'antd';
import { SearchOutlined, ApartmentOutlined, BarChartOutlined } from '@ant-design/icons';
import { EChartsGraph } from '@/components/common';
import { graphAPI, type GraphStatsResponse, type GraphNode, type GraphEdge } from '@/api';
import { handleError } from '@/utils/errorHandler';
import { spacing } from '@/styles/theme';

const { Search } = Input;

export default function GraphPage() {
  const [loading, setLoading] = useState(false);
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([]);
  const [graphEdges, setGraphEdges] = useState<GraphEdge[]>([]);
  const [stats, setStats] = useState<GraphStatsResponse | null>(null);
  const [searchType, setSearchType] = useState<'work' | 'life'>('work');
  const [depth, setDepth] = useState(2);

  // 加载图谱统计信息
  useEffect(() => {
    loadStats();
    loadGraphData(); // 默认加载图谱
  }, []);

  const loadStats = async () => {
    try {
      const data = await graphAPI.getGraphStats();
      setStats(data);
    } catch (error) {
      handleError(error, '加载统计信息失败');
    }
  };

  // 加载图谱数据
  const loadGraphData = async (type?: 'work' | 'life', searchDepth?: number) => {
    setLoading(true);
    try {
      const graphType = type || searchType;
      const actualDepth = searchDepth || depth;
      
      console.log('加载图谱数据:', { graphType, actualDepth });
      
      const result = await graphAPI.getRagGraph(graphType, actualDepth);
      
      console.log('图谱数据加载成功:', result);
      
      setGraphNodes(result.nodes);
      setGraphEdges(result.edges);
      message.success(`加载成功！找到 ${result.nodes.length} 个节点，${result.edges.length} 条关系`);
    } catch (error) {
      console.error('加载图谱失败:', error);
      handleError(error, '加载图谱失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value: string) => {
    // 直接加载图谱（暂时忽略搜索内容）
    loadGraphData();
  };

  return (
    <div>
      {/* 页面标题和统计 */}
      <div style={{ marginBottom: spacing.lg }}>
        <h2>
          <ApartmentOutlined /> 知识图谱
        </h2>
        
        {stats && (
          <Row gutter={16} style={{ marginTop: spacing.md }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="总节点数"
                  value={stats.total_nodes}
                  prefix={<ApartmentOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="总关系数"
                  value={stats.total_edges}
                  prefix={<BarChartOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="节点类型"
                  value={Object.keys(stats.node_types).length}
                  suffix="种"
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="关系类型"
                  value={Object.keys(stats.edge_types).length}
                  suffix="种"
                />
              </Card>
            </Col>
          </Row>
        )}
      </div>

      {/* 搜索控件 */}
      <Card style={{ marginBottom: spacing.md }}>
        <Space.Compact style={{ width: '100%' }}>
          <Select
            value={searchType}
            onChange={setSearchType}
            style={{ width: 150 }}
            options={[
              { label: '工作图谱', value: 'work' },
              { label: '生活图谱', value: 'life' },
            ]}
          />
          
          <Select
            value={depth}
            onChange={setDepth}
            style={{ width: 120 }}
            options={[
              { label: '深度: 1', value: 1 },
              { label: '深度: 2', value: 2 },
              { label: '深度: 3', value: 3 },
            ]}
          />

          <Search
            placeholder={searchType === 'work' ? '输入工作相关关键词' : '输入生活相关关键词'}
            enterButton="搜索"
            size="middle"
            onSearch={handleSearch}
            loading={loading}
            style={{ flex: 1 }}
          />
        </Space.Compact>
        
        {/* 手动触发按钮 */}
        <Button 
          type="primary" 
          onClick={() => loadGraphData()} 
          loading={loading}
          style={{ marginTop: spacing.sm, width: '100%' }}
        >
          手动加载图谱数据
        </Button>

        <div style={{ marginTop: spacing.sm, fontSize: 12, color: '#666' }}>
          💡 提示：
          {searchType === 'work' && ' 搜索工作相关的项目、待办、建议等信息'}
          {searchType === 'life' && ' 搜索生活相关的心情、兴趣、事件等信息'}
        </div>
      </Card>

      {/* 图谱可视化 */}
      <EChartsGraph
        nodes={graphNodes}
        edges={graphEdges}
        loading={loading}
        title={`${searchType === 'work' ? '工作' : '生活'}知识图谱`}
        height={600}
      />

      {/* 节点类型分布（如果有统计数据） */}
      {stats && stats.node_types && Object.keys(stats.node_types).length > 0 && (
        <Card
          title={<span><BarChartOutlined /> 节点类型分布</span>}
          style={{ marginTop: spacing.md }}
        >
          <Row gutter={[16, 16]}>
            {Object.entries(stats.node_types).map(([type, count]) => (
              <Col key={type} span={6}>
                <Statistic title={type} value={count} />
              </Col>
            ))}
          </Row>
        </Card>
      )}
    </div>
  );
}
