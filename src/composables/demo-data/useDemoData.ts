import { useStorage } from '@storage/index.ts';
import { useDataStore } from '@store/state';
import { DataStateV3 } from '@store/state/types.ts';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export const useDemoData = () => {
  const { deserialize } = useDataStore();
  const { status } = useStorage();
  const router = useRouter();

  const loading = ref(false);

  const loadDemoData = async () => {
    if (loading.value || status.value !== 'idle') {
      return;
    }

    loading.value = true;

    // Go to dashboard because overriding the placeholder data takes a while due
    // to the large amount of groups and categories.
    await router.push('/');
    const { default: data } = await import('./DemoData.json');

    // Adjust years to match the current year
    const year = new Date().getFullYear();
    for (let i = 0; i < data.years.length; i++) {
      data.years[i].year = year - 1 + i;
    }

    await deserialize(data as DataStateV3);
    loading.value = false;
  };

  return { loadDemoData };
};
