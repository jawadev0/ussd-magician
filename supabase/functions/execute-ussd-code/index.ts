import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation schema
const executeSchema = z.object({
  code_id: z.string().uuid(),
  ussd_code: z.string().trim().min(1).max(50),
});

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const { code_id, ussd_code } = executeSchema.parse(body);

    console.log('Executing USSD code:', ussd_code, 'for user:', user.id);

    // Simulate USSD execution
    // In a real Android app, this would communicate with the native layer
    const mockResponses: { [key: string]: string } = {
      '*100#': 'Your balance is 25.50 MAD. Valid until 2024-12-31.',
      '*101#': 'Recharge successful. New balance: 50.00 MAD.',
      '*121#': 'Your number is +212 6XX XXX XXX',
      '*555#': 'Data bundle activated. 1GB valid for 7 days.',
      '*555*100#': 'Mobile Credit Top-up successful. Amount: 100 MAD',
      '*123*1#': 'Orange menu: 1-Balance 2-Recharge 3-Offers',
      '*580#': 'Inwi services: Your balance is 15.75 MAD',
      '*123#': 'Your balance is $25.50. Thank you for using our service.',
      '*131*4#': 'Data Balance: 2.5GB remaining. Valid until 31-Dec-2024.',
      '*131*1*1#': 'Please enter the recipient number followed by the amount.',
    };

    const result = mockResponses[ussd_code] || 
      `USSD code ${ussd_code} executed successfully. Service response received.`;

    // Update the USSD code record with result
    const { error: updateError } = await supabaseClient
      .from('ussd_codes')
      .update({
        status: 'done',
        result: result,
        updated_at: new Date().toISOString(),
      })
      .eq('id', code_id)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Failed to update USSD code:', updateError);
    }

    console.log('USSD code executed successfully:', code_id);

    return new Response(
      JSON.stringify({
        success: true,
        result: result,
        code: ussd_code,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: error.errors }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});