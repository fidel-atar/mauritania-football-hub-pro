
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

interface TeamAchievementsTabProps {
  teamName: string;
}

const TeamAchievementsTab = ({ teamName }: TeamAchievementsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Palmarès de {teamName}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <Trophy className="text-amber-500" />
            <div>
              <p className="font-bold">Super D1 - Champion</p>
              <p className="text-sm text-gray-600">2019, 2021</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Trophy className="text-gray-500" />
            <div>
              <p className="font-bold">Coupe du Président - Finaliste</p>
              <p className="text-sm text-gray-600">2018, 2022</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Trophy className="text-amber-800" />
            <div>
              <p className="font-bold">Supercoupe de Mauritanie</p>
              <p className="text-sm text-gray-600">2021</p>
            </div>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default TeamAchievementsTab;
