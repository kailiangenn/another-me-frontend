/**
 * 工作场景 API 客户端
 */
import axios, { AxiosInstance } from 'axios';
import type {
  WeeklyReportRequest,
  WeeklyReportResponse,
  OrganizeTodosRequest,
  TodoOrganizeResponse,
  MeetingSummaryRequest,
  MeetingSummaryResponse,
  ProjectProgressRequest,
  ProjectProgressResponse,
  ProjectAnalysisRequest,
  ProjectAnalysisResponse,
  ProjectHistoryRequest,
  ProjectHistoryResponse,
  WorkSuggestRequest,
  WorkSuggestResponse,
  GenerateSuggestRequest,
  GenerateSuggestResponse,
  TaskListRequest,
  TaskListResponse,
  TaskUpdateRequest,
  TaskUpdateResponse,
  TaskAnalysisRequest,
  TaskAnalysisResponse,
} from '@/types';

class WorkAPIClient {
  private axios: AxiosInstance;

  constructor() {
    this.axios = axios.create({
      baseURL: '/api/v1/work',
      timeout: 60000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * 生成工作周报
   */
  async generateWeeklyReport(request: WeeklyReportRequest = {}): Promise<WeeklyReportResponse> {
    const response = await this.axios.post<WeeklyReportResponse>('/weekly-report', request);
    return response.data;
  }

  /**
   * 智能整理待办事项
   */
  async organizeTodos(request: OrganizeTodosRequest): Promise<TodoOrganizeResponse> {
    const response = await this.axios.post<TodoOrganizeResponse>('/organize-todos', request);
    return response.data;
  }

  /**
   * 总结会议内容
   */
  async summarizeMeeting(request: MeetingSummaryRequest): Promise<MeetingSummaryResponse> {
    const response = await this.axios.post<MeetingSummaryResponse>('/summarize-meeting', request);
    return response.data;
  }

  /**
   * 追踪项目进度
   */
  async trackProjectProgress(request: ProjectProgressRequest): Promise<ProjectProgressResponse> {
    const response = await this.axios.post<ProjectProgressResponse>('/track-project', request);
    return response.data;
  }

  /**
   * 项目拆解分析
   * @param request - 项目描述
   * @returns 返回拆解结果文档信息
   */
  async analyzeProject(request: ProjectAnalysisRequest): Promise<ProjectAnalysisResponse> {
    const response = await this.axios.post<ProjectAnalysisResponse>('/project/analysis', request);
    return response.data;
  }

  /**
   * 获取历史项目分析记录
   * @param request - 分页参数
   * @returns 返回历史记录列表
   */
  async getProjectHistory(request: ProjectHistoryRequest = {}): Promise<ProjectHistoryResponse> {
    const response = await this.axios.get<ProjectHistoryResponse>('/project/history', {
      params: request
    });
    return response.data;
  }

  /**
   * 获取工作建议内容
   * @param request - 请求参数
   * @returns 返回 Markdown 格式的建议内容
   */
  async getWorkSuggestions(request: WorkSuggestRequest = {}): Promise<WorkSuggestResponse> {
    const response = await this.axios.get<WorkSuggestResponse>('/suggest');
    return response.data;
  }

  /**
   * 生成工作建议
   * @param request - 生成请求参数
   * @returns 返回生成的 Markdown 建议
   */
  async generateSuggestions(request: GenerateSuggestRequest = {}): Promise<GenerateSuggestResponse> {
    const response = await this.axios.post<GenerateSuggestResponse>('/suggest/generate', request);
    return response.data;
  }

  /**
   * 获取任务列表
   * @param request - 分页和筛选参数
   * @returns 返回任务列表
   */
  async getTaskList(request: TaskListRequest = {}): Promise<TaskListResponse> {
    const response = await this.axios.get<TaskListResponse>('/task/list', {
      params: request
    });
    return response.data;
  }

  /**
   * 更新任务
   * @param request - 任务更新数据
   * @returns 返回更新结果
   */
  async updateTask(request: TaskUpdateRequest): Promise<TaskUpdateResponse> {
    const response = await this.axios.post<TaskUpdateResponse>('/task/update', request);
    return response.data;
  }

  /**
   * 任务分析
   * @param request - 任务描述
   * @returns 返回任务分析结果
   */
  async analyzeTask(request: TaskAnalysisRequest): Promise<TaskAnalysisResponse> {
    const response = await this.axios.post<TaskAnalysisResponse>('/task/analysis', request);
    return response.data;
  }
}

export const workAPI = new WorkAPIClient();
export default workAPI;
