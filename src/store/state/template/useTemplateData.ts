import { useStorage } from '@storage/index.ts';
import { useDataStore } from '@store/state';
import { totals } from '@store/state/utils/budgets.ts';
import { sum } from '@utils/array/array.ts';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const generators = {
  demo: () => import('./generateDemoData'),
  template: () => import('./generateTemplateData')
} as const;

export const useTemplateData = () => {
  const storage = useStorage();
  const { state, deserialize } = useDataStore();
  const { t } = useI18n();

  const loading = ref(false);

  const loadTemplateData = async (type: keyof typeof generators) => {
    if (loading.value || storage.status.value !== 'idle') {
      return;
    }

    const containsData = state.years.some((v) => sum(totals(v.expenses)) || sum(totals(v.income)));
    if (containsData && !confirm(t('navigation.tools.demo.overwriteExistingData'))) {
      return;
    }

    loading.value = true;
    const { generate } = await generators[type]();

    if (storage.status.value === 'idle') {
      await deserialize(generate(state.currency, state.locale, t));
    }

    loading.value = false;
  };

  return { loadTemplateData };
};
