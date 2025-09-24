export interface USSDCode {
  id: string;
  name: string;
  code: string;
  type: 'TOPUP' | 'ACTIVATION';
  description?: string;
  category?: string;
  sim: 1 | 2;
  operator: 'ORANGE' | 'INWI' | 'IAM';
  device: string;
  status: 'pending' | 'done' | 'failed';
  created_at: Date;
  last_executed?: Date;
}

export interface USSDResult {
  id: string;
  ussd_code_id: string;
  result: string;
  status: 'success' | 'error' | 'pending';
  executed_at: Date;
  error_message?: string;
}

export interface USSDExecutionResponse {
  success: boolean;
  result?: string;
  error?: string;
}

export interface SIMStatus {
  isActive: boolean;
  carrier?: string;
  phoneNumber?: string;
  dailyOperations?: number;
  operationsLimit?: number;
  lastResetDate?: string;
}

export interface DualSIMStatus {
  sim1: SIMStatus;
  sim2: SIMStatus;
}