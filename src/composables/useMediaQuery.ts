import { ref, Ref } from 'vue';

export type MediaQuery = 'normal' | 'minimized' | 'mobile';
const query = ref<MediaQuery>('normal');

const detectSize = () => {
  const el = document.getElementById('app');

  if (el) {
    query.value =
      (getComputedStyle(el).getPropertyValue('--media-type').replaceAll('"', '').trim() as MediaQuery) || 'normal';
  }
};

window.addEventListener('resize', detectSize);
window.addEventListener('load', detectSize);

export const useMediaQuery = (): Ref<MediaQuery> => query;
