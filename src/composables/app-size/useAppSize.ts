import { createGlobalState } from '@vueuse/core';
import { readonly, ref } from 'vue';

type AppSize = 'normal' | 'minimized' | 'mobile';

const appSize = ref<AppSize>('normal');

const detectSize = () => {
  const el = document.getElementById('app');

  if (el) {
    const mediaType = getComputedStyle(el).getPropertyValue('--media-type');
    appSize.value = (mediaType.replaceAll(/["']/g, '').trim() as AppSize) || 'normal';
  }
};

window.addEventListener('resize', detectSize);

export const useAppSize = createGlobalState(() => {
  detectSize();
  return readonly(appSize);
});
