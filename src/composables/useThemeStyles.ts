import { reactive, watchEffect } from 'vue';

export type Color = 'primary' | 'success' | 'warning' | 'danger' | 'dimmed' | 'dark';

export interface ColorPair {
  base: string;
  hover: string;
}

export interface ThemeStyles {
  focus: string;
  color: ColorPair;
  text: ColorPair;
  pure: ColorPair;
}

export const useThemeStyles = (effect: () => Color): ThemeStyles => {
  const resolve = (c = effect()): ThemeStyles => ({
    focus: `var(--c-${c}-shadow)`,
    color: { base: `var(--c-${c})`, hover: `var(--c-${c}-hover)` },
    text: { base: `var(--c-${c}-text)`, hover: `var(--c-${c}-text-hover)` },
    pure: { base: `var(--c-${c}-pure)`, hover: `var(--c-${c}-pure-hover)` }
  });

  const styles = reactive<ThemeStyles>(resolve());
  watchEffect(() => Object.assign(styles, resolve()));

  return styles;
};
