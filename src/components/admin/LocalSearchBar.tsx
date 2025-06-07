
import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface LocalSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
  resultCount?: number;
  totalCount?: number;
}

const LocalSearchBar: React.FC<LocalSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  placeholder = "Rechercher...",
  resultCount,
  totalCount
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="mb-4 md:mb-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={`pl-10 ${isMobile ? 'h-12 text-base' : 'h-10'} bg-white border-gray-200 focus:border-fmf-green focus:ring-fmf-green`}
        />
      </div>
      
      {(resultCount !== undefined && totalCount !== undefined) && (
        <div className="mt-2 text-xs md:text-sm text-gray-600">
          {searchQuery ? (
            <span>
              {resultCount} résultat{resultCount !== 1 ? 's' : ''} sur {totalCount}
            </span>
          ) : (
            <span>{totalCount} élément{totalCount !== 1 ? 's' : ''} au total</span>
          )}
        </div>
      )}
    </div>
  );
};

export default LocalSearchBar;
