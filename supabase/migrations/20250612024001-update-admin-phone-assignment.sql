
-- Update the function to only include real phone numbers
CREATE OR REPLACE FUNCTION public.assign_admin_role_by_phone()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if the phone number should have admin access
  -- These are the authorized admin phone numbers
  IF NEW.phone_number IN ('+22242740882', '+22234330002') THEN
    -- Insert admin role if it doesn't exist
    INSERT INTO public.admin_roles (user_id, role)
    VALUES (NEW.id, 'super_admin')
    ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';
    
    RAISE LOG 'Super admin role assigned to user % with phone %', NEW.id, NEW.phone_number;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Update any existing profiles that should have admin access
UPDATE public.admin_roles 
SET role = 'super_admin' 
WHERE user_id IN (
  SELECT id FROM public.profiles 
  WHERE phone_number IN ('+22242740882', '+22234330002') 
  AND is_phone_verified = true
);

-- Insert admin roles for any missing verified admin phone numbers
INSERT INTO public.admin_roles (user_id, role)
SELECT p.id, 'super_admin'
FROM public.profiles p
WHERE p.phone_number IN ('+22242740882', '+22234330002') 
AND p.is_phone_verified = true
AND NOT EXISTS (
  SELECT 1 FROM public.admin_roles ar WHERE ar.user_id = p.id
);
