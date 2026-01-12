
import { OperationType, AnzanConfig, ProblemSet } from '../types';

export const generateProblem = (config: AnzanConfig): ProblemSet => {
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
      // In Soroban, we usually start with a large number and subtract
      currentTotal = getRandom() * 2; // Ensure we have enough to subtract
      numbers.push(currentTotal);
      operators.push('Initial');
      for (let i = 0; i < count - 1; i++) {
        let n = getRandom();
        // Ensure result isn't negative for standard Anzan training
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
      // Multiplication is usually pair-wise in Flash Anzan
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
      // Advanced logic mixing all, but keeping it readable
      currentTotal = getRandom();
      numbers.push(currentTotal);
      operators.push('Initial');
      for (let i = 0; i < count - 1; i++) {
        const op = Math.floor(Math.random() * 2); // Mostly +/- for flow
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

  return { numbers, operators, correctAnswer: currentTotal };
};
