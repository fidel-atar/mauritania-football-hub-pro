
-- Check if the trigger exists and create it if it doesn't
DO $$
BEGIN
    -- Check if the trigger exists
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        -- Create the function first
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER AS $trigger$
        BEGIN
          INSERT INTO public.profiles (id, full_name)
          VALUES (
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
          );
          RETURN NEW;
        END;
        $trigger$ LANGUAGE plpgsql SECURITY DEFINER;

        -- Create the trigger
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    END IF;
END $$;

-- Add missing columns to profiles table if they don't exist
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS location TEXT;

-- Update news_comments table to include user profile information
ALTER TABLE public.news_comments 
ADD COLUMN IF NOT EXISTS user_name TEXT,
ADD COLUMN IF NOT EXISTS user_avatar TEXT;

-- Ensure RLS is enabled on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- Create policies for profiles
CREATE POLICY "Users can view all profiles" 
  ON public.profiles 
  FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);
