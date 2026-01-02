import { useAppElement } from '@composables/app-element/useAppElement.ts';
import { onScopeDispose, ref } from 'vue';

export const useCssVarValue = (name: string) => {
  const appElement = useAppElement();
  const value = ref<string>(getComputedStyle(appElement).getPropertyValue(name));

  const observer = new MutationObserver(() => (value.value = getComputedStyle(appElement).getPropertyValue(name)));

  observer.observe(appElement, {
    attributes: true,
    attributeFilter: ['style', 'class']
  });

  onScopeDispose(() => observer.disconnect());

  return value;
};
