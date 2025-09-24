import { USSDCode, USSDExecutionResponse, SIMStatus, DualSIMStatus } from "@/types/ussd";

// Mock database for demo - replace with actual Supabase integration
const MOCK_USSD_CODES: USSDCode[] = [
  {
    id: "1",
    name: "Check Balance",
    code: "*123#",
    description: "Check your account balance",
    category: "Balance Check",
    sim1: "INWI",
    sim2: "ORANGE",
    device: "Samsung Galaxy S21",
    operator: "INWI Morocco",
    status: "done",
    created_at: new Date("2024-01-01"),
  },
  {
    id: "2", 
    name: "Data Balance",
    code: "*131*4#",
    description: "Check your data balance",
    category: "Data Plans",
    sim1: "ORANGE",
    sim2: "IAM",
    device: "iPhone 14 Pro",
    operator: "Orange Morocco",
    status: "pending",
    created_at: new Date("2024-01-02"),
  },
  {
    id: "3",
    name: "Airtime Transfer",
    code: "*131*1*1#",
    description: "Transfer airtime to another number",
    category: "Airtime",
    sim1: "IAM",
    sim2: "INWI",
    device: "Google Pixel 7",
    operator: "Maroc Telecom",
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

  // Execute USSD code (using native Android functionality)
  executeUSSDCode: async (code: string): Promise<USSDExecutionResponse> => {
    try {
      // Check if we're running in Capacitor (native environment)
      if ((window as any).Capacitor) {
        // In a real implementation, this would use a Capacitor plugin
        // For now, we'll simulate the execution
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock responses based on common USSD codes
        if (code.includes('*123#')) {
          return {
            success: true,
            result: "Your balance is $25.50. Thank you for using our service."
          };
        } else if (code.includes('*131*4#')) {
          return {
            success: true,
            result: "Data Balance: 2.5GB remaining. Valid until 31-Dec-2024."
          };
        } else if (code.includes('*131*1*1#')) {
          return {
            success: true,
            result: "Please enter the recipient number followed by the amount."
          };
        } else {
          return {
            success: true,
            result: `USSD code ${code} executed successfully. Service response received.`
          };
        }
      } else {
        // Running in browser - simulate execution
        await new Promise(resolve => setTimeout(resolve, 1500));
        return {
          success: true,
          result: `[Simulated] USSD ${code} executed successfully in browser mode.`
        };
      }
    } catch (error) {
      return {
        success: false,
        error: `Failed to execute USSD code: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  },

  // Get SIM status
  getSIMStatus: async (): Promise<DualSIMStatus> => {
    try {
      // Simulate checking SIM status
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if ((window as any).Capacitor) {
        // In a real implementation, this would use Capacitor plugins to check SIM status
        return {
          sim1: {
            isActive: true,
            carrier: "INWI",
            phoneNumber: "+212-6-12-34-56-78",
            signalStrength: 85,
            networkType: "4G LTE"
          },
          sim2: {
            isActive: false,
            carrier: "ORANGE",
            phoneNumber: "+212-6-87-65-43-21",
            signalStrength: 70,
            networkType: "4G LTE"
          }
        };
      } else {
        // Browser simulation
        return {
          sim1: {
            isActive: true,
            carrier: "INWI",
            phoneNumber: "+212-6-12-34-56-78",
            signalStrength: 75,
            networkType: "4G LTE"
          },
          sim2: {
            isActive: true,
            carrier: "ORANGE",
            phoneNumber: "+212-6-87-65-43-21",
            signalStrength: 60,
            networkType: "3G"
          }
        };
      }
    } catch (error) {
      return {
        sim1: { isActive: false },
        sim2: { isActive: false }
      };
    }
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