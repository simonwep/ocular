import { ref } from 'vue';

export const useCssVarValue = (name: string) => {
  const appElement = document.getElementById('app')!;
  const value = ref<string>(getComputedStyle(appElement).getPropertyValue(name));

  new MutationObserver(() => (value.value = getComputedStyle(appElement).getPropertyValue(name))).observe(appElement, {
    attributes: true,
    attributeFilter: ['style', 'class']
  });

  return value;
};
