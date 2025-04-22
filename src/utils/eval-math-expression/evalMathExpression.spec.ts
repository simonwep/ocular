import { evalMathExpression } from './evalMathExpression';
import { it, expect } from 'vitest';

// Test basic operations
it('evaluates addition correctly', () => {
  expect(evalMathExpression('2 + 3')).toBe(5);
  expect(evalMathExpression('10 + 20')).toBe(30);
});

it('evaluates subtraction correctly', () => {
  expect(evalMathExpression('5 - 2')).toBe(3);
  expect(evalMathExpression('10 - 20')).toBe(-10);
});

it('evaluates multiplication correctly', () => {
  expect(evalMathExpression('2 * 3')).toBe(6);
  expect(evalMathExpression('10 * 20')).toBe(200);
});

it('evaluates division correctly', () => {
  expect(evalMathExpression('6 / 2')).toBe(3);
  expect(evalMathExpression('10 / 2')).toBe(5);
});

it('handles division by zero', () => {
  expect(() => evalMathExpression('5 / 0')).toThrow('Division by zero');
});

// Test operator precedence
it('respects operator precedence', () => {
  expect(evalMathExpression('2 + 3 * 4')).toBe(14);
  expect(evalMathExpression('2 * 3 + 4')).toBe(10);
  expect(evalMathExpression('10 - 2 * 3')).toBe(4);
  expect(evalMathExpression('10 / 2 + 3')).toBe(8);
});

// Test parentheses
it('evaluates expressions with parentheses correctly', () => {
  expect(evalMathExpression('(2 + 3) * 4')).toBe(20);
  expect(evalMathExpression('2 * (3 + 4)')).toBe(14);
  expect(evalMathExpression('(10 - 2) * (3 + 4)')).toBe(56);
  expect(evalMathExpression('(10 / (1 + 1)) + 3')).toBe(8);
});

// Test nested parentheses
it('handles nested parentheses correctly', () => {
  expect(evalMathExpression('2 * (3 + (4 - 2))')).toBe(10);
  expect(evalMathExpression('((2 + 3) * 4) / 2')).toBe(10);
  expect(evalMathExpression('(2 + (3 * (4 - 1)))')).toBe(11);
});

// Test whitespace handling
it('handles different whitespace patterns', () => {
  expect(evalMathExpression('2+3')).toBe(5);
  expect(evalMathExpression('2 +3')).toBe(5);
  expect(evalMathExpression('2+ 3')).toBe(5);
  expect(evalMathExpression(' 2 + 3 ')).toBe(5);
  expect(evalMathExpression('(2+3)*(4-1)')).toBe(15);
});

// Test complex expressions
it('evaluates complex expressions correctly', () => {
  expect(evalMathExpression('2 + 3 * 4 - 6 / 2')).toBe(11);
  expect(evalMathExpression('(2 + 3) * (4 - 6 / 2)')).toBe(5);
  expect(evalMathExpression('10 / (2 + 3) * 4 - 1')).toBe(7);
});

// Test error cases
it('handles invalid expressions', () => {
  expect(() => evalMathExpression('')).toThrow();
  expect(() => evalMathExpression('2 +')).toThrow('Invalid expression');
  expect(() => evalMathExpression('+ 2')).toThrow('Invalid expression');
});

it('handles invalid numbers', () => {
  expect(() => evalMathExpression('2 + 3.5.6')).toThrow('Invalid number');
});

it('handles mismatched parentheses', () => {
  expect(() => evalMathExpression('(2 + 3')).toThrow('Mismatched parentheses');
  expect(() => evalMathExpression('2 + 3)')).toThrow('Mismatched parentheses');
  expect(() => evalMathExpression('((2 + 3)')).toThrow('Mismatched parentheses');
});

// Test decimal numbers
it('handles decimal numbers correctly', () => {
  expect(evalMathExpression('2.5 + 3.5')).toBe(6);
  expect(evalMathExpression('2.5 * 2')).toBe(5);
  expect(evalMathExpression('5 / 2')).toBe(2.5);
  expect(evalMathExpression('(1.5 + 2.5) * 2')).toBe(8);
});

// Test invalid characters
it('throws error for invalid characters', () => {
  expect(() => evalMathExpression('2 $ 3')).toThrow('Invalid character');
  expect(() => evalMathExpression('2 @ 3')).toThrow('Invalid character');
});

// Test localizations
it('handles different number formats', () => {
  expect(evalMathExpression('1,000 + 2,000', 'en-US')).toBe(3000);
  expect(evalMathExpression('1.000 + 2.000', 'de-DE')).toBe(3000);
  expect(evalMathExpression('1.5 + 2.5', 'en-US')).toBe(4);
  expect(evalMathExpression('1,5 + 2,5', 'de-DE')).toBe(4);
});
