
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GoogleAuthButton from './GoogleAuthButton';
import AppleAuthButton from './AppleAuthButton';
import RoleBasedAuth from './RoleBasedAuth';

interface UserAuthProps {
  userType?: 'user' | 'admin';
  onAuthSuccess?: () => void;
}

const UserAuth = ({ userType = 'user', onAuthSuccess }: UserAuthProps) => {
  const [showRoleAuth, setShowRoleAuth] = useState(false);

  if (showRoleAuth) {
    return <RoleBasedAuth />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl font-bold text-fmf-green">
              FMF - Mauritanie
            </CardTitle>
            <p className="text-center text-gray-600">
              {userType === 'admin' ? 'دخول المديرين' : 'مرحباً بك'}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="social" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="social">وسائل التواصل</TabsTrigger>
                <TabsTrigger value="role">طلب صلاحيات</TabsTrigger>
              </TabsList>
              
              <TabsContent value="social" className="space-y-4">
                <div className="space-y-3">
                  <GoogleAuthButton userType="user" />
                  <AppleAuthButton userType="user" />
                </div>
                
                <div className="text-center text-sm text-gray-500">
                  أو
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setShowRoleAuth(true)}
                  className="w-full"
                >
                  دخول كإداري
                </Button>
              </TabsContent>
              
              <TabsContent value="role" className="space-y-4">
                <Button
                  onClick={() => setShowRoleAuth(true)}
                  className="w-full bg-fmf-green hover:bg-fmf-green/90"
                >
                  طلب صلاحيات إدارية
                </Button>
                
                <p className="text-xs text-gray-500 text-center">
                  يمكنك طلب صلاحيات إدارية إذا كنت مؤهلاً لذلك
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserAuth;
