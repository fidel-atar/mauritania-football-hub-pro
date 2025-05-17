
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type StaffMember = {
  id: number;
  name: string;
  role: string;
  image: string;
  info: {
    age: number;
    experience: string;
    previousClubs?: string;
    specialization?: string;
    [key: string]: any;
  };
};

interface TeamStaffTabProps {
  staff: StaffMember[];
}

const TeamStaffTab = ({ staff }: TeamStaffTabProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">Staff technique</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map(person => (
          <Card key={person.id}>
            <CardContent className="p-4">
              <div className="flex flex-col items-center text-center">
                <img src={person.image} alt={person.name} className="w-24 h-24 rounded-full mb-3" />
                <h3 className="font-bold">{person.name}</h3>
                <p className="text-gray-600">{person.role}</p>
                
                <Separator className="my-3" />
                
                <div className="text-sm text-left w-full">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Âge:</span>
                    <span>{person.info.age} ans</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Expérience:</span>
                    <span>{person.info.experience}</span>
                  </div>
                  {person.info.previousClubs && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Clubs précédents:</span>
                      <span>{person.info.previousClubs}</span>
                    </div>
                  )}
                  {person.info.specialization && (
                    <div className="flex flex-col">
                      <span className="text-gray-600">Spécialisation:</span>
                      <span className="text-right">{person.info.specialization}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TeamStaffTab;
