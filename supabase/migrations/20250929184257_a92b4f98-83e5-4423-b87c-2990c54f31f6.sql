-- Create USSD codes table
CREATE TABLE public.ussd_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('ACTIVATION', 'TOPUP')),
  description TEXT,
  category TEXT,
  sim INTEGER CHECK (sim IN (1, 2)),
  operator TEXT,
  device TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'done', 'failed')),
  result TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ussd_codes ENABLE ROW LEVEL SECURITY;

-- Policies for ussd_codes
CREATE POLICY "Users can view own USSD codes"
  ON public.ussd_codes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own USSD codes"
  ON public.ussd_codes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own USSD codes"
  ON public.ussd_codes
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own USSD codes"
  ON public.ussd_codes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_ussd_codes_updated_at
  BEFORE UPDATE ON public.ussd_codes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();