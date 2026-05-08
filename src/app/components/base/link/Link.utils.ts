export const scaleSvgPath = (path: string, oldSize: number, newSize: number): string => {
  const tokens = path.match(/[a-zA-Z]|-?\d*\.?\d+/g);
  if (!tokens) return path;

  const normalize = (v: number) => (v / oldSize) * (newSize - 1);

  let i = 0;
  const result: string[] = [];

  while (i < tokens.length) {
    const token = tokens[i++];

    if (isNaN(Number(token))) {
      result.push(token);
      continue;
    }

    const x = normalize(Number(token));
    const yToken = tokens[i++];
    if (!yToken) break;

    const y = normalize(Number(yToken));
    result.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
  }

  return result.join(' ');
};
