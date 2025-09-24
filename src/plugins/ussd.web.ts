import { WebPlugin } from '@capacitor/core';
import type { USSDPlugin } from './ussd';

export class USSDWeb extends WebPlugin implements USSDPlugin {
  async sendUSSDRequest(options: { code: string; simSlot?: number }): Promise<{ result: string; success: boolean; error?: string }> {
    console.log('USSD request (web simulation):', options);
    
    // Simulate different responses based on code
    const mockResponses: { [key: string]: string } = {
      '*100#': 'Your balance is 25.50 MAD',
      '*101#': 'Recharge successful. New balance: 50.00 MAD',
      '*121#': 'Your number is +212 6XX XXX XXX',
      '*555#': 'Data bundle activated. 1GB valid for 7 days',
    };

    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result = mockResponses[options.code] || 'USSD request completed successfully';
    
    return {
      success: true,
      result,
    };
  }

  async getSIMInfo(options: { simSlot?: number }): Promise<{ 
    isActive: boolean; 
    carrier?: string; 
    phoneNumber?: string; 
    simSlot: number;
  }> {
    console.log('SIM info request (web simulation):', options);
    
    return {
      isActive: true,
      carrier: options.simSlot === 2 ? 'INWI' : 'ORANGE',
      phoneNumber: options.simSlot === 2 ? '+212 6XX XXX XX2' : '+212 6XX XXX XX1',
      simSlot: options.simSlot || 1,
    };
  }

  async checkPermissions(): Promise<{ granted: boolean; permissions: string[] }> {
    return {
      granted: true,
      permissions: ['CALL_PHONE', 'READ_PHONE_STATE']
    };
  }

  async requestPermissions(): Promise<{ granted: boolean; permissions: string[] }> {
    return {
      granted: true,
      permissions: ['CALL_PHONE', 'READ_PHONE_STATE']
    };
  }
}