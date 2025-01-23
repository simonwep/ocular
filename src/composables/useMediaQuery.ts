import { readonly, ref } from 'vue';

export type MediaQuery = 'normal' | 'minimized' | 'mobile';
const query = ref<MediaQuery>('normal');

const detectSize = () => {
  const el = document.getElementById('app');

  if (el) {
    const mediaType = getComputedStyle(el).getPropertyValue('--media-type');
    query.value = (mediaType.replaceAll('"', '').trim() as MediaQuery) || 'normal';
  }
};

window.addEventListener('resize', detectSize);

export const useMediaQuery = () => {
  detectSize();
  return readonly(query);
};
