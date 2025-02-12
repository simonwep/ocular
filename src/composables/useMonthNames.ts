import { computed, ComputedRef } from 'vue';
import { useI18n } from 'vue-i18n';

export const useMonthNames = (format: Intl.DateTimeFormatOptions['month'] = 'long'): ComputedRef<string[]> => {
  const { locale } = useI18n();

  return computed(() => {
    const list = [];

    for (let i = 0; i < 12; i++) {
      list.push(
        new Date(0, i).toLocaleDateString(locale.value, {
          month: format
        })
      );
    }

    return list;
  });
};
