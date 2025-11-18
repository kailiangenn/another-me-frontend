// API 类型定义

// ============ 通用类型 ============
export interface BaseResponse {
  success: boolean;
  message: string;
  data?: any;
}

// ============ 配置相关 ============
export interface APIConfig {
  api_key: string;
  base_url: string;
  model: string;
  embedding_mode: string;      // Embedding 模型（后端字段名）
  embedding_dim: string;       // Embedding 维度（后端字段名）
  embedding_model?: string;    // 兼容旧字段
  embedding_dimension?: number; // 兼容旧字段
}

/** 配置加载响应 */
export interface ConfigLoadResponse {
  code: number;
  msg: string;
  data: {
    api_key: string;
    base_url: string;
    model: string;
    embedding_mode: string;
    embedding_dim: string;
  };
}

/** 配置保存响应 */
export interface ConfigSaveResponse {
  code: number;
  msg: string;
}

/** 配置测试请求 */
export interface ConfigTestRequest {
  api_key: string;
  base_url: string;
  model: string;
  embedding_model: string;
  embedding_dimension: number;
}

/** 配置测试响应 */
export interface ConfigTestResponse {
  code: number;
  msg: string;
  data: boolean;  // true 表示配置测试成功
}

export interface ConfigTestResult {
  success: boolean;
  message: string;
  model_available?: boolean;
  embedding_available?: boolean;
  embedding_dimension?: number;
}

// ============ RAG 相关 ============
export interface DocumentInfo {
  id: string;
  filename: string;
  size: number;
  upload_time: string;
  chunk_count?: number;
}

export interface UploadResponse {
  success: boolean;
  document_id: string;
  filename: string;
  message: string;
}

export interface SearchResult {
  content: string;
  score: number;
  metadata: Record<string, any>;
}

export interface SearchResponse {
  query: string;
  results: SearchResult[];
  total: number;
}

export interface RAGStats {
  document_count: number;
  total_chunks: number;
  total_size: number;
}

// ============ MEM 相关 ============
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatResponse {
  message: string;
  timestamp: string;
}

export interface Memory {
  id: string;
  content: string;
  timestamp: string;
  emotion?: string;
  importance?: number;
  category?: string;
  tags?: string[];
  metadata: Record<string, any>;
}

export interface MemoryListResponse {
  memories: Memory[];
  total: number;
}

// ============ 健康检查 ============
export interface HealthResponse {
  status: string;
  version: string;
  timestamp: string;
}

// ============ 首页总览 ============
/** 首页总览数据 */
export interface HomeOverviewData {
  document_num: number;      // RAG 知识库文档数量
  mem_num: number;           // MEM 对话数量
  complete_config: boolean;  // 是否完成配置
}

/** 首页总览响应 */
export interface HomeOverviewResponse {
  code: number;
  msg: string;
  data: HomeOverviewData;
}

// ============ 知识库扩展类型 ============
/** 文档详情 */
export interface DocumentDetail extends DocumentInfo {
  content: string;
  doc_type: 'rag_knowledge' | 'mem_conversation' | 'mem_diary';
  source: string;
  timestamp: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  metadata: {
    file_path?: string;
    embedding_model?: string;
    vector_count?: number;
  };
}

/** 分页响应 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
  timestamp: string;
}

/** 带来源的搜索结果 */
export interface SearchResultWithSource {
  content: string;
  score: number;
  source: {
    document_id: string;
    document_name: string;
    chunk_index: number;
  };
  metadata: Record<string, any>;
}

/** 知识检索增强响应 */
export interface EnhancedSearchResponse {
  query: string;
  results: SearchResultWithSource[];
  total: number;
  search_time: number;
}
