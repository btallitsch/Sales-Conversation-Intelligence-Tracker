export type OutcomeType = 'win' | 'loss' | 'follow-up' | 'pending';

export interface Interaction {
  id: string;
  userId: string;
  objection: string;
  response: string;
  outcome: OutcomeType;
  notes?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InteractionInput {
  objection: string;
  response: string;
  outcome: OutcomeType;
  notes?: string;
  tags?: string[];
}

export interface Pattern {
  objection: string;
  responses: ResponsePattern[];
  totalCount: number;
  winRate: number;
}

export interface ResponsePattern {
  response: string;
  count: number;
  wins: number;
  losses: number;
  followUps: number;
  winRate: number;
}

export interface DashboardStats {
  totalInteractions: number;
  winRate: number;
  mostCommonObjection: string;
  bestResponse: string;
  recentTrend: 'up' | 'down' | 'flat';
  winCount: number;
  lossCount: number;
  followUpCount: number;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
