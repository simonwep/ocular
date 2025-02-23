import { computed, MaybeRefOrGetter, toValue } from 'vue';

export type Color = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'dimmed';

export const useThemeStyles = (color: MaybeRefOrGetter<Color>) =>
  computed(() => {
    const c = toValue(color);

    return {
      focus: `var(--c-${c}-shadow)`,
      light: {
        base: `var(--c-${c}-light)`,
        dimmed: `var(--c-${c}-light-dimmed)`
      },
      color: {
        base: `var(--c-${c})`,
        hover: `var(--c-${c}-hover)`
      },
      text: {
        base: `var(--c-${c}-text)`,
        hover: `var(--c-${c}-text-hover)`,
        accent: `var(--c-${c}-text-accent)`
      },
      pure: {
        base: `var(--c-${c}-pure)`,
        hover: `var(--c-${c}-pure-hover)`
      }
    };
  });
