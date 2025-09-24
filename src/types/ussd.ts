export interface USSDCode {
  id: string;
  name: string;
  code: string;
  description?: string;
  category?: string;
  simCard: 'INWI' | 'ORANGE' | 'IAM';
  device: string;
  operator: string;
  status: 'active' | 'inactive' | 'pending';
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
  signalStrength?: number;
  networkType?: string;
}