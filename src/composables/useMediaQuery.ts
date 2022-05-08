import { ref, Ref } from 'vue';

export type MediaQuery = 'normal' | 'minimized' | 'mobile';
const query = ref<MediaQuery>('normal');

const detectSize = () => {
  const el = document.getElementById('app');

  if (el) {
    const value = getComputedStyle(el).getPropertyValue('--media-type').replaceAll('"', '').trim();

    query.value = (value as MediaQuery) || 'normal';
  }
};

detectSize();
window.addEventListener('resize', detectSize);

export const useMediaQuery = (): Ref<MediaQuery> => query;
