
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Calendar, 
  Trophy, 
  BarChart3, 
  Settings,
  ShieldCheck,
  UserPlus
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import AdminTeamsPanel from "@/components/admin/AdminTeamsPanel";
import AdminPlayersManager from "@/components/admin/AdminPlayersManager";
import AdminMatchesPanel from "@/components/admin/matches/AdminMatchesPanel";
import AdminNewsManager from "@/components/admin/AdminNewsManager";
import AdminStandingsManager from "@/components/admin/AdminStandingsManager";
import AdminProductsManager from "@/components/admin/AdminProductsManager";
import AdminRequestsManager from "@/components/admin/AdminRequestsManager";

type AdminSection = 
  | 'overview'
  | 'teams'
  | 'players'
  | 'matches'
  | 'news'
  | 'standings'
  | 'products'
  | 'requests';

const AdminDashboard = () => {
  const { user, isAdmin, adminRole } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-6 text-center">
            <p>ليس لديك صلاحية للوصول إلى هذه الصفحة</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getRoleLabel = () => {
    if (adminRole === 'super_admin') return 'المدير الكبير';
    if (adminRole === 'manager') return 'مدير المباريات والفرق';
    return 'إداري';
  };

  const canManage = (section: string) => {
    if (adminRole === 'super_admin') return true;
    if (adminRole === 'manager') {
      return ['teams', 'players', 'matches'].includes(section);
    }
    return false;
  };

  const menuItems = [
    { id: 'overview', label: 'نظرة عامة', icon: BarChart3, allowed: true },
    { id: 'teams', label: 'الفرق', icon: Users, allowed: canManage('teams') },
    { id: 'players', label: 'اللاعبون', icon: UserPlus, allowed: canManage('players') },
    { id: 'matches', label: 'المباريات', icon: Calendar, allowed: canManage('matches') },
    { id: 'news', label: 'الأخبار', icon: Settings, allowed: adminRole === 'super_admin' },
    { id: 'standings', label: 'الترتيب', icon: Trophy, allowed: adminRole === 'super_admin' },
    { id: 'products', label: 'المنتجات', icon: Settings, allowed: adminRole === 'super_admin' },
    { id: 'requests', label: 'طلبات الصلاحيات', icon: ShieldCheck, allowed: adminRole === 'super_admin' },
  ];

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'teams':
        return <AdminTeamsPanel />;
      case 'players':
        return <AdminPlayersManager />;
      case 'matches':
        return <AdminMatchesPanel />;
      case 'news':
        return <AdminNewsManager />;
      case 'standings':
        return <AdminStandingsManager />;
      case 'products':
        return <AdminProductsManager />;
      case 'requests':
        return <AdminRequestsManager />;
      default:
        return (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  مرحباً {getRoleLabel()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {user.email}
                </p>
                <Badge variant="default" className="mt-2">
                  {adminRole}
                </Badge>
              </CardContent>
            </Card>

            {canManage('teams') && (
              <Card className="cursor-pointer hover:bg-gray-50" onClick={() => setActiveSection('teams')}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    إدارة الفرق
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">إضافة وتعديل الفرق</p>
                </CardContent>
              </Card>
            )}

            {canManage('players') && (
              <Card className="cursor-pointer hover:bg-gray-50" onClick={() => setActiveSection('players')}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserPlus className="w-5 h-5 mr-2" />
                    إدارة اللاعبين
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">إضافة وتعديل اللاعبين</p>
                </CardContent>
              </Card>
            )}

            {canManage('matches') && (
              <Card className="cursor-pointer hover:bg-gray-50" onClick={() => setActiveSection('matches')}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    إدارة المباريات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">جدولة وإدارة المباريات</p>
                </CardContent>
              </Card>
            )}

            {adminRole === 'super_admin' && (
              <Card className="cursor-pointer hover:bg-gray-50" onClick={() => setActiveSection('requests')}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShieldCheck className="w-5 h-5 mr-2" />
                    طلبات الصلاحيات
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">مراجعة طلبات الصلاحيات الإدارية</p>
                </CardContent>
              </Card>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r min-h-screen p-4">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-fmf-green mb-4">لوحة التحكم</h2>
            {menuItems.filter(item => item.allowed).map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activeSection === item.id ? 'bg-fmf-green hover:bg-fmf-green/90' : ''
                }`}
                onClick={() => setActiveSection(item.id as AdminSection)}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {renderActiveSection()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
