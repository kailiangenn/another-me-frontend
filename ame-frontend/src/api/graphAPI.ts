/**
 * 图谱 API
 * 提供知识图谱查询和分析功能
 */
import axios from 'axios';

export interface GraphNode {
  id: string;
  name: string;      // 新增 name 字段（后端返回）
  label?: string;    // 兼容旧字段
  type?: string;
  properties?: Record<string, any>;
}

export interface GraphEdge {
  source: string;
  target: string;
  relation: string;  // 新增 relation 字段（后端返回）
  type?: string;     // 兼容旧字段
  weight?: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface EntityGraphRequest {
  entity_name: string;
  depth?: number;
}

export interface EntityGraphResponse {
  success: boolean;
  data: GraphData;
  message?: string;
}

export interface DocumentGraphRequest {
  doc_id: string;
  max_hops?: number;
}

export interface DocumentGraphResponse {
  success: boolean;
  data: GraphData;
  related_docs: Array<{
    doc_id: string;
    distance: number;
    score: number;
    shared_entities: string[];
  }>;
}

export interface GraphStatsResponse {
  total_nodes: number;
  total_edges: number;
  node_types: Record<string, number>;
  edge_types: Record<string, number>;
}

/** RAG 图谱请求参数 */
export interface RagGraphRequest {
  type: 'work' | 'life' | 'mem';  // 图谱类型
  depth: number;                   // 查询深度
}

/** RAG 图谱响应 */
export interface RagGraphResponse {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

class GraphAPI {
  private axios = axios.create({
    baseURL: '/api/v1',
    timeout: 60000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  /**
   * 获取实体关系图
   * @param entity_name 实体名称
   * @param depth 查询深度（默认 2）
   */
  async getEntityGraph(entity_name: string, depth: number = 2): Promise<EntityGraphResponse> {
    const response = await this.axios.get<EntityGraphResponse>('/graph/entity', {
      params: { entity_name, depth }
    });
    return response.data;
  }

  /**
   * 获取文档关联图
   * @param doc_id 文档 ID
   * @param max_hops 最大跳数（默认 2）
   */
  async getDocumentGraph(doc_id: string, max_hops: number = 2): Promise<DocumentGraphResponse> {
    const response = await this.axios.get<DocumentGraphResponse>('/graph/document', {
      params: { doc_id, max_hops }
    });
    return response.data;
  }

  /**
   * 获取全局知识图谱概览
   * @param limit 限制返回的节点数量（默认 100）
   */
  async getGraphOverview(limit: number = 100): Promise<EntityGraphResponse> {
    const response = await this.axios.get<EntityGraphResponse>('/graph/overview', {
      params: { limit }
    });
    return response.data;
  }

  /**
   * 获取图谱统计信息
   */
  async getGraphStats(): Promise<GraphStatsResponse> {
    const response = await this.axios.get<GraphStatsResponse>('/graph/stats');
    return response.data;
  }

  /**
   * 执行自定义 Cypher 查询
   * @param query Cypher 查询语句
   * @param parameters 查询参数
   */
  async executeCypher(query: string, parameters?: Record<string, any>): Promise<any> {
    const response = await this.axios.post('/graph/cypher', {
      query,
      parameters: parameters || {}
    });
    return response.data;
  }

  /**
   * 搜索实体
   * @param query 搜索关键词
   * @param entity_type 实体类型（可选）
   * @param limit 返回数量限制
   */
  async searchEntities(
    query: string,
    entity_type?: string,
    limit: number = 20
  ): Promise<{
    success: boolean;
    entities: GraphNode[];
  }> {
    const response = await this.axios.get('/graph/search', {
      params: { query, entity_type, limit }
    });
    return response.data;
  }

  /**
   * 获取 RAG 知识图谱
   * @param type 图谱类型 (work/life/mem)
   * @param depth 查询深度
   */
  async getRagGraph(type: 'work' | 'life' | 'mem', depth: number = 2): Promise<RagGraphResponse> {
    console.log('getRagGraph 调用:', { type, depth });
    
    // TODO: 待后端就绪后替换为真实接口
    // const response = await this.axios.get<RagGraphResponse>('/rag/graph', {
    //   params: { type, depth }
    // });
    // return response.data;

    // Mock 数据（仅供前端开发使用）
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockData = this.generateMockGraphData(type, depth);
        console.log('Mock 数据生成:', mockData);
        resolve(mockData);
      }, 800);
    });
  }

  /**
   * 生成 Mock 图谱数据
   */
  private generateMockGraphData(type: string, depth: number): RagGraphResponse {
    console.log('generateMockGraphData 调用:', { type, depth });
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    if (type === 'work') {
      // 工作模式图谱
      nodes.push(
        { id: '1', name: '项目规划' },
        { id: '2', name: '需求分析' },
        { id: '3', name: '技术设计' },
        { id: '4', name: '开发任务' },
        { id: '5', name: '测试验证' },
        { id: '6', name: '上线部署' },
        { id: '7', name: '运维监控' },
        { id: '8', name: '团队协作' },
      );
      edges.push(
        { source: '1', target: '2', relation: '包含' },
        { source: '1', target: '3', relation: '包含' },
        { source: '2', target: '4', relation: '依赖' },
        { source: '3', target: '4', relation: '依赖' },
        { source: '4', target: '5', relation: '后续' },
        { source: '5', target: '6', relation: '后续' },
        { source: '6', target: '7', relation: '后续' },
        { source: '1', target: '8', relation: '需要' },
      );
    } else if (type === 'life') {
      // 生活模式图谱
      nodes.push(
        { id: '1', name: '健康管理' },
        { id: '2', name: '运动锻炼' },
        { id: '3', name: '饮食营养' },
        { id: '4', name: '学习成长' },
        { id: '5', name: '社交休闲' },
        { id: '6', name: '兴趣爱好' },
        { id: '7', name: '家庭生活' },
      );
      edges.push(
        { source: '1', target: '2', relation: '包含' },
        { source: '1', target: '3', relation: '包含' },
        { source: '4', target: '6', relation: '促进' },
        { source: '5', target: '6', relation: '相关' },
        { source: '7', target: '5', relation: '影响' },
      );
    } else {
      // MEM 模式图谱
      nodes.push(
        { id: '1', name: '聊天记录' },
        { id: '2', name: '情感记忆' },
        { id: '3', name: '知识学习' },
        { id: '4', name: '个人喜好' },
        { id: '5', name: '行为模式' },
        { id: '6', name: '语言风格' },
      );
      edges.push(
        { source: '1', target: '2', relation: '生成' },
        { source: '1', target: '3', relation: '生成' },
        { source: '2', target: '4', relation: '反映' },
        { source: '3', target: '5', relation: '形成' },
        { source: '1', target: '6', relation: '塑造' },
      );
    }

    console.log('Mock 数据生成完成:', { nodeCount: nodes.length, edgeCount: edges.length });
    return { nodes, edges };
  }
}

export const graphAPI = new GraphAPI();
export default graphAPI;
