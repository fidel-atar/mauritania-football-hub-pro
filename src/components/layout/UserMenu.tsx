
import React from 'react';
import { User, ShoppingCart, Shield, UserCheck, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import CartSheet from '@/components/shop/CartSheet';
import { useAuth } from '@/contexts/AuthContext';

interface UserMenuProps {
  user: any;
  totalItems: number;
  isLoading: boolean;
  onSignOut: () => void;
  onShowAuth: () => void;
  onShowProfile: () => void;
}

const UserMenu = ({ 
  user, 
  totalItems, 
  isLoading, 
  onSignOut, 
  onShowAuth, 
  onShowProfile 
}: UserMenuProps) => {
  const { isAdmin, adminRole } = useAuth();

  const getRoleLabel = () => {
    if (adminRole === 'super_admin') return 'المدير الكبير';
    if (adminRole === 'manager') return 'مدير';
    if (isAdmin) return 'إداري';
    return 'مستخدم';
  };

  const handleSignOut = async () => {
    console.log('UserMenu: Sign out button clicked');
    await onSignOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <User className="w-4 h-4" />
          {!isLoading && totalItems > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs"
            >
              {totalItems > 99 ? '99+' : totalItems}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-white border shadow-lg z-50">
        {user && (
          <>
            <div className="px-3 py-2 border-b">
              <p className="text-sm font-medium">{user.email}</p>
              <p className="text-xs text-gray-500">{getRoleLabel()}</p>
            </div>
            <DropdownMenuSeparator />
          </>
        )}

        {/* Cart Section */}
        <CartSheet>
          <DropdownMenuItem className="cursor-pointer hover:bg-gray-100">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Panier
            {!isLoading && totalItems > 0 && (
              <Badge 
                variant="destructive" 
                className="ml-auto w-5 h-5 flex items-center justify-center p-0 text-xs"
              >
                {totalItems > 99 ? '99+' : totalItems}
              </Badge>
            )}
          </DropdownMenuItem>
        </CartSheet>
        
        <DropdownMenuSeparator />
        
        {/* User Actions */}
        {user ? (
          <>
            <DropdownMenuItem 
              onClick={onShowProfile}
              className="cursor-pointer hover:bg-gray-100"
            >
              <Settings className="w-4 h-4 mr-2" />
              Compte
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              onClick={handleSignOut}
              className="cursor-pointer hover:bg-gray-100 text-red-600"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Se déconnecter
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem 
            onClick={onShowAuth}
            className="cursor-pointer hover:bg-gray-100"
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Connexion
          </DropdownMenuItem>
        )}
        
        {/* Admin Section */}
        {user && isAdmin && adminRole === 'super_admin' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => window.location.href = '/admin-dashboard'}
              className="cursor-pointer hover:bg-gray-100 text-fmf-green"
            >
              <Shield className="w-4 h-4 mr-2" />
              لوحة التحكم الإدارية
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
