export interface USSDCode {
  id: string;
  name: string;
  code: string;
  description?: string;
  category?: string;
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