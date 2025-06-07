
// Match Types
export type MatchStatus = "scheduled" | "live" | "finished" | "postponed";

export interface MatchTeam {
  id: string;
  name: string;
  logo: string;
}

export interface Match {
  id: string;
  homeTeam: MatchTeam;
  awayTeam: MatchTeam;
  date: string;
  stadium: string;
  status: MatchStatus;
  homeScore?: number;  // Making these optional for scheduled matches
  awayScore?: number;  // Making these optional for scheduled matches
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
  id: string;
  name: string;
  number: number;
  age: number;
  position: string;
  teamId: string;
  nationality: string;
  image: string;
  stats: PlayerStats;
}

// Team Types
export interface Team {
  id: string;
  name: string;
  logo: string;
  stadium?: string;
  description?: string;
}
