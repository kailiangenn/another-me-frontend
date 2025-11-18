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
    // TODO: 待后端就绪后替换为真实接口
    // const response = await this.axios.post<ProjectAnalysisResponse>('/project/analysis', request);
    // return response.data;

    // Mock 数据（仅供前端开发使用）
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          msg: 'success',
          fileTitle: `${request.project_desc.substring(0, 20)}… - 项目拆解分析`,
          fileUrl: 'mock_analysis_' + Date.now(), // Mock 文档 ID
        });
      }, 800); // 模拟分析耗时
    });
  }

  /**
   * 获取历史项目分析记录
   * @param request - 分页参数
   * @returns 返回历史记录列表
   */
  async getProjectHistory(request: ProjectHistoryRequest = {}): Promise<ProjectHistoryResponse> {
    // TODO: 待后端就绪后替换为真实接口
    // const response = await this.axios.post<ProjectHistoryResponse>('/project/history', request);
    // return response.data;

    // Mock 数据（仅供前端开发使用）
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          code: 200,
          msg: 'success',
          data: [
            {
              title: '智能客服系统 - 项目拆解分析',
              fileUrl: 'mock_analysis_1732456789123',
              id: '1',
              createdAt: new Date(Date.now() - 86400000).toLocaleString('zh-CN'),
            },
            {
              title: '电商平台后台系统 - 项目拆解分析',
              fileUrl: 'mock_analysis_1732370389123',
              id: '2',
              createdAt: new Date(Date.now() - 172800000).toLocaleString('zh-CN'),
            },
            {
              title: '数据分析可视化平台 - 项目拂解分析',
              fileUrl: 'mock_analysis_1732283989123',
              id: '3',
              createdAt: new Date(Date.now() - 259200000).toLocaleString('zh-CN'),
            },
          ],
        });
      }, 400); // 模拟网络延迟
    });
  }

  /**
   * 获取今日工作建议列表
   * @param request - 分页参数
   * @returns 返回建议列表
   */
  async getWorkSuggestions(request: WorkSuggestRequest = {}): Promise<WorkSuggestResponse> {
    const { page = 1, size = 3 } = request;
    
    // TODO: 待后端就绪后替换为真实接口
    // const response = await this.axios.get<WorkSuggestResponse>('/suggest/list', {
    //   params: { page, size }
    // });
    // return response.data;

    // Mock 数据（仅供前端开发使用）
    return new Promise((resolve) => {
      setTimeout(() => {
        // 模拟更多建议数据
        const allSuggestions = [
          '优先完成高优先级任务：完成项目规划文档，该任务对项目进度影响较大',
          '建议在上午10点前准备好会议材料，留出充裕的复查时间',
          '考虑更新项目文档以保持信息同步，避免团队成员信息差异',
          '今天下午15:00 有项目评审会，请提前准备好汇报 PPT',
          '建议花 30 分钟复盘上周工作内容，梳理本周工作重点',
          '注意与前端团队沟通 API 接口进度，确保前后端协作顺畅',
          '建议下班前花 15 分钟整理明天的待办事项，提高第二天效率',
          '今日代码提交前请确保通过单元测试，减少线上问题',
          '关注一下服务器监控指标，最近 CPU 使用率偏高',
          '建议参加下午16:00 的技术分享会，主题是微服务架构优化',
        ];

        const startIndex = (page - 1) * size;
        const endIndex = startIndex + size;
        const pageData = allSuggestions.slice(startIndex, endIndex);

        resolve({
          code: 200,
          msg: 'success',
          data: pageData,
          pageable: {
            page,
            size,
            total_count: allSuggestions.length,
          },
        });
      }, 300); // 模拟网络延迟
    });
  }
}

export const workAPI = new WorkAPIClient();
export default workAPI;
