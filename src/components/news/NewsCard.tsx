
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";

interface NewsCardProps {
  title: string;
  summary: string;
  date: string;
  image: string;
}

const NewsCard = ({ title, summary, date, image }: NewsCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="p-0">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-32 object-cover rounded-t-lg"
        />
        <div className="p-4">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <Calendar size={14} className="mr-1" />
            {new Date(date).toLocaleDateString()}
          </div>
          <h3 className="font-bold text-sm mb-2">{title}</h3>
          <p className="text-xs text-gray-600">{summary}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
