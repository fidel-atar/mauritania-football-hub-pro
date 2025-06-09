
import React from 'react';
import { User, ShoppingCart, Shield, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import CartSheet from '@/components/shop/CartSheet';

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
  const handleUserTypeSelect = (userType: string) => {
    if (userType === 'admin-principal' || userType === 'mini-admin') {
      // For admin types, we need to trigger admin login
      window.dispatchEvent(new CustomEvent('openAdminLogin', { detail: userType }));
    } else {
      // For regular user
      onShowAuth();
    }
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
      <DropdownMenuContent className="w-48 bg-white border shadow-lg z-50">
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
        
        {/* Connexion Section */}
        {user ? (
          <DropdownMenuItem 
            onClick={onSignOut}
            className="cursor-pointer hover:bg-gray-100"
          >
            <User className="w-4 h-4 mr-2" />
            Se déconnecter
          </DropdownMenuItem>
        ) : (
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer hover:bg-gray-100">
              <User className="w-4 h-4 mr-2" />
              Connexion
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="bg-white border shadow-lg z-50">
              <DropdownMenuItem 
                onClick={() => handleUserTypeSelect('utilisateur')}
                className="cursor-pointer hover:bg-gray-100"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Utilisateur
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleUserTypeSelect('admin-principal')}
                className="cursor-pointer hover:bg-gray-100 text-red-600"
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin Principal
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleUserTypeSelect('mini-admin')}
                className="cursor-pointer hover:bg-gray-100 text-orange-600"
              >
                <Shield className="w-4 h-4 mr-2" />
                Mini Admin
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )}
        
        <DropdownMenuSeparator />
        
        {/* Compt Section */}
        <DropdownMenuItem 
          onClick={onShowProfile}
          className="cursor-pointer hover:bg-gray-100"
        >
          <User className="w-4 h-4 mr-2" />
          Compt
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
