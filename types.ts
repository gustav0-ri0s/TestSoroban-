
export enum OperationType {
  SUM = 'SUM',
  SUBTRACT = 'SUBTRACT',
  MULTIPLY = 'MULTIPLY',
  DIVIDE = 'DIVIDE',
  COMBINED_SUM_SUB = 'COMBINED_SUM_SUB',
  ALL_COMBINED = 'ALL_COMBINED',
  PRACTICE_COMPLEMENTS = 'PRACTICE_COMPLEMENTS'
}

export enum Difficulty {
  BASIC = 'BASIC',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export interface PracticeOptions {
  include89: boolean;
  difficulty: Difficulty;
  showHints: boolean;
}

export interface AnzanConfig {
  count: number;
  digits: number;
  delay: number; // in milliseconds
  operationType: OperationType;
  practiceOptions: PracticeOptions;
}

export interface ProblemSet {
  numbers: number[];
  operators: string[];
  correctAnswer: number;
  configAtRun?: AnzanConfig;
  startTime?: number;
}

export enum GameState {
  CONFIG = 'CONFIG',
  RUNNING = 'RUNNING',
  INPUT = 'INPUT',
  RESULT = 'RESULT'
}

export interface SessionResult {
  date: string;
  accuracy: number;
  avgTime: number;
  difficulty: Difficulty;
  count: number;
}
