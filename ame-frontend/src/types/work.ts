/**
 * 工作场景相关类型定义
 */

/** 周报生成请求 */
export interface WeeklyReportRequest {
  start_date?: string;
  end_date?: string;
}

/** 时间统计 */
export interface TimeStats {
  total_hours: number;
  breakdown: Record<string, number>;
}

/** 周报生成响应 */
export interface WeeklyReportResponse {
  success: boolean;
  report: string;
  insights?: {
    key_tasks?: string[];
    achievements?: string[];
    challenges?: string[];
    time_stats?: TimeStats;
  };
  timestamp: string;
}

/** 待办事项 */
export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  deadline?: string;
  dependencies?: string[];
  created_at: string;
}

/** 待办整理请求 */
export interface OrganizeTodosRequest {
  todos: string[];
}

/** 待办整理响应 */
export interface TodoOrganizeResponse {
  success: boolean;
  high_priority: TodoItem[];
  medium_priority: TodoItem[];
  low_priority: TodoItem[];
  statistics: {
    total: number;
    completed: number;
    pending: number;
  };
  timestamp: string;
}

/** 会议总结请求 */
export interface MeetingSummaryRequest {
  meeting_notes: string;
  meeting_info?: {
    title?: string;
    date?: string;
    participants?: string[];
  };
}

/** 会议总结响应 */
export interface MeetingSummaryResponse {
  success: boolean;
  summary: string;
  key_points?: string[];
  decisions?: string[];
  action_items?: string[];
  timestamp: string;
}

/** 项目进度请求 */
export interface ProjectProgressRequest {
  project_name: string;
}

/** 项目进度响应 */
export interface ProjectProgressResponse {
  success: boolean;
  project_name: string;
  progress_report: string;
  milestones?: Array<{
    name: string;
    status: string;
    completion: number;
  }>;
  timestamp: string;
}

/** 项目拆解请求 */
export interface ProjectAnalysisRequest {
  project_desc: string;  // 项目描述内容
}

/** 项目拆解响应 */
export interface ProjectAnalysisResponse {
  code: number;
  msg: string;
  fileTitle: string;  // 文档标题
  fileUrl: string;    // 文档 URL 或内容标识
}

/** 项目拆解历史记录 */
export interface ProjectAnalysisHistory {
  id: string;
  title: string;
  fileUrl: string;
  createdAt: string;
}

/** 历史项目分析请求 */
export interface ProjectHistoryRequest {
  // 可以添加分页参数等
  page?: number;
  page_size?: number;
}

/** 历史项目分析响应 */
export interface ProjectHistoryResponse {
  code: number;
  msg: string;
  data: Array<{
    title: string;      // 项目标题（对应 msg 字段）
    fileUrl: string;    // 文件 URL（对应 data 字段）
    id?: string;        // 记录 ID
    createdAt?: string; // 创建时间
  }>;
}

/** 分页信息 */
export interface Pageable {
  page: number;        // 当前页码
  size: number;        // 每页数量
  total_count: number; // 总记录数
}

/** 今日工作建议请求参数 */
export interface WorkSuggestRequest {
  page?: number;  // 页码，默认 1
  size?: number;  // 每页数量，默认 3
}

/** 今日工作建议响应 */
export interface WorkSuggestResponse {
  code: number;
  msg: string;
  data: string[];      // 建议列表
  pageable: Pageable;  // 分页信息
}
