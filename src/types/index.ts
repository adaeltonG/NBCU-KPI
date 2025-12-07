// KPI REPORT TOOL - TYPE DEFINITIONS

export type UserRole = 'ADMIN' | 'MANAGER' | 'VIEWER' | 'CLIENT';
export type Frequency = 'MONTHLY' | 'QUARTERLY' | 'ANNUAL';
export type ScoreStatus = 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
export type CommentType = 'GENERAL' | 'ACHIEVEMENT' | 'ISSUE' | 'ACTION_REQUIRED';
export type EvidenceType = 'DOCUMENT' | 'IMAGE' | 'REPORT' | 'LINK' | 'OTHER';
export type ActionStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE' | 'CANCELLED';
export type ScoreDisplayMode = 'SODEXO' | 'NBCU' | 'AVERAGE';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  shortName: string;
  description?: string;
  color: string;
  icon?: string;
  sortOrder: number;
  kpis?: KPI[];
}

export interface ServiceLine {
  id: string;
  name: string;
}

export interface KPI {
  id: string;
  kpiNumber: number;
  desiredOutcome: string;
  objective: string;
  measurementIntent: string;
  definition: string;
  output: string;
  dataSource: string;
  calculation?: string;
  frequency: Frequency;
  weighting: number;
  failThreshold: string;
  achieveThreshold: string;
  scoringComment?: string;
  isActive: boolean;
  sortOrder: number;
  categoryId: string;
  category?: Category;
  serviceLineId?: string;
  serviceLine?: ServiceLine;
  responsiblePersonId?: string;
  responsiblePerson?: User;
  scores?: KPIScore[];
  clientScores?: ClientScore[];
  comments?: KPIComment[];
  evidence?: KPIEvidence[];
}

export interface Period {
  id: string;
  year: number;
  month: number;
  quarter: number;
  startDate: string;
  endDate: string;
  isClosed: boolean;
}

export interface KPIScore {
  id: string;
  actualValue?: string;
  numericValue?: number;
  score?: number;
  status: ScoreStatus;
  week1Value?: string;
  week2Value?: string;
  week3Value?: string;
  week4Value?: string;
  notes?: string;
  submittedAt?: string;
  kpiId: string;
  kpi?: KPI;
  periodId: string;
  period?: Period;
  submittedById?: string;
  submittedBy?: User;
}

export interface ClientScore {
  id: string;
  score: number;
  justification?: string;
  scoredAt: string;
  kpiId: string;
  kpi?: KPI;
  periodId: string;
  period?: Period;
  scoredById?: string;
  scoredBy?: User;
}

export interface KPIComment {
  id: string;
  content: string;
  type: CommentType;
  createdAt: string;
  kpiId: string;
  kpi?: KPI;
  periodId: string;
  period?: Period;
  authorId: string;
  author?: User;
}

export interface KPIEvidence {
  id: string;
  title: string;
  description?: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  type: EvidenceType;
  createdAt: string;
  kpiId: string;
  kpi?: KPI;
  periodId: string;
  period?: Period;
  uploadedById: string;
  uploadedBy?: User;
}

export interface Action {
  id: string;
  actionNumber: number;
  description: string;
  requiredAction: string;
  raisedBy: string;
  dueDate?: string;
  completedDate?: string;
  status: ActionStatus;
  responsibleId?: string;
  responsible?: User;
}

export interface DashboardStats {
  overallScore: number;
  overallPercentage: number;
  totalKPIs: number;
  passedKPIs: number;
  failedKPIs: number;
  pendingKPIs: number;
  categoryScores: CategoryScore[];
  monthlyTrend: MonthlyTrend[];
}

export interface CategoryScore {
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  score: number;
  percentage: number;
  kpiCount: number;
  passedCount: number;
}

export interface MonthlyTrend {
  month: string;
  year: number;
  sodexoScore: number;
  clientScore: number;
  averageScore: number;
}

export interface KPIDetailedScore {
  kpi: KPI;
  sodexoScore?: number;
  clientScore?: number;
  averageScore?: number;
  status: 'PASS' | 'FAIL' | 'PENDING';
  monthlyScores: {
    month: number;
    value: string;
    score: number;
  }[];
  ytdAverage: number;
}

export interface KPIScoreInput {
  kpiId: string;
  periodId: string;
  actualValue: string;
  notes?: string;
  week1Value?: string;
  week2Value?: string;
  week3Value?: string;
  week4Value?: string;
}

export interface ClientScoreInput {
  kpiId: string;
  periodId: string;
  score: number;
  justification?: string;
}

export interface CommentInput {
  kpiId: string;
  periodId: string;
  content: string;
  type: CommentType;
}

export interface EvidenceInput {
  kpiId: string;
  periodId: string;
  title: string;
  description?: string;
  type: EvidenceType;
  file?: File;
  fileUrl?: string;
}
