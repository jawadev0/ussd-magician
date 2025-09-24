import { USSDCode, USSDExecutionResponse } from "@/types/ussd";

// Mock database for demo - replace with actual Supabase integration
const MOCK_USSD_CODES: USSDCode[] = [
  {
    id: "1",
    name: "Check Balance",
    code: "*123#",
    description: "Check your account balance",
    category: "Balance Check",
    created_at: new Date("2024-01-01"),
  },
  {
    id: "2", 
    name: "Data Balance",
    code: "*131*4#",
    description: "Check your data balance",
    category: "Data Plans",
    created_at: new Date("2024-01-02"),
  },
  {
    id: "3",
    name: "Airtime Transfer",
    code: "*131*1*1#",
    description: "Transfer airtime to another number",
    category: "Airtime",
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
  }
};