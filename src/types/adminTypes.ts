
// Match Types
export type MatchStatus = "scheduled" | "live" | "finished";

export interface MatchTeam {
  id: number;
  name: string;
  logo: string;
}

export interface Match {
  id: number;
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  date: string;
  stadium: string;
  status: MatchStatus;
  homeScore: number;
  awayScore: number;
}

// Player Types
export interface PlayerStats {
  matches: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  shotsOnTarget?: number;
  passAccuracy?: number;
  tackles?: number;
  saves?: number;
  cleanSheets?: number;
}

export interface Player {
  id: number;
  name: string;
  number: number;
  age: number;
  position: string;
  teamId: number;
  nationality: string;
  image: string;
  stats: PlayerStats;
}
