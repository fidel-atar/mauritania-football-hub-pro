
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import GoogleAuthButton from './GoogleAuthButton';
import AppleAuthButton from './AppleAuthButton';
import { useAuth } from '@/contexts/AuthContext';

interface RoleRequest {
  id: string;
  requested_role: string;
  reason: string;
  status: string;
  created_at: string;
}

const RoleBasedAuth = () => {
  const { user, isAdmin, adminRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'manager' | 'super_admin' | null>(null);
  const [reason, setReason] = useState('');
  const [requests, setRequests] = useState<RoleRequest[]>([]);
  const [loading, setLoading] = useState(false);

  const handleRoleRequest = async () => {
    if (!user || !selectedRole || !reason.trim()) {
      toast.error('يرجى ملء جميع الحقول');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('admin_requests')
        .insert({
          user_id: user.id,
          requested_role: selectedRole,
          reason: reason.trim()
        });

      if (error) {
        toast.error('خطأ في إرسال الطلب');
        console.error('Request error:', error);
      } else {
        toast.success('تم إرسال طلب الصلاحية بنجاح');
        setReason('');
        setSelectedRole(null);
        fetchUserRequests();
      }
    } catch (error) {
      toast.error('خطأ في إرسال الطلب');
      console.error('Request error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRequests = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('admin_requests')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching requests:', error);
      } else {
        setRequests(data || []);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  React.useEffect(() => {
    if (user) {
      fetchUserRequests();
    }
  }, [user]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'قيد المراجعة', variant: 'secondary' as const },
      approved: { label: 'مقبول', variant: 'default' as const },
      rejected: { label: 'مرفوض', variant: 'destructive' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap];
    return <Badge variant={statusInfo?.variant}>{statusInfo?.label}</Badge>;
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">اختر نوع الحساب</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-medium">المستخدم العادي</h3>
              <GoogleAuthButton userType="user" />
              <AppleAuthButton userType="user" />
            </div>
            
            <div className="border-t pt-4 space-y-3">
              <h3 className="font-medium">مدير المباريات والفرق</h3>
              <GoogleAuthButton userType="manager" />
              <AppleAuthButton userType="manager" />
            </div>
            
            <div className="border-t pt-4 space-y-3">
              <h3 className="font-medium">المدير الكبير</h3>
              <GoogleAuthButton userType="super_admin" />
              <AppleAuthButton userType="super_admin" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user is already admin, show their dashboard
  if (isAdmin) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>لوحة تحكم {adminRole === 'super_admin' ? 'المدير الكبير' : 'المدير'}</span>
              <Badge variant="default">{adminRole}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-600">مرحباً! لديك صلاحيات إدارية نشطة.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show role request interface for regular users
  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>طلب صلاحيات إدارية</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Label>نوع الصلاحية المطلوبة</Label>
            <div className="space-y-2">
              <Button
                variant={selectedRole === 'manager' ? 'default' : 'outline'}
                onClick={() => setSelectedRole('manager')}
                className="w-full justify-start"
              >
                مدير المباريات والفرق
              </Button>
              <Button
                variant={selectedRole === 'super_admin' ? 'default' : 'outline'}
                onClick={() => setSelectedRole('super_admin')}
                className="w-full justify-start"
              >
                مدير كبير
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">سبب الطلب</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="اذكر سبب طلبك للصلاحيات الإدارية..."
              rows={4}
            />
          </div>

          <Button
            onClick={handleRoleRequest}
            disabled={!selectedRole || !reason.trim() || loading}
            className="w-full bg-fmf-green hover:bg-fmf-green/90"
          >
            {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
          </Button>
        </CardContent>
      </Card>

      {/* User's requests history */}
      {requests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>طلباتي السابقة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {request.requested_role === 'manager' ? 'مدير المباريات والفرق' : 'مدير كبير'}
                    </span>
                    {getStatusBadge(request.status)}
                  </div>
                  <p className="text-sm text-gray-600">{request.reason}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(request.created_at).toLocaleDateString('ar')}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RoleBasedAuth;
