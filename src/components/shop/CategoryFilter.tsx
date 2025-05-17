
import React from "react";
import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string | undefined;
  onSelectCategory: (category: string | undefined) => void;
}

const CategoryFilter = ({
  categories,
  activeCategory,
  onSelectCategory,
}: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={activeCategory === undefined ? "default" : "outline"}
        onClick={() => onSelectCategory(undefined)}
        className={activeCategory === undefined ? "bg-fmf-green hover:bg-fmf-green/90" : ""}
      >
        Tous
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          onClick={() => onSelectCategory(category)}
          className={activeCategory === category ? "bg-fmf-green hover:bg-fmf-green/90" : ""}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
