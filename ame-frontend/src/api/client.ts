import axios, { AxiosInstance } from 'axios';
import type {
  APIConfig,
  ConfigTestResult,
  ConfigLoadResponse,
  ConfigSaveResponse,
  ConfigTestRequest,
  ConfigTestResponse,
  BaseResponse,
  UploadResponse,
  SearchResponse,
  RAGStats,
  DocumentInfo,
  ChatResponse,
  MemoryListResponse,
  HealthResponse,
  HomeOverviewResponse,
} from '@/types';

class APIClient {
  private axios: AxiosInstance;
  private requestCache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5分钟缓存

  constructor() {
    this.axios = axios.create({
      baseURL: '/api/v1',
      timeout: 60000, // 增加超时时间
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 添加响应拦截器
    this.axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // 服务器返回错误
          const detail = error.response.data?.detail || '请求失败';
          console.error('API Error:', detail);
        } else if (error.request) {
          // 请求已发出但没有响应
          console.error('Network Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * 缓存GET请求结果
   */
  private getCached<T>(key: string): T | null {
    const cached = this.requestCache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as T;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.requestCache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // ============ 健康检查 ============
  async healthCheck(): Promise<HealthResponse> {
    const cacheKey = 'health';
    const cached = this.getCached<HealthResponse>(cacheKey);
    if (cached) return cached;

    const response = await this.axios.get<HealthResponse>('/health');
    this.setCache(cacheKey, response.data);
    return response.data;
  }

  // ============ 首页总览 ============
  /**
   * 获取首页总览数据
   * @returns 返回文档数、对话数和配置状态
   */
  async getHomeOverview(): Promise<HomeOverviewResponse> {
    // TODO: 待后端就绪后替换为真实接口
    // const response = await this.axios.get<HomeOverviewResponse>('/home');
    // return response.data;

    // Mock 数据（仅供前端开发使用）
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          msg: 'success',
          data: {
            document_num: 25,        // 模拟 RAG 知识库文档数
            mem_num: 138,            // 模拟 MEM 对话数
            complete_config: true,   // 模拟已完成配置
          },
        });
      }, 300); // 模拟网络延迟
    });
  }

  // ============ 配置管理 ============
  /**
   * 加载配置信息
   */
  async loadConfig(): Promise<APIConfig | null> {
    try {
      // TODO: 待后端就绪后替换为真实接口
      // const response = await this.axios.get<ConfigLoadResponse>('/config/load');
      // if (response.data.code === 200) {
      //   const config = response.data.data;
      //   return {
      //     ...config,
      //     embedding_model: config.embedding_mode,
      //     embedding_dimension: parseInt(config.embedding_dim)
      //   };
      // }
      // return null;

      // Mock 数据（仅供前端开发使用）
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            api_key: 'sk-mock-api-key-12345',
            base_url: 'https://api.openai.com/v1',
            model: 'gpt-3.5-turbo',
            embedding_mode: 'text-embedding-3-small',
            embedding_dim: '1536',
            embedding_model: 'text-embedding-3-small',
            embedding_dimension: 1536,
          });
        }, 300);
      });
    } catch (error) {
      console.error('Failed to load config:', error);
      return null;
    }
  }

  /**
   * 保存配置信息
   */
  async saveConfig(config: APIConfig): Promise<BaseResponse> {
    try {
      // 转换字段名以匹配后端
      const requestData = {
        api_key: config.api_key,
        base_url: config.base_url,
        model: config.model,
        embedding_mode: config.embedding_model || config.embedding_mode,
        embedding_dim: String(config.embedding_dimension || config.embedding_dim),
      };

      // TODO: 待后端就绪后替换为真实接口
      // const response = await this.axios.post<ConfigSaveResponse>('/config/save', requestData);
      // return {
      //   success: response.data.code === 200,
      //   message: response.data.msg
      // };

      // Mock 数据（仅供前端开发使用）
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('保存配置:', requestData);
          resolve({
            success: true,
            message: '配置保存成功',
          });
        }, 500);
      });
    } catch (error) {
      console.error('Failed to save config:', error);
      return {
        success: false,
        message: '配置保存失败',
      };
    }
  }

  /**
   * 测试配置
   */
  async testConfig(config: APIConfig): Promise<ConfigTestResult> {
    try {
      // 转换为测试接口所需的格式
      const requestData: ConfigTestRequest = {
        api_key: config.api_key,
        base_url: config.base_url,
        model: config.model,
        embedding_model: config.embedding_model || config.embedding_mode || '',
        embedding_dimension: config.embedding_dimension || parseInt(config.embedding_dim || '0'),
      };

      // TODO: 待后端就绪后替换为真实接口
      // const response = await this.axios.post<ConfigTestResponse>('/config/test', requestData);
      // return {
      //   success: response.data.code === 200 && response.data.data === true,
      //   message: response.data.code === 200 ? '配置测试成功！' : response.data.msg,
      //   model_available: response.data.data,
      //   embedding_available: response.data.data,
      // };

      // Mock 数据（仅供前端开发使用）
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log('测试配置:', requestData);
          // 模拟成功情况
          resolve({
            success: true,
            message: 'API 连接成功！\n• LLM 模型可用\n• Embedding 模型可用',
            model_available: true,
            embedding_available: true,
            embedding_dimension: requestData.embedding_dimension,
          });
        }, 1000); // 模拟较长的测试时间
      });
    } catch (error) {
      console.error('Failed to test config:', error);
      return {
        success: false,
        message: 'API 连接失败，请检查配置',
        model_available: false,
        embedding_available: false,
      };
    }
  }

  // ============ RAG 知识库 ============
  async uploadDocument(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.axios.post<UploadResponse>('/rag/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async searchKnowledge(query: string, top_k: number = 5): Promise<SearchResponse> {
    const response = await this.axios.post<SearchResponse>('/rag/search', {
      query,
      top_k,
    });
    return response.data;
  }

  async getDocuments(): Promise<DocumentInfo[]> {
    const response = await this.axios.get<DocumentInfo[]>('/rag/documents');
    return response.data;
  }

  async deleteDocument(docId: string): Promise<BaseResponse> {
    const response = await this.axios.delete<BaseResponse>(`/rag/documents/${docId}`);
    return response.data;
  }

  async getRAGStats(): Promise<RAGStats> {
    const response = await this.axios.get<RAGStats>('/rag/stats');
    return response.data;
  }

  // ============ MEM 对话 ============
  async chatSync(message: string): Promise<ChatResponse> {
    const response = await this.axios.post<ChatResponse>('/mem/chat-sync', {
      message,
    });
    return response.data;
  }

  /**
   * 流式对话 - 使用 EventSource 实现 SSE
   * @param message - 用户消息
   * @param onMessage - 消息回调
   * @param onError - 错误回调
   * @param onComplete - 完成回调
   */
  async chatStream(
    message: string,
    onMessage: (chunk: string) => void,
    onError?: (error: Error) => void,
    onComplete?: () => void
  ): Promise<void> {
    try {
      // 使用 POST 请求发送消息，但使用 fetch 获取流式响应
      const response = await fetch('/api/v1/mem/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          onComplete?.();
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onComplete?.();
              return;
            }
            if (data.startsWith('[ERROR]')) {
              onError?.(new Error(data.slice(8)));
              return;
            }
            onMessage(data);
          }
        }
      }
    } catch (error) {
      onError?.(error as Error);
    }
  }

  async learnFromConversation(message: string, context?: string): Promise<BaseResponse> {
    const response = await this.axios.post<BaseResponse>('/mem/learn', {
      message,
      context,
    });
    return response.data;
  }

  async getMemories(limit: number = 100): Promise<MemoryListResponse> {
    const response = await this.axios.get<MemoryListResponse>('/mem/memories', {
      params: { limit },
    });
    return response.data;
  }

  async deleteMemory(memoryId: string): Promise<BaseResponse> {
    const response = await this.axios.delete<BaseResponse>(`/mem/memories/${memoryId}`);
    return response.data;
  }
}

export const apiClient = new APIClient();
export default apiClient;
