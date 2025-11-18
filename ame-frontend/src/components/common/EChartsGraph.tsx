/**
 * ECharts 图谱可视化组件
 * 使用 ECharts 渲染知识图谱
 */
import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { Card, Empty, Spin } from 'antd';
import type { GraphNode, GraphEdge } from '@/api/graphAPI';

interface EChartsGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  loading?: boolean;
  title?: string;
  height?: number;
}

export default function EChartsGraph({ 
  nodes, 
  edges, 
  loading = false, 
  title = '知识图谱',
  height = 600 
}: EChartsGraphProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // 初始化 ECharts 实例
    if (!chartInstance.current) {
      chartInstance.current = echarts.init(chartRef.current);
    }

    // 窗口大小变化时自动调整
    const handleResize = () => {
      chartInstance.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);

  useEffect(() => {
    if (!chartInstance.current) return;
    if (loading) return; // 加载中不更新
    if (!nodes || nodes.length === 0) return; // 没有数据不渲染

    // 转换数据格式为 ECharts 需要的格式
    const graphData = nodes.map(node => ({
      id: node.id,
      name: node.name || node.label || node.id,
      symbolSize: 50,
      itemStyle: {
        color: getNodeColor(node.type),
      },
      label: {
        show: true,
      },
    }));

    const graphLinks = edges.map(edge => ({
      source: edge.source,
      target: edge.target,
      label: {
        show: true,
        formatter: edge.relation || edge.type || '',
      },
      lineStyle: {
        curveness: 0.3,
      },
    }));

    // 配置 ECharts 选项
    const option: echarts.EChartsOption = {
      title: {
        text: title,
        left: 'center',
        top: 20,
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          if (params.dataType === 'node') {
            return `<b>${params.name}</b>`;
          } else if (params.dataType === 'edge') {
            return `${params.data.source} → ${params.data.target}<br/>${params.data.label.formatter}`;
          }
          return '';
        },
      },
      series: [
        {
          type: 'graph',
          layout: 'force',
          data: graphData,
          links: graphLinks,
          roam: true, // 允许缩放和拖拽
          label: {
            show: true,
            position: 'bottom',
            fontSize: 12,
          },
          edgeLabel: {
            show: true,
            fontSize: 10,
            color: '#666',
          },
          force: {
            repulsion: 300,
            gravity: 0.1,
            edgeLength: 150,
            friction: 0.3,
          },
          emphasis: {
            focus: 'adjacency',
            label: {
              fontSize: 14,
              fontWeight: 'bold',
            },
            lineStyle: {
              width: 3,
            },
          },
          lineStyle: {
            color: 'source',
            curveness: 0.3,
            opacity: 0.6,
          },
        },
      ],
    };

    chartInstance.current.setOption(option);
    console.log('ECharts 图谱已渲染:', { 
      nodeCount: graphData.length, 
      edgeCount: graphLinks.length 
    });
  }, [nodes, edges, loading, title]);

  // 根据节点类型返回不同颜色
  const getNodeColor = (type?: string): string => {
    const colorMap: Record<string, string> = {
      work: '#5470c6',
      life: '#91cc75',
      mem: '#fac858',
      default: '#1890ff',
    };
    return colorMap[type || ''] || colorMap.default;
  };

  // 移除独立的空状态判断，放到渲染逻辑中

  return (
    <Card>
      <Spin spinning={loading} tip="加载图谱中...">
        <div style={{ position: 'relative', width: '100%', height: `${height}px`, minHeight: '400px' }}>
          <div 
            ref={chartRef} 
            style={{ 
              width: '100%', 
              height: '100%',
            }} 
          />
          {!loading && nodes.length === 0 && (
            <div style={{ 
              position: 'absolute', 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              width: '100%'
            }}>
              <Empty description="暂无图谱数据，请点击「手动加载图谱数据」按钮" />
            </div>
          )}
        </div>
      </Spin>
      {nodes.length > 0 && (
        <div style={{ marginTop: 16, fontSize: 12, color: '#666', textAlign: 'center' }}>
          💡 提示：可以拖拽节点、滚轮缩放、点击查看详情
        </div>
      )}
    </Card>
  );
}
