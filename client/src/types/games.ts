export interface VerbalMemoryTest {
  id: number;
  user?: number;  // Made optional since we might not always have auth
  score: number;
  max_level: number;
  created_at?: string;
  updated_at?: string;
}

export interface Word {
  id: number;
  word: string;
}

export interface VerbalMemoryGameState {
  seenWords: string[];
  currentWord: string;
  level: number;
  lives: number;
  gameStarted: boolean;
  gameOver: boolean;
  loading: boolean;
  highScores: VerbalMemoryTest[];
}

export interface ChimpTestResult {
  id: number;
  score: number;
  sequence_length: number;
  created_at?: string;
}

export interface Tile {
  number: number;
  top: string;
  left: string;
  visible: boolean;
}