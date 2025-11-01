export const evalMathExpression = (expression: string, locale = 'en'): number => {
  const trimmed = expression.replace(/\s+/g, '');
  const separators = localeSeparators(locale);

  const tokens = tokenize(trimmed, separators);
  const postfix = toPostfix(tokens);

  return evaluatePostfix(postfix);
};

type Separators = { decimal?: string; group?: string };

const localeSeparators = (locale: string): Separators => {
  const parts = new Intl.NumberFormat(locale).formatToParts(1000.5);

  return {
    decimal: parts.find((part) => part.type === 'decimal')?.value,
    group: parts.find((part) => part.type === 'group')?.value
  };
};

type Token = {
  type: 'number' | 'operator' | 'left-paren' | 'right-paren';
  value: string | number;
};

const tokenize = (expression: string, separators: Separators): Token[] => {
  const numberRegex = new RegExp(`[0-9${(separators.decimal ?? '') + (separators.group ?? '')}]`);
  const tokens: Token[] = [];
  let i = 0;

  while (i < expression.length) {
    const char = expression[i];

    if (numberRegex.test(char)) {
      let numStr = '';

      while (i < expression.length && numberRegex.test(expression[i])) {
        const token = expression[i];

        if (token !== separators.group) {
          numStr += token === separators.decimal ? '.' : token;
        }

        i++;
      }

      const value = Number(numStr);

      if (Number.isNaN(value)) {
        throw new Error(`Invalid number: ${numStr}`);
      }

      tokens.push({ type: 'number', value });
      continue;
    }

    if (['+', '-', '*', '/'].includes(char)) {
      tokens.push({ type: 'operator', value: char });
      i++;
      continue;
    }

    if (char === '(') {
      tokens.push({ type: 'left-paren', value: char });
      i++;
      continue;
    }

    if (char === ')') {
      tokens.push({ type: 'right-paren', value: char });
      i++;
      continue;
    }

    throw new Error(`Invalid character in expression: ${char}`);
  }

  return tokens;
};

const toPostfix = (tokens: Token[]): Token[] => {
  const output: Token[] = [];
  const operatorStack: Token[] = [];

  const precedence: Record<string, number> = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2
  };

  for (const token of tokens) {
    switch (token.type) {
      case 'number':
        output.push(token);
        break;

      case 'operator':
        while (
          operatorStack.length > 0 &&
          operatorStack.at(-1)!.type === 'operator' &&
          precedence[operatorStack.at(-1)!.value] >= precedence[token.value as string]
        ) {
          output.push(operatorStack.pop()!);
        }

        operatorStack.push(token);
        break;

      case 'left-paren':
        operatorStack.push(token);
        break;

      case 'right-paren':
        while (operatorStack.length > 0 && operatorStack.at(-1)!.type !== 'left-paren') {
          output.push(operatorStack.pop()!);
        }

        if (operatorStack.length === 0 || operatorStack.at(-1)!.type !== 'left-paren') {
          throw new Error('Mismatched parentheses');
        }

        // Remove the left parenthesis
        operatorStack.pop();
        break;
    }
  }

  // Pop any remaining operators to the output
  while (operatorStack.length > 0) {
    const op = operatorStack.pop()!;

    if (op.type === 'left-paren' || op.type === 'right-paren') {
      throw new Error('Mismatched parentheses');
    }

    output.push(op);
  }

  return output;
};

const evaluatePostfix = (tokens: Token[]): number => {
  const stack: number[] = [];

  for (const token of tokens) {
    if (token.type === 'number') {
      stack.push(token.value as number);
    } else if (token.type === 'operator') {
      if (stack.length < 2) {
        throw new Error('Invalid expression');
      }

      const b = stack.pop()!;
      const a = stack.pop()!;

      switch (token.value) {
        case '+':
          stack.push(a + b);
          break;
        case '-':
          stack.push(a - b);
          break;
        case '*':
          stack.push(a * b);
          break;
        case '/':
          if (b === 0) {
            throw new Error('Division by zero');
          }
          stack.push(a / b);
          break;
      }
    }
  }

  if (stack.length !== 1) {
    throw new Error('Invalid expression');
  }

  return stack[0];
};
