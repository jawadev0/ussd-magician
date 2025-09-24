import { USSDCode, USSDExecutionResponse, SIMStatus, DualSIMStatus } from "@/types/ussd";
import { Capacitor } from '@capacitor/core';
import USSD from '@/plugins/ussd';
import { Telephony } from '@luisbytes/capacitor-telephony';

// Mock database for demo - replace with actual Supabase integration
const MOCK_USSD_CODES: USSDCode[] = [
  {
    id: "1",
    name: "Check Balance",
    code: "*123#",
    type: "TOPUP",
    description: "Check your account balance",
    category: "Balance Check",
    sim: 1,
    operator: "INWI",
    device: "Samsung Galaxy S21",
    status: "done",
    created_at: new Date("2024-01-01"),
  },
  {
    id: "2", 
    name: "Data Balance",
    code: "*131*4#",
    type: "ACTIVATION",
    description: "Check your data balance",
    category: "Data Plans",
    sim: 1,
    operator: "ORANGE",
    device: "iPhone 14 Pro",
    status: "pending",
    created_at: new Date("2024-01-02"),
  },
  {
    id: "3",
    name: "Airtime Transfer",
    code: "*131*1*1#",
    type: "TOPUP",
    description: "Transfer airtime to another number",
    category: "Airtime",
    sim: 2,
    operator: "IAM",
    device: "Google Pixel 7",
    status: "failed",
    created_at: new Date("2024-01-03"),
  },
];

let ussdCodes = [...MOCK_USSD_CODES];

export const ussdService = {
  // Get all USSD codes
  getAllUSSDCodes: async (): Promise<USSDCode[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return ussdCodes;
  },

  // Add new USSD code
  addUSSDCode: async (code: Omit<USSDCode, 'id' | 'created_at'>): Promise<USSDCode> => {
    const newCode: USSDCode = {
      ...code,
      id: Date.now().toString(),
      created_at: new Date(),
    };
    ussdCodes.push(newCode);
    return newCode;
  },

  // Update USSD code
  updateUSSDCode: async (id: string, updates: Partial<USSDCode>): Promise<USSDCode> => {
    const index = ussdCodes.findIndex(code => code.id === id);
    if (index === -1) throw new Error('USSD code not found');
    
    ussdCodes[index] = { ...ussdCodes[index], ...updates };
    return ussdCodes[index];
  },

  // Delete USSD code
  deleteUSSDCode: async (id: string): Promise<void> => {
    ussdCodes = ussdCodes.filter(code => code.id !== id);
  },

  // Clear all pending operations
  clearPendingOperations: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    ussdCodes = ussdCodes.filter(code => code.status !== 'pending');
  },

  // Execute USSD code (using native Android functionality)
  executeUSSDCode: async (code: string): Promise<USSDExecutionResponse> => {
    try {
      if (Capacitor.isNativePlatform()) {
        // Check permissions first
        const permissionCheck = await USSD.checkPermissions();
        if (!permissionCheck.granted) {
          const permissionRequest = await USSD.requestPermissions();
          if (!permissionRequest.granted) {
            return {
              success: false,
              error: 'Required permissions not granted. Please enable phone permissions in settings.',
            };
          }
        }

        // Execute USSD using native plugin
        console.log('Executing USSD on native platform:', code);
        const result = await USSD.sendUSSDRequest({ code });
        
        return {
          success: result.success,
          result: result.result,
          error: result.error,
        };
      } else {
        // Web simulation
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const mockResponses: { [key: string]: string } = {
          '*100#': 'Your balance is 25.50 MAD. Valid until 2024-12-31.',
          '*101#': 'Recharge successful. New balance: 50.00 MAD.',
          '*121#': 'Your number is +212 6XX XXX XXX',
          '*555#': 'Data bundle activated. 1GB valid for 7 days.',
          '*123*1#': 'Orange menu: 1-Balance 2-Recharge 3-Offers',
          '*580#': 'Inwi services: Your balance is 15.75 MAD',
          '*123#': 'Your balance is $25.50. Thank you for using our service.',
          '*131*4#': 'Data Balance: 2.5GB remaining. Valid until 31-Dec-2024.',
          '*131*1*1#': 'Please enter the recipient number followed by the amount.',
        };

        const result = mockResponses[code] || `USSD code ${code} executed successfully. Service response received.`;
        
        return {
          success: true,
          result,
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  },

  // Get SIM status (using native functionality when available)
  getSIMStatus: async (): Promise<DualSIMStatus> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (Capacitor.isNativePlatform()) {
        console.log('Getting SIM status from native platform');
        
        // Get info for both SIM slots
        const [sim1Info, sim2Info] = await Promise.allSettled([
          USSD.getSIMInfo({ simSlot: 0 }),
          USSD.getSIMInfo({ simSlot: 1 })
        ]);

        const sim1 = sim1Info.status === 'fulfilled' ? sim1Info.value : { isActive: false, simSlot: 0 };
        const sim2 = sim2Info.status === 'fulfilled' ? sim2Info.value : { isActive: false, simSlot: 1 };

        const today = new Date().toDateString();

        return {
          sim1: {
            isActive: sim1.isActive,
            carrier: sim1.carrier || 'UNKNOWN',
            phoneNumber: sim1.phoneNumber || 'Unknown',
            dailyOperations: Math.floor(Math.random() * 10),
            operationsLimit: 20,
            lastResetDate: today,
          },
          sim2: {
            isActive: sim2.isActive,
            carrier: sim2.carrier || 'UNKNOWN',
            phoneNumber: sim2.phoneNumber || 'Unknown',
            dailyOperations: Math.floor(Math.random() * 5),
            operationsLimit: 20,
            lastResetDate: today,
          },
        };
      } else {
        // Browser simulation
        const today = new Date().toDateString();
        return {
          sim1: {
            isActive: true,
            carrier: "INWI",
            phoneNumber: "+212-6-12-34-56-78",
            dailyOperations: 12,
            operationsLimit: 20,
            lastResetDate: today
          },
          sim2: {
            isActive: true,
            carrier: "ORANGE", 
            phoneNumber: "+212-6-87-65-43-21",
            dailyOperations: 8,
            operationsLimit: 20,
            lastResetDate: today
          }
        };
      }
    } catch (error) {
      console.error('Error getting SIM status:', error);
      return {
        sim1: { isActive: false },
        sim2: { isActive: false }
      };
    }
  },

  // Check if USSD can be executed on specific SIM
  canExecuteUSSD: (ussdCode: USSDCode, simNumber: 1 | 2, simStatus: DualSIMStatus): boolean => {
    const sim = simNumber === 1 ? simStatus.sim1 : simStatus.sim2;
    
    // Check if this USSD code is assigned to this SIM
    if (ussdCode.sim !== simNumber) return false;
    
    // Check if SIM is active
    if (!sim.isActive) return false;
    
    // Check daily operations limit
    if (sim.dailyOperations && sim.dailyOperations >= (sim.operationsLimit || 20)) return false;
    
    // Check if USSD operator matches SIM operator
    const operatorMatch = (ussdCode.operator === sim.carrier);
    
    return operatorMatch;
  },

  // Activate SIM
  activateSIM: async (simNumber: 1 | 2): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return true;
    } catch (error) {
      return false;
    }
  },

  // Deactivate SIM
  deactivateSIM: async (simNumber: 1 | 2): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      return true;
    } catch (error) {
      return false;
    }
  }
};