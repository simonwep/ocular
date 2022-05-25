import { computed, Ref } from 'vue';
import { useI18n } from 'vue-i18n';

export const useMonthNames = (): Ref<string[]> => {
  const { d } = useI18n();

  return computed(() => {
    const months: string[] = [];

    for (let i = 0; i < 12; i++) {
      months.push(d(new Date(0, i), 'month'));
    }

    return months;
  });
};
