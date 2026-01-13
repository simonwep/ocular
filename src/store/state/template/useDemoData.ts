import { useDataStore } from '@store/state';
import { totals } from '@store/state/utils/budgets.ts';
import { useStorage } from '@store/storage/useStorage.ts';
import { sum } from '@utils/array/array.ts';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

export const useDemoData = () => {
  const { status } = useStorage();
  const { state, deserialize } = useDataStore();
  const { t } = useI18n();

  const loading = ref(false);

  const loadDemoData = async () => {
    if (loading.value || status.value !== 'idle') {
      return;
    }

    const containsData = state.years.some((v) => sum(totals(v.expenses)) || sum(totals(v.income)));
    if (containsData && !confirm(t('navigation.tools.demo.overwriteExistingData'))) {
      return;
    }

    loading.value = true;
    const { generateDemoData } = await import('./generateDemoData.ts');

    if (status.value === 'idle') {
      await deserialize(generateDemoData(state.currency, state.locale, t));
    }

    loading.value = false;
  };

  return { loadDemoData };
};
