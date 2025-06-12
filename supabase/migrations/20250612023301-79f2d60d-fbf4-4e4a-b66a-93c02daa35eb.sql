
-- Add phone_number column to profiles table if it doesn't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number TEXT UNIQUE;

-- Add is_phone_verified column to profiles table if it doesn't exist  
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_phone_verified BOOLEAN DEFAULT false;

-- Create index on phone_number for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_phone_number ON public.profiles(phone_number);

-- Update the handle_new_user function to include phone data
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone_number, is_phone_verified)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.raw_user_meta_data->>'phone_number',
    COALESCE((NEW.raw_user_meta_data->>'is_phone_verified')::boolean, false)
  );
  RETURN NEW;
END;
$$;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view their own phone data" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own phone data" ON public.profiles;

-- Add RLS policies for phone authentication data
CREATE POLICY "Users can view their own phone data" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own phone data" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);
