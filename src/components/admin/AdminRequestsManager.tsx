
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface AdminRequest {
  id: string;
  user_id: string;
  requested_role: string;
  reason: string;
  status: string;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  profiles?: {
    full_name: string;
    email: string;
  };
}

const AdminRequestsManager = () => {
  const { user, adminRole } = useAuth();
  const [requests, setRequests] = useState<AdminRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_requests')
        .select(`
          *,
          profiles!admin_requests_user_id_fkey (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('خطأ في جلب الطلبات');
        console.error('Error fetching requests:', error);
      } else {
        setRequests(data || []);
      }
    } catch (error) {
      toast.error('خطأ في جلب الطلبات');
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId: string, action: 'approved' | 'rejected') => {
    try {
      const { error: updateError } = await supabase
        .from('admin_requests')
        .update({
          status: action,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user?.id
        })
        .eq('id', requestId);

      if (updateError) {
        toast.error('خطأ في تحديث الطلب');
        console.error('Error updating request:', updateError);
        return;
      }

      // If approved, add the user to admin_roles
      if (action === 'approved') {
        const request = requests.find(r => r.id === requestId);
        if (request) {
          const { error: roleError } = await supabase
            .from('admin_roles')
            .insert({
              user_id: request.user_id,
              role: request.requested_role
            });

          if (roleError) {
            toast.error('خطأ في إضافة الصلاحيات');
            console.error('Error adding role:', roleError);
            return;
          }
        }
      }

      toast.success(action === 'approved' ? 'تم قبول الطلب' : 'تم رفض الطلب');
      fetchRequests();
    } catch (error) {
      toast.error('خطأ في معالجة الطلب');
      console.error('Error processing request:', error);
    }
  };

  useEffect(() => {
    if (adminRole === 'super_admin') {
      fetchRequests();
    }
  }, [adminRole]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'قيد المراجعة', variant: 'secondary' as const },
      approved: { label: 'مقبول', variant: 'default' as const },
      rejected: { label: 'مرفوض', variant: 'destructive' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap];
    return <Badge variant={statusInfo?.variant}>{statusInfo?.label}</Badge>;
  };

  const getRoleLabel = (role: string) => {
    return role === 'manager' ? 'مدير المباريات والفرق' : 'مدير كبير';
  };

  if (adminRole !== 'super_admin') {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">
            هذه الصفحة متاحة فقط للمدير الكبير
          </p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center">جاري التحميل...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>إدارة طلبات الصلاحيات الإدارية</CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="text-center text-gray-500 py-8">لا توجد طلبات</p>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div key={request.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="font-medium">
                        {request.profiles?.full_name || request.profiles?.email || 'مستخدم غير معروف'}
                      </h3>
                      <p className="text-sm text-gray-600">{request.profiles?.email}</p>
                      <p className="text-sm">
                        <span className="font-medium">نوع الصلاحية المطلوبة: </span>
                        {getRoleLabel(request.requested_role)}
                      </p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium">سبب الطلب:</Label>
                    <p className="text-sm bg-gray-50 p-3 rounded">{request.reason}</p>
                  </div>

                  <p className="text-xs text-gray-400">
                    تاريخ الطلب: {new Date(request.created_at).toLocaleDateString('ar')}
                  </p>

                  {request.status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleRequestAction(request.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                      >
                        قبول
                      </Button>
                      <Button
                        onClick={() => handleRequestAction(request.id, 'rejected')}
                        variant="destructive"
                        size="sm"
                      >
                        رفض
                      </Button>
                    </div>
                  )}

                  {request.status !== 'pending' && request.reviewed_at && (
                    <p className="text-xs text-gray-400">
                      تمت المراجعة في: {new Date(request.reviewed_at).toLocaleDateString('ar')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRequestsManager;
