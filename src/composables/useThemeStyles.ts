import {reactive, watchEffect} from 'vue';

export type Color = 'primary' | 'error' | 'dimmed' | 'dark';

export interface ColorPair {
    base: string;
    hover: string;
}

export interface ThemeStyles {
    focus: string;
    color: ColorPair;
    inverted: ColorPair;
}

export const useThemeStyles = (effect: () => Color): ThemeStyles => {
    const resolve = (c = effect()): ThemeStyles => ({
        focus: `var(--c-${c}-shadow)`,
        color: {base: `var(--c-${c})`, hover: `var(--c-${c}-hover)`},
        inverted: {base: `var(--c-${c}-inverted)`, hover: `var(--c-${c}-inverted-hover)`}
    });

    const styles = reactive<ThemeStyles>(resolve());
    watchEffect(() => Object.assign(styles, resolve()));

    return styles;
};
