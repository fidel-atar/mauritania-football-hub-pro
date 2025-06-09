
import React from 'react';
import { User, ShoppingCart } from 'lucide-react';
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
          <DropdownMenuItem 
            onClick={onShowAuth}
            className="cursor-pointer hover:bg-gray-100"
          >
            <User className="w-4 h-4 mr-2" />
            Connexion
          </DropdownMenuItem>
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
