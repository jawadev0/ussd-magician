import { registerPlugin } from '@capacitor/core';

export interface USSDPlugin {
  sendUSSDRequest(options: { code: string; simSlot?: number }): Promise<{ result: string; success: boolean; error?: string }>;
  getSIMInfo(options: { simSlot?: number }): Promise<{ 
    isActive: boolean; 
    carrier?: string; 
    phoneNumber?: string; 
    simSlot: number;
  }>;
  checkPermissions(): Promise<{ granted: boolean; permissions: string[] }>;
  requestPermissions(): Promise<{ granted: boolean; permissions: string[] }>;
}

const USSD = registerPlugin<USSDPlugin>('USSD', {
  web: () => import('./ussd.web').then(m => new m.USSDWeb()),
});

export default USSD;