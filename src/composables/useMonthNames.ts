import { computed, ComputedRef, MaybeRefOrGetter, toValue } from 'vue';
import { useI18n } from 'vue-i18n';

export const useMonthNames = (
  format: Intl.DateTimeFormatOptions['month'] = 'long',
  offset: MaybeRefOrGetter<number> = 0
): ComputedRef<string[]> => {
  const { locale } = useI18n();

  return computed(() => {
    const resolvedOffset = toValue(offset);
    const list = [];

    for (let i = 0; i < 12; i++) {
      list.push(
        new Date(0, (i + resolvedOffset) % 12).toLocaleDateString(locale.value, {
          month: format
        })
      );
    }

    return list;
  });
};
