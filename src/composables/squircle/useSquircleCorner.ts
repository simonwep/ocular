import { MaybeRefOrGetter, toValue, computed } from 'vue';

export const useSquircleCorner = (
  size: MaybeRefOrGetter<number>,
  curvature: MaybeRefOrGetter<number>,
  position: MaybeRefOrGetter<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>
) => {
  const path = computed(() => {
    const c = toValue(curvature);
    const s = toValue(size);

    const a = s * c;
    const b = s - a;

    switch (toValue(position)) {
      case 'top-right':
        return [`M 0,0`, `C ${a},0 ${s},${b} ${s},${s}`].join(' ');
      case 'bottom-left':
        return [`M 0,${s}`, `C 0,${b} ${b},${s} ${s},${s}`].join(' ');
      case 'bottom-right':
        return [`M ${s},${s}`, `C ${s},${a} ${a},0 0,0`].join(' ');
      case 'top-left':
      default:
        return [`M 0,0`, `C 0,${a} ${b},${s} ${s},${s}`].join(' ');
    }
  });

  const style = computed(() => ({
    width: `${toValue(size)}px`,
    height: `${toValue(size)}px`,
    viewBox: `0 0 ${toValue(size)} ${toValue(size)}`
  }));

  return computed(() => ({
    path: path.value,
    style: style.value
  }));
};
