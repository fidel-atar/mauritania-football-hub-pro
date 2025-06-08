
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Sample data for teams
const sampleTeams = [
  {
    name: "FC Nouakchott",
    logo: "/lovable-uploads/68710224-6f46-49c9-b634-136af2bbdd99.png",
    stadium: "Stade Olympique de Nouakchott",
    founded_year: 1978,
    coach: "Ahmed Ould Mohamed",
    description: "Club de football basé à Nouakchott, champion en titre."
  },
  {
    name: "ASC Salam",
    logo: "/lovable-uploads/68710224-6f46-49c9-b634-136af2bbdd99.png",
    stadium: "Stade Municipal de Salam",
    founded_year: 1985,
    coach: "Omar Ba",
    description: "Équipe traditionnelle de Nouakchott avec une riche histoire."
  },
  {
    name: "Garde Nationale",
    logo: "/lovable-uploads/68710224-6f46-49c9-b634-136af2bbdd99.png",
    stadium: "Stade de la Garde",
    founded_year: 1960,
    coach: "Abdellahi Sow",
    description: "Club militaire reconnu pour sa discipline et son engagement."
  },
  {
    name: "ACS Ksar",
    logo: "/lovable-uploads/68710224-6f46-49c9-b634-136af2bbdd99.png",
    stadium: "Stade de Ksar",
    founded_year: 1972,
    coach: "Mohamed Vall",
    description: "Équipe représentant la région de Ksar avec fierté."
  }
];

// Sample data for products
const sampleProducts = [
  {
    name: "Maillot FC Nouakchott Domicile",
    description: "Maillot officiel de l'équipe à domicile, saison 2024-25",
    price: 15000,
    category: "Maillots",
    image: "/lovable-uploads/68710224-6f46-49c9-b634-136af2bbdd99.png",
    in_stock: true
  },
  {
    name: "Écharpe Super D1",
    description: "Écharpe officielle du championnat Super D1",
    price: 5000,
    category: "Accessoires",
    image: "/lovable-uploads/68710224-6f46-49c9-b634-136af2bbdd99.png",
    in_stock: true
  },
  {
    name: "Ballon Officiel Super D1",
    description: "Ballon de match utilisé dans le championnat",
    price: 25000,
    category: "Équipement",
    image: "/lovable-uploads/68710224-6f46-49c9-b634-136af2bbdd99.png",
    in_stock: true
  },
  {
    name: "Casquette Super D1",
    description: "Casquette officielle avec logo du championnat",
    price: 8000,
    category: "Accessoires",
    image: "/lovable-uploads/68710224-6f46-49c9-b634-136af2bbdd99.png",
    in_stock: true
  }
];

// Sample news articles
const sampleNews = [
  {
    title: "FC Nouakchott remporte le derby face à ASC Salam",
    content: "Dans un match spectaculaire au Stade Olympique, FC Nouakchott s'impose 3-1 face à ASC Salam. Les buts ont été marqués par Abdellahi (15'), Mohamed (32') et Omar (78') pour FC Nouakchott, tandis qu'ASC Salam a réduit le score par Yahya (65').",
    category: "Résultats",
    author: "Journaliste Super D1",
    image: "/lovable-uploads/68710224-6f46-49c9-b634-136af2bbdd99.png",
    published: true
  },
  {
    title: "Nouveau record d'affluence pour la Super D1",
    content: "Le championnat Super D1 bat tous les records avec plus de 15 000 spectateurs présents lors du dernier match. Cette affluence exceptionnelle témoigne de l'engouement croissant pour le football mauritanien.",
    category: "Actualités",
    author: "Journaliste Super D1",
    image: "/lovable-uploads/68710224-6f46-49c9-b634-136af2bbdd99.png",
    published: true
  },
  {
    title: "Préparation intensive pour la finale de coupe",
    content: "Les équipes finalistes intensifient leurs entraînements en vue de la grande finale prévue le 30 mai au Stade Olympique. Les supporters sont invités à venir nombreux encourager leurs équipes favorites.",
    category: "Coupe",
    author: "Journaliste Super D1",
    image: "/lovable-uploads/68710224-6f46-49c9-b634-136af2bbdd99.png",
    published: true
  }
];

export const loadSampleData = async () => {
  try {
    toast.info("Chargement des données d'exemple...");

    // Load teams
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .upsert(sampleTeams, { onConflict: 'name' })
      .select();

    if (teamsError) {
      console.error('Error loading teams:', teamsError);
      return;
    }

    console.log('Teams loaded:', teams);

    // Load products
    const { error: productsError } = await supabase
      .from('products')
      .upsert(sampleProducts, { onConflict: 'name' });

    if (productsError) {
      console.error('Error loading products:', productsError);
      return;
    }

    // Load news
    const { error: newsError } = await supabase
      .from('news')
      .upsert(sampleNews, { onConflict: 'title' });

    if (newsError) {
      console.error('Error loading news:', newsError);
      return;
    }

    // Create sample matches if teams were loaded successfully
    if (teams && teams.length >= 4) {
      const sampleMatches = [
        {
          home_team_id: teams[0].id,
          away_team_id: teams[1].id,
          match_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          stadium: "Stade Olympique de Nouakchott",
          status: 'scheduled'
        },
        {
          home_team_id: teams[2].id,
          away_team_id: teams[3].id,
          match_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          stadium: "Stade de la Garde",
          status: 'finished',
          home_score: 2,
          away_score: 1
        },
        {
          home_team_id: teams[1].id,
          away_team_id: teams[2].id,
          match_date: new Date().toISOString(),
          stadium: "Stade Municipal de Salam",
          status: 'live',
          home_score: 1,
          away_score: 0
        }
      ];

      const { data: matches, error: matchesError } = await supabase
        .from('matches')
        .upsert(sampleMatches)
        .select();

      if (matchesError) {
        console.error('Error loading matches:', matchesError);
        return;
      }

      console.log('Matches loaded:', matches);

      // Create sample players for each team
      const samplePlayers = [];
      teams.forEach((team, teamIndex) => {
        for (let i = 1; i <= 5; i++) {
          samplePlayers.push({
            name: `Joueur ${i} ${team.name.split(' ')[0]}`,
            number: i,
            position: i === 1 ? 'Gardien' : i <= 3 ? 'Défenseur' : i === 4 ? 'Milieu' : 'Attaquant',
            age: 20 + Math.floor(Math.random() * 15),
            nationality: 'Mauritanienne',
            team_id: team.id,
            goals: Math.floor(Math.random() * 10),
            assists: Math.floor(Math.random() * 5),
            matches: 10 + Math.floor(Math.random() * 15)
          });
        }
      });

      const { error: playersError } = await supabase
        .from('players')
        .upsert(samplePlayers, { onConflict: 'team_id,number' });

      if (playersError) {
        console.error('Error loading players:', playersError);
        return;
      }

      // Create sample standings
      const sampleStandings = teams.map((team, index) => ({
        team_id: team.id,
        position: index + 1,
        matches_played: 10 + Math.floor(Math.random() * 5),
        wins: 5 + Math.floor(Math.random() * 5),
        draws: Math.floor(Math.random() * 3),
        losses: Math.floor(Math.random() * 3),
        goals_for: 15 + Math.floor(Math.random() * 15),
        goals_against: 8 + Math.floor(Math.random() * 10),
        points: (5 + Math.floor(Math.random() * 5)) * 3 + Math.floor(Math.random() * 3),
        season: '2024-25'
      }));

      const { error: standingsError } = await supabase
        .from('standings')
        .upsert(sampleStandings, { onConflict: 'team_id,season' });

      if (standingsError) {
        console.error('Error loading standings:', standingsError);
        return;
      }

      // Add match events for finished match
      if (matches && matches.length > 0) {
        const finishedMatch = matches.find(m => m.status === 'finished');
        if (finishedMatch) {
          const { data: matchPlayers } = await supabase
            .from('players')
            .select('id, team_id')
            .in('team_id', [finishedMatch.home_team_id, finishedMatch.away_team_id])
            .limit(4);

          if (matchPlayers && matchPlayers.length >= 2) {
            const sampleEvents = [
              {
                match_id: finishedMatch.id,
                player_id: matchPlayers[0].id,
                event_type: 'goal',
                minute: 23,
                description: 'But magnifique sur corner'
              },
              {
                match_id: finishedMatch.id,
                player_id: matchPlayers[1].id,
                event_type: 'goal',
                minute: 67,
                description: 'But égalisateur'
              },
              {
                match_id: finishedMatch.id,
                player_id: matchPlayers[0].id,
                event_type: 'goal',
                minute: 85,
                description: 'But de la victoire'
              }
            ];

            const { error: eventsError } = await supabase
              .from('match_events')
              .upsert(sampleEvents);

            if (eventsError) {
              console.error('Error loading match events:', eventsError);
            }
          }
        }
      }
    }

    toast.success("Données d'exemple chargées avec succès!");
    
  } catch (error) {
    console.error('Error loading sample data:', error);
    toast.error("Erreur lors du chargement des données d'exemple");
  }
};
