import { watchImmediate } from '@vueuse/core';
import { MaybeRefOrGetter, shallowRef, toRef } from 'vue';

export const useSvgImageElement = (svg: MaybeRefOrGetter<string>) => {
  const value = shallowRef<HTMLImageElement>();

  watchImmediate(toRef(svg), (newSvg) => {
    const image = new Image();
    image.onload = () => (value.value = image);
    image.src = `data:image/svg+xml;base64,${btoa(newSvg)}`;
  });

  return value;
};
