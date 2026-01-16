
import { OperationType, AnzanConfig, ProblemSet, Difficulty } from '../types';

export const generateProblem = (config: AnzanConfig): ProblemSet => {
  if (config.operationType === OperationType.PRACTICE_COMPLEMENTS) {
    return generatePracticeSequence(config);
  }

  const { count, digits, operationType } = config;
  const min = Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;

  let numbers: number[] = [];
  let operators: string[] = [];
  let currentTotal = 0;

  const getRandom = () => Math.floor(Math.random() * (max - min + 1)) + min;

  switch (operationType) {
    case OperationType.SUM:
      for (let i = 0; i < count; i++) {
        const n = getRandom();
        numbers.push(n);
        operators.push('+');
        currentTotal += n;
      }
      break;

    case OperationType.SUBTRACT:
      currentTotal = getRandom() * 2;
      numbers.push(currentTotal);
      operators.push('Initial');
      for (let i = 0; i < count - 1; i++) {
        let n = getRandom();
        if (currentTotal - n < 0) n = Math.floor(currentTotal / 2);
        numbers.push(n);
        operators.push('-');
        currentTotal -= n;
      }
      break;

    case OperationType.COMBINED_SUM_SUB:
      currentTotal = getRandom();
      numbers.push(currentTotal);
      operators.push('Initial');
      for (let i = 0; i < count - 1; i++) {
        const isSum = Math.random() > 0.4;
        let n = getRandom();
        if (isSum) {
          numbers.push(n);
          operators.push('+');
          currentTotal += n;
        } else {
          if (currentTotal - n < 0) n = Math.floor(currentTotal / 2);
          numbers.push(n);
          operators.push('-');
          currentTotal -= n;
        }
      }
      break;

    case OperationType.MULTIPLY:
      const n1 = getRandom();
      const n2 = Math.floor(Math.random() * (Math.pow(10, Math.max(1, Math.floor(digits/2))) - 1)) + 2;
      numbers = [n1, n2];
      operators = ['x'];
      currentTotal = n1 * n2;
      break;

    case OperationType.DIVIDE:
      const divisor = Math.floor(Math.random() * 9) + 2;
      const quotient = getRandom();
      const dividend = quotient * divisor;
      numbers = [dividend, divisor];
      operators = ['÷'];
      currentTotal = quotient;
      break;

    case OperationType.ALL_COMBINED:
      currentTotal = getRandom();
      numbers.push(currentTotal);
      operators.push('Initial');
      for (let i = 0; i < count - 1; i++) {
        const op = Math.floor(Math.random() * 2);
        let n = getRandom();
        if (op === 0) {
          numbers.push(n);
          operators.push('+');
          currentTotal += n;
        } else {
          if (currentTotal - n < 0) n = Math.floor(currentTotal / 2);
          numbers.push(n);
          operators.push('-');
          currentTotal -= n;
        }
      }
      break;
  }

  return { numbers, operators, correctAnswer: currentTotal, configAtRun: config, startTime: Date.now() };
};

const generatePracticeSequence = (config: AnzanConfig): ProblemSet => {
  const { count, digits, practiceOptions } = config;
  const { include89, difficulty } = practiceOptions;
  
  let numbers: number[] = [];
  let operators: string[] = [];
  let currentTotal = 0;

  // Potential practice digits
  const targetDigits = include89 ? [6, 7, 8, 9] : [6, 7];
  
  // Logic to determine if a carry is allowed
  const canCarry = (val: number, add: number): boolean => {
    // Check if adding 'add' to 'val' across all digits results in a carry
    // For simplicity in practice mode, we often check the last digit
    return (val % 10) + (add % 10) >= 10;
  };

  const canBorrow = (val: number, sub: number): boolean => {
    return (val % 10) < (sub % 10);
  };

  for (let i = 0; i < count; i++) {
    let n = 0;
    let op = '+';

    // 70% chance to pick a target digit (6,7,8,9)
    const pickTarget = Math.random() < 0.75;
    
    if (pickTarget) {
      n = targetDigits[Math.floor(Math.random() * targetDigits.length)];
    } else {
      n = Math.floor(Math.random() * 5) + 1; // 1-5
    }

    // Scale by digits (e.g. if digits=2, make it 6, 16, 26 etc or 60)
    // For practice mode usually we focus on the lower digits carry
    if (digits > 1) {
       const multiplier = Math.pow(10, Math.floor(Math.random() * digits));
       n = n * multiplier;
    }

    if (i === 0) {
      currentTotal = n;
      numbers.push(n);
      operators.push('Initial');
      continue;
    }

    // Decide Operation
    const isSum = currentTotal < 10 ? true : Math.random() > 0.5;
    op = isSum ? '+' : '-';

    // Difficulty filter
    let isValid = false;
    let attempts = 0;

    while (!isValid && attempts < 20) {
      attempts++;
      
      if (isSum) {
        const carry = canCarry(currentTotal, n);
        if (difficulty === Difficulty.BASIC && carry) {
          // Force no carry: pick smaller n or change n
          n = Math.max(1, 9 - (currentTotal % 10));
        } else if (difficulty === Difficulty.INTERMEDIATE && carry && Math.random() > 0.2) {
          // Only 20% carries allowed
          n = Math.max(1, 9 - (currentTotal % 10));
        }
        isValid = currentTotal + n < Math.pow(10, digits + 1);
      } else {
        const borrow = canBorrow(currentTotal, n);
        if (difficulty === Difficulty.BASIC && (borrow || currentTotal < n)) {
          n = currentTotal % 10;
        } else if (difficulty === Difficulty.INTERMEDIATE && borrow && Math.random() > 0.2) {
          n = currentTotal % 10;
        }
        isValid = currentTotal - n >= 0;
      }
      
      if (n === 0) n = 1; // prevent zeros
    }

    if (op === '+') {
      currentTotal += n;
    } else {
      currentTotal -= n;
    }

    numbers.push(n);
    operators.push(op);
  }

  return { 
    numbers, 
    operators, 
    correctAnswer: currentTotal, 
    configAtRun: config,
    startTime: Date.now()
  };
};
