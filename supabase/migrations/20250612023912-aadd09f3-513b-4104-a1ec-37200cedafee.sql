
-- Function to automatically assign admin role based on phone number
CREATE OR REPLACE FUNCTION public.assign_admin_role_by_phone()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the phone number should have admin access
  -- Add your phone numbers here (replace with your actual numbers)
  IF NEW.phone_number IN ('+22242740882', '+22234330002', '+222XXXXXXXX') THEN
    -- Insert admin role if it doesn't exist
    INSERT INTO public.admin_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id) DO NOTHING;
    
    RAISE LOG 'Admin role assigned to user % with phone %', NEW.id, NEW.phone_number;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically assign admin roles based on phone number
DROP TRIGGER IF EXISTS on_profile_phone_verified ON public.profiles;
CREATE TRIGGER on_profile_phone_verified
  AFTER INSERT OR UPDATE OF phone_number, is_phone_verified ON public.profiles
  FOR EACH ROW 
  WHEN (NEW.phone_number IS NOT NULL AND NEW.is_phone_verified = true)
  EXECUTE FUNCTION public.assign_admin_role_by_phone();

-- Also check existing profiles and assign admin roles if needed
DO $$
DECLARE
    profile_record RECORD;
BEGIN
    FOR profile_record IN 
        SELECT id, phone_number 
        FROM public.profiles 
        WHERE phone_number IN ('+22242740882', '+22234330002', '+222XXXXXXXX') 
        AND is_phone_verified = true
    LOOP
        INSERT INTO public.admin_roles (user_id, role)
        VALUES (profile_record.id, 'admin')
        ON CONFLICT (user_id) DO NOTHING;
    END LOOP;
END $$;
