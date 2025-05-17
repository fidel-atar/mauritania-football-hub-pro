
// Mock data for players with enhanced statistics
export const mockPlayers = [
  { id: 1, name: "Mohamed Diallo", position: "Gardien", number: 1, age: 28, nationality: "Mauritanie", image: "https://placehold.co/200x200/006847/FFF?text=MD", 
    stats: { matches: 22, cleanSheets: 8, saves: 67, assists: 1, yellowCards: 2, redCards: 0 } 
  },
  { id: 2, name: "Ahmed Camara", position: "Défenseur", number: 4, age: 25, nationality: "Mauritanie", image: "https://placehold.co/200x200/006847/FFF?text=AC",
    stats: { matches: 20, goals: 1, assists: 3, tackles: 45, yellowCards: 5, redCards: 0 }
  },
  { id: 3, name: "Ibrahim Sow", position: "Défenseur", number: 5, age: 27, nationality: "Mauritanie", image: "https://placehold.co/200x200/006847/FFF?text=IS",
    stats: { matches: 18, goals: 0, assists: 2, tackles: 38, yellowCards: 3, redCards: 1 }
  },
  { id: 4, name: "Oumar Thiam", position: "Milieu", number: 8, age: 23, nationality: "Mauritanie", image: "https://placehold.co/200x200/006847/FFF?text=OT",
    stats: { matches: 21, goals: 3, assists: 7, passAccuracy: "87%", yellowCards: 4, redCards: 0 }
  },
  { id: 5, name: "Aboubacar Sy", position: "Attaquant", number: 9, age: 24, nationality: "Mauritanie", image: "https://placehold.co/200x200/006847/FFF?text=AS",
    stats: { matches: 19, goals: 12, assists: 5, shotsOnTarget: 28, yellowCards: 2, redCards: 0 }
  },
  { id: 6, name: "Mamadou Ba", position: "Attaquant", number: 10, age: 22, nationality: "Mauritanie", image: "https://placehold.co/200x200/006847/FFF?text=MB",
    stats: { matches: 22, goals: 8, assists: 10, shotsOnTarget: 23, yellowCards: 3, redCards: 0 }
  },
];

// Mock data for staff
export const mockStaff = [
  { id: 1, name: "Abdoulaye Kane", role: "Entraîneur Principal", image: "https://placehold.co/200x200/006847/FFF?text=AK", 
    info: { age: 52, experience: "15 ans", previousClubs: "FC Nouakchott, AS Ksar" } 
  },
  { id: 2, name: "Omar Diop", role: "Assistant", image: "https://placehold.co/200x200/006847/FFF?text=OD",
    info: { age: 43, experience: "8 ans", previousClubs: "Tevragh-Zeina FC" } 
  },
  { id: 3, name: "Moussa Fall", role: "Préparateur Physique", image: "https://placehold.co/200x200/006847/FFF?text=MF",
    info: { age: 38, experience: "12 ans", specialization: "Conditionnement physique et récupération" } 
  },
];

// Mock matches for the team with more details
export const mockMatches = [
  { 
    id: 1, 
    opponent: "FC Nouakchott", 
    date: "2023-05-18T19:30:00", 
    home: false, 
    result: "1-2", 
    win: false,
    stats: { possession: "45%", shots: 8, shotsOnTarget: 3, corners: 5, fouls: 12 },
    highlights: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  { 
    id: 2, 
    opponent: "AS Ksar", 
    date: "2023-05-05T17:00:00", 
    home: true, 
    result: "2-0", 
    win: true,
    stats: { possession: "58%", shots: 14, shotsOnTarget: 6, corners: 7, fouls: 9 },
    highlights: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  { 
    id: 3, 
    opponent: "Tevragh-Zeina FC", 
    date: "2023-04-22T18:30:00", 
    home: true, 
    result: "1-1", 
    win: null,
    stats: { possession: "50%", shots: 10, shotsOnTarget: 4, corners: 6, fouls: 11 },
    highlights: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
  },
  { 
    id: 4, 
    opponent: "Nouadhibou FC", 
    date: "2023-06-02T20:00:00", 
    home: false, 
    result: null, 
    win: null,
    stats: null,
    highlights: null
  },
];
