
import { supabase } from "@/integrations/supabase/client";

export const addMoroccanTeams = async () => {
  const teams = [
    { name: "Al Hilal", position: 1 },
    { name: "Nouadhibou", position: 2 },
    { name: "Chemal", position: 3 },
    { name: "Nouakchott Kinga", position: 4 },
    { name: "AS Douane", position: 5 },
    { name: "Al Merreikh", position: 6 },
    { name: "Tevragh-Zeina", position: 7 },
    { name: "Pompiers", position: 8 },
    { name: "Inter Nouakchott", position: 9 },
    { name: "Moderne Kaédi", position: 10 },
    { name: "Gendrim", position: 11 },
    { name: "SNIM", position: 12 },
    { name: "Nzidane", position: 13 },
    { name: "Ksar", position: 14 },
    { name: "Garde Nationale", position: 15 },
    { name: "Touldé", position: 16 }
  ];

  try {
    console.log('Adding Moroccan teams to database...');
    
    for (const team of teams) {
      const { error } = await supabase
        .from('teams')
        .insert({
          name: team.name,
          logo: null,
          stadium: null,
          description: null,
          coach: null,
          founded_year: null
        });
      
      if (error) {
        console.error(`Error adding team ${team.name}:`, error);
      } else {
        console.log(`Successfully added team: ${team.name}`);
      }
    }
    
    console.log('All teams added successfully!');
    return true;
  } catch (error) {
    console.error('Error adding teams:', error);
    return false;
  }
};
