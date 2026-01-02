import { readonly, shallowReactive } from 'vue';

export const useOrderedTemplateRefs = <T>() => {
  const refs = shallowReactive<T[]>([]);

  const onRefCallback = (el: T | null) => {
    if (el && !refs.includes(el)) {
      refs.push(el);
    } else if (!el) {
      const index = refs.findIndex((r) => r === el);

      if (index !== -1) {
        refs.splice(index, 1);
      }
    }
  };

  return {
    onRefCallback,
    value: readonly(refs)
  };
};
