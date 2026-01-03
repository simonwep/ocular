export const getCssVariables = (el: HTMLElement) => {
  const variableNames = new Set(
    Array.from(document.styleSheets)
      .flatMap((v) => Array.from(v.cssRules))
      .filter((rule) => rule instanceof CSSStyleRule)
      .flatMap((rule) => Array.from((rule as CSSStyleRule).style))
      .filter((key) => key.startsWith('--'))
  );

  // Recursively resolve all variables
  const elementStyle = getComputedStyle(el);

  const resolveVariable = (variable: string): string => {
    const value = elementStyle.getPropertyValue(variable).trim();
    const innerVariables = value.matchAll(/var\((--[^,)]+)(?:,([^)]+))?\)/g);
    let resolved = value;

    for (const [match, name, fallback] of innerVariables) {
      resolved = resolved.replace(match, resolveVariable(name) || fallback || '');
    }

    return value;
  };

  return new Map<string, string>([...variableNames].map((name) => [name, resolveVariable(name)]));
};
