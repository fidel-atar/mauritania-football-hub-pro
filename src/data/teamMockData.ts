
// Mock data for players with enhanced statistics and better photos
export const mockPlayers = [
  { id: 1, name: "Amadou Sow", position: "Gardien", number: 1, age: 29, nationality: "Mauritanie", image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=200&h=200&fit=crop&crop=faces", 
    stats: { matches: 24, cleanSheets: 11, saves: 89, assists: 2, yellowCards: 1, redCards: 0 } 
  },
  { id: 2, name: "Cheikh Ahmed Vall", position: "Gardien", number: 12, age: 26, nationality: "Mauritanie", image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=200&h=200&fit=crop&crop=faces",
    stats: { matches: 8, cleanSheets: 3, saves: 34, assists: 0, yellowCards: 0, redCards: 0 }
  },
  { id: 3, name: "Mohamed Lemine Ba", position: "Défenseur", number: 2, age: 27, nationality: "Mauritanie", image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=200&h=200&fit=crop&crop=faces",
    stats: { matches: 22, goals: 2, assists: 4, tackles: 52, yellowCards: 6, redCards: 0 }
  },
  { id: 4, name: "El Hacen Diallo", position: "Défenseur", number: 3, age: 25, nationality: "Mauritanie", image: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=200&h=200&fit=crop&crop=faces",
    stats: { matches: 20, goals: 1, assists: 3, tackles: 45, yellowCards: 4, redCards: 1 }
  },
  { id: 5, name: "Abdallahi Mahmoud", position: "Défenseur", number: 4, age: 28, nationality: "Mauritanie", image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=200&h=200&fit=crop&crop=faces",
    stats: { matches: 19, goals: 0, assists: 2, tackles: 41, yellowCards: 3, redCards: 0 }
  },
  { id: 6, name: "Oumar Camara", position: "Défenseur", number: 5, age: 24, nationality: "Mauritanie", image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=200&h=200&fit=crop&crop=faces",
    stats: { matches: 18, goals: 1, assists: 1, tackles: 38, yellowCards: 5, redCards: 0 }
  },
  { id: 7, name: "Ahmed Salem Ghaber", position: "Milieu", number: 6, age: 26, nationality: "Mauritanie", image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=200&h=200&fit=crop&crop=faces",
    stats: { matches: 23, goals: 4, assists: 8, passAccuracy: "89%", yellowCards: 3, redCards: 0 }
  },
  { id: 8, name: "Souleymane Doukouré", position: "Milieu", number: 8, age: 23, nationality: "Mauritanie", image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=200&h=200&fit=crop&crop=faces",
    stats: { matches: 21, goals: 3, assists: 7, passAccuracy: "87%", yellowCards: 4, redCards: 0 }
  },
  { id: 9, name: "Mohamedou Ould Ahmed", position: "Milieu", number: 10, age: 25, nationality: "Mauritanie", image: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=200&h=200&fit=crop&crop=faces",
    stats: { matches: 22, goals: 6, assists: 12, passAccuracy: "91%", yellowCards: 2, redCards: 0 }
  },
  { id: 10, name: "Brahim Thalil", position: "Milieu", number: 14, age: 22, nationality: "Mauritanie", image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=200&h=200&fit=crop&crop=faces",
    stats: { matches: 16, goals: 2, assists: 5, passAccuracy: "84%", yellowCards: 3, redCards: 0 }
  },
  { id: 11, name: "Yacoub Sall", position: "Attaquant", number: 7, age: 24, nationality: "Mauritanie", image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=200&h=200&fit=crop&crop=faces",
    stats: { matches: 20, goals: 9, assists: 6, shotsOnTarget: 32, yellowCards: 2, redCards: 0 }
  },
  { id: 12, name: "Abdoulaye Cissé", position: "Attaquant", number: 9, age: 27, nationality: "Mauritanie", image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=200&h=200&fit=crop&crop=faces",
    stats: { matches: 23, goals: 15, assists: 4, shotsOnTarget: 41, yellowCards: 1, redCards: 0 }
  },
  { id: 13, name: "Mohamed Vall Amar", position: "Attaquant", number: 11, age: 21, nationality: "Mauritanie", image: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d?w=200&h=200&fit=crop&crop=faces",
    stats: { matches: 18, goals: 7, assists: 8, shotsOnTarget: 25, yellowCards: 1, redCards: 0 }
  },
  { id: 14, name: "Isselmou Dia", position: "Attaquant", number: 21, age: 23, nationality: "Mauritanie", image: "https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=200&h=200&fit=crop&crop=faces",
    stats: { matches: 15, goals: 5, assists: 3, shotsOnTarget: 18, yellowCards: 2, redCards: 0 }
  },
];

// Mock data for staff with enhanced information
export const mockStaff = [
  { id: 1, name: "Abdallah Ould Bah", role: "Entraîneur Principal", image: "https://placehold.co/200x200/006847/FFF?text=AOB", 
    info: { age: 54, experience: "18 ans", previousClubs: "FC Nouakchott, AS Garde, Tevragh-Zeina FC", certifications: "Licence CAF A" } 
  },
  { id: 2, name: "Mohamed Ould Cheikh", role: "Entraîneur Adjoint", image: "https://placehold.co/200x200/006847/FFF?text=MOC",
    info: { age: 45, experience: "12 ans", previousClubs: "AS Ksar, Nouadhibou FC", certifications: "Licence CAF B" } 
  },
  { id: 3, name: "Cheikh Sidiya Kane", role: "Préparateur Physique", image: "https://placehold.co/200x200/006847/FFF?text=CSK",
    info: { age: 39, experience: "14 ans", specialization: "Préparation physique et récupération", education: "Master en Sciences du Sport" } 
  },
  { id: 4, name: "Ahmed Salem Bouh", role: "Entraîneur des Gardiens", image: "https://placehold.co/200x200/006847/FFF?text=ASB",
    info: { age: 41, experience: "10 ans", previousClubs: "FC Nouakchott", specialization: "Formation des gardiens de but" } 
  },
  { id: 5, name: "Mariem Mint Abdallahi", role: "Kinésithérapeute", image: "https://placehold.co/200x200/006847/FFF?text=MMA",
    info: { age: 35, experience: "8 ans", education: "Doctorat en Kinésithérapie", specialization: "Rééducation et prévention des blessures" } 
  },
  { id: 6, name: "El Moustapha Ould Sidi", role: "Analyste Vidéo", image: "https://placehold.co/200x200/006847/FFF?text=EMS",
    info: { age: 32, experience: "6 ans", education: "Master en Analyse Sportive", specialization: "Analyse tactique et scouting" } 
  },
];

// Mock matches for the team with more details and variety
export const mockMatches = [
  { 
    id: 1, 
    opponent: "FC Nouakchott", 
    date: "2024-03-15T19:30:00", 
    home: false, 
    result: "2-1", 
    win: true,
    stats: { possession: "52%", shots: 12, shotsOnTarget: 5, corners: 6, fouls: 14 },
    highlights: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  { 
    id: 2, 
    opponent: "AS Ksar", 
    date: "2024-03-08T17:00:00", 
    home: true, 
    result: "3-0", 
    win: true,
    stats: { possession: "64%", shots: 16, shotsOnTarget: 8, corners: 9, fouls: 8 },
    highlights: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  { 
    id: 3, 
    opponent: "Tevragh-Zeina FC", 
    date: "2024-03-01T18:30:00", 
    home: true, 
    result: "1-1", 
    win: null,
    stats: { possession: "48%", shots: 9, shotsOnTarget: 4, corners: 5, fouls: 12 },
    highlights: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
  },
  { 
    id: 4, 
    opponent: "Nouadhibou FC", 
    date: "2024-02-23T20:00:00", 
    home: false, 
    result: "0-2", 
    win: false,
    stats: { possession: "41%", shots: 7, shotsOnTarget: 2, corners: 3, fouls: 16 },
    highlights: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  { 
    id: 5, 
    opponent: "ASC Concorde", 
    date: "2024-02-16T16:00:00", 
    home: true, 
    result: "4-1", 
    win: true,
    stats: { possession: "68%", shots: 18, shotsOnTarget: 10, corners: 8, fouls: 9 },
    highlights: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  { 
    id: 6, 
    opponent: "ACS Ksar", 
    date: "2024-04-05T19:00:00", 
    home: false, 
    result: null, 
    win: null,
    stats: null,
    highlights: null
  },
  { 
    id: 7, 
    opponent: "FC Rosso", 
    date: "2024-04-12T18:00:00", 
    home: true, 
    result: null, 
    win: null,
    stats: null,
    highlights: null
  },
];
