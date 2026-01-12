
export enum OperationType {
  SUM = 'SUM',
  SUBTRACT = 'SUBTRACT',
  MULTIPLY = 'MULTIPLY',
  DIVIDE = 'DIVIDE',
  COMBINED_SUM_SUB = 'COMBINED_SUM_SUB',
  ALL_COMBINED = 'ALL_COMBINED'
}

export interface AnzanConfig {
  count: number;
  digits: number;
  delay: number; // in milliseconds
  operationType: OperationType;
}

export interface ProblemSet {
  numbers: number[];
  operators: string[];
  correctAnswer: number;
}

export enum GameState {
  CONFIG = 'CONFIG',
  RUNNING = 'RUNNING',
  INPUT = 'INPUT',
  RESULT = 'RESULT'
}
