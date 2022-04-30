import { onMounted, Ref } from 'vue';

export const useScrollShadow = (
  el: Ref<HTMLElement | undefined>,
  trigger: Ref<HTMLElement | undefined>,
  shadow: string,
  offset = 5
) => {
  onMounted(() => {
    const element = el.value as HTMLDivElement;

    if (element) {
      element.style.removeProperty('box-shadow');
    }

    trigger.value?.addEventListener('scroll', () => {
      if (element && trigger.value) {
        if (trigger.value.scrollTop > offset) {
          element.style.setProperty('box-shadow', shadow);
        } else {
          element.style.removeProperty('box-shadow');
        }
      }
    });
  });
};
