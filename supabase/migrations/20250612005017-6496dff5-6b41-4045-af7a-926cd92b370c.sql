
-- Create phone authentication table
CREATE TABLE public.phone_auth (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL UNIQUE,
  otp_code TEXT,
  otp_expires_at TIMESTAMP WITH TIME ZONE,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.phone_auth ENABLE ROW LEVEL SECURITY;

-- Create policies for phone auth
CREATE POLICY "Users can manage their own phone auth" 
  ON public.phone_auth 
  FOR ALL 
  USING (true);

-- Update profiles table to include phone number as primary identifier
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_phone_verified BOOLEAN DEFAULT false;

-- Create function to clean expired OTP codes
CREATE OR REPLACE FUNCTION clean_expired_otp_codes()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE phone_auth 
  SET otp_code = NULL, otp_expires_at = NULL
  WHERE otp_expires_at < now();
END;
$$;

-- Create function to verify OTP
CREATE OR REPLACE FUNCTION verify_otp(p_phone_number TEXT, p_otp_code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE phone_auth 
  SET is_verified = true, otp_code = NULL, otp_expires_at = NULL
  WHERE phone_number = p_phone_number 
    AND otp_code = p_otp_code 
    AND otp_expires_at > now();
    
  RETURN FOUND;
END;
$$;
