import { useStorage } from '@storage/index.ts';
import { useDataStore } from '@store/state';
import { totals } from '@store/state/utils/budgets.ts';
import { sum } from '@utils/array/array.ts';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

export const useDemoData = () => {
  const { state, deserialize } = useDataStore();
  const { status } = useStorage();
  const { t } = useI18n();
  const router = useRouter();

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

    // Go to dashboard because overriding the placeholder data takes a while due
    // to the large amount of groups and categories.
    await router.push('/');

    // Generate demo data
    const { generateDemoData } = await import('./generateDemoData');
    await deserialize(generateDemoData(state.currency, state.locale, t));

    loading.value = false;
  };

  return { loadDemoData };
};
