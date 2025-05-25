
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface AdBannerProps {
  title: string;
  description: string;
  image: string;
  link: string;
  type: "banner" | "sidebar" | "inline";
}

const AdBanner = ({ title, description, image, link, type }: AdBannerProps) => {
  const handleClick = () => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const getAdClass = () => {
    switch (type) {
      case "banner":
        return "w-full h-24 flex-row";
      case "sidebar":
        return "w-full h-32 flex-col";
      case "inline":
        return "w-full h-20 flex-row";
      default:
        return "w-full h-24 flex-row";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
      <CardContent className="p-0">
        <div className={`flex ${getAdClass()} items-center`} onClick={handleClick}>
          <img 
            src={image} 
            alt={title} 
            className={`${type === "banner" || type === "inline" ? "w-20 h-full" : "w-full h-16"} object-cover ${type === "banner" || type === "inline" ? "rounded-l-lg" : "rounded-t-lg"}`}
          />
          <div className="p-3 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm text-gray-800">{title}</h4>
                <p className="text-xs text-gray-600 mt-1">{description}</p>
              </div>
              <ExternalLink size={16} className="text-gray-400" />
            </div>
            <div className="text-xs text-yellow-600 mt-1 font-medium">Publicité</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdBanner;
