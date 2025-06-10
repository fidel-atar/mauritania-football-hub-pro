
-- إنشاء enum جديد للأذونات
ALTER TYPE public.admin_role ADD VALUE IF NOT EXISTS 'manager';

-- إنشاء جدول طلبات الأذونات للمديرين
CREATE TABLE IF NOT EXISTS public.admin_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  requested_role public.admin_role NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- تمكين RLS على جدول طلبات الأذونات
ALTER TABLE public.admin_requests ENABLE ROW LEVEL SECURITY;

-- سياسة للسماح للمستخدمين برؤية طلباتهم الخاصة
CREATE POLICY "Users can view their own admin requests" 
  ON public.admin_requests 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- سياسة للسماح للمستخدمين بإنشاء طلبات جديدة
CREATE POLICY "Users can create admin requests" 
  ON public.admin_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- سياسة للسماح للـ super admin برؤية جميع الطلبات
CREATE POLICY "Super admins can view all requests" 
  ON public.admin_requests 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles 
      WHERE user_id = auth.uid() 
      AND role = 'super_admin'
    )
  );

-- إنشاء فهرس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_admin_requests_user_id ON public.admin_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_requests_status ON public.admin_requests(status);
