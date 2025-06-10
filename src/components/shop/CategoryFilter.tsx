
import React from "react";
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string | undefined;
  onCategoryChange: (category: string | undefined) => void;
}

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) => {
  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={activeCategory === undefined ? "default" : "outline"}
        size="sm"
        onClick={() => onCategoryChange(undefined)}
        className={activeCategory === undefined ? "bg-fmf-green hover:bg-fmf-green/90" : ""}
      >
        Tous
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className={activeCategory === category ? "bg-fmf-green hover:bg-fmf-green/90" : ""}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
