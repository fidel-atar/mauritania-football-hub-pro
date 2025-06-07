
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Calendar, X } from "lucide-react";
import { Label } from "@/components/ui/label";

interface LocalSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  dateFilter?: {
    start?: string;
    end?: string;
  };
  onDateFilterChange?: (filter: { start?: string; end?: string }) => void;
  placeholder?: string;
  showDateFilter?: boolean;
  resultCount?: number;
  totalCount?: number;
}

const LocalSearchBar: React.FC<LocalSearchBarProps> = ({
  searchQuery,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  placeholder = "Rechercher...",
  showDateFilter = false,
  resultCount,
  totalCount
}) => {
  const clearSearch = () => {
    onSearchChange("");
    if (onDateFilterChange) {
      onDateFilterChange({});
    }
  };

  const hasActiveFilters = searchQuery || dateFilter?.start || dateFilter?.end;

  return (
    <div className="space-y-4 mb-6 p-4 border rounded-lg bg-gray-50">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {showDateFilter && onDateFilterChange && (
          <div className="flex gap-2 items-center">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div className="flex gap-2">
              <div>
                <Label className="text-xs text-gray-600">Du</Label>
                <Input
                  type="date"
                  value={dateFilter?.start || ""}
                  onChange={(e) => onDateFilterChange({
                    ...dateFilter,
                    start: e.target.value
                  })}
                  className="w-32"
                />
              </div>
              <div>
                <Label className="text-xs text-gray-600">Au</Label>
                <Input
                  type="date"
                  value={dateFilter?.end || ""}
                  onChange={(e) => onDateFilterChange({
                    ...dateFilter,
                    end: e.target.value
                  })}
                  className="w-32"
                />
              </div>
            </div>
          </div>
        )}

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearSearch}
            className="self-start sm:self-center"
          >
            <X className="h-4 w-4 mr-1" />
            Effacer
          </Button>
        )}
      </div>

      {(resultCount !== undefined && totalCount !== undefined) && (
        <div className="text-sm text-gray-600">
          {hasActiveFilters ? (
            <span>
              <strong>{resultCount}</strong> résultat(s) sur <strong>{totalCount}</strong> au total
              {searchQuery && <span> pour "{searchQuery}"</span>}
            </span>
          ) : (
            <span><strong>{totalCount}</strong> élément(s) au total</span>
          )}
        </div>
      )}
    </div>
  );
};

export default LocalSearchBar;
