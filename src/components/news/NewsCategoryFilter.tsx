
import React from "react";
import { Button } from "@/components/ui/button";

interface NewsCategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const NewsCategoryFilter = ({ categories, selectedCategory, onCategoryChange }: NewsCategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category)}
          className={selectedCategory === category ? "bg-fmf-green hover:bg-fmf-green/90" : ""}
        >
          {category}
        </Button>
      ))}
    </div>
  );
};

export default NewsCategoryFilter;
