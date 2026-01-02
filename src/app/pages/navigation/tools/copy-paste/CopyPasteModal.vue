<template>
  <Dialog
    :contentClass="$style.copyPasteModalContent"
    :open="open"
    :title="t('navigation.tools.copyPaste.copyPasteDataFromOneYearToAnother')"
    @close="emit('close')"
  >
    <Form
      submitTestId="transfer-data"
      :disabled="sameYear || !formData.sourceYear || !formData.targetYear"
      :submitLabel="t('navigation.tools.copyPaste.transferData')"
      @submit="submit"
    >
      <Select
        v-model="formData.sourceYear"
        testId="source-year"
        :label="t('navigation.tools.copyPaste.fromYear')"
        :options="years"
      />
      <Select
        v-model="formData.targetYear"
        testId="target-year"
        :label="t('navigation.tools.copyPaste.toYear')"
        :options="years.filter((v) => v.id !== formData.sourceYear)"
      />

      <template v-if="formData.sourceYear && formData.targetYear">
        <MultiSelect
          v-model="formData.sourceIncomeGroups"
          testId="income-groups"
          :placeholder="t('navigation.tools.copyPaste.nothingToAddAnymore')"
          :label="t('navigation.tools.copyPaste.copyTheseGroupsFromIncome')"
          :options="sourceGroups.income"
        />

        <MultiSelect
          v-model="formData.sourceExpenseGroups"
          testId="expense-groups"
          :placeholder="t('navigation.tools.copyPaste.nothingToAddAnymore')"
          :label="t('navigation.tools.copyPaste.andTheseGroupsFromExpenses')"
          :options="sourceGroups.expenses"
        />

        <CheckBox
          v-model="formData.includeValues"
          testId="include-values"
          :label="t('navigation.tools.copyPaste.includeValues')"
        />
      </template>
    </Form>
  </Dialog>
</template>

<script lang="ts" setup>
import CheckBox from '@components/base/check-box/CheckBox.vue';
import { ContextMenuOption } from '@components/base/context-menu/ContextMenu.types.ts';
import Dialog from '@components/base/dialog/Dialog.vue';
import Form from '@components/base/form/Form.vue';
import MultiSelect from '@components/base/multi-select/MultiSelect.vue';
import Select from '@components/base/select/Select.vue';
import { useTime } from '@composables/time/useTime.ts';
import { useDataStore } from '@store/state';
import { generateBudgetYear } from '@store/state/utils/generators.ts';
import { computed, shallowReactive, watch } from 'vue';
import { useI18n } from 'vue-i18n';

type FormData = {
  sourceYear?: string;
  sourceIncomeGroups: string[];
  sourceExpenseGroups: string[];
  targetYear?: string;
  includeValues: boolean;
  groupsToCopy: string[];
};

const emit = defineEmits<{
  close: [];
}>();

defineProps<{
  open: boolean;
}>();

const { t } = useI18n();
const { state, changeYear, upsertYear } = useDataStore();
const time = useTime();

const formData = shallowReactive<FormData>({
  sourceYear: String(state.activeYear),
  sourceIncomeGroups: [],
  sourceExpenseGroups: [],
  targetYear: undefined,
  includeValues: true,
  groupsToCopy: []
});

const sameYear = computed(() => formData.sourceYear && formData.sourceYear === formData.targetYear);

const sourceYear = computed(() => state.years.find((v) => v.year === Number(formData.sourceYear)));

const sourceGroups = computed(() => ({
  expenses: sourceYear.value?.expenses?.map((v) => ({ label: v.name, id: v.id })) ?? [],
  income: sourceYear.value?.income?.map((v) => ({ label: v.name, id: v.id })) ?? []
}));

const years = computed(() => {
  const start = Math.min(...state.years.map((v) => v.year));
  const options: ContextMenuOption[] = [];

  for (let i = start; i <= time.year.value + 1; i++) {
    options.push({ label: String(i), id: String(i) });
  }

  return options;
});

const submit = () => {
  const sourceYear = Number(formData.sourceYear);
  const targetYear = Number(formData.targetYear);
  const sourceBudgets = state.years.find((v) => v.year === sourceYear);

  if (!sourceBudgets) {
    return;
  }

  upsertYear(
    generateBudgetYear({
      year: targetYear,
      source: sourceBudgets,
      expenseGroups: formData.sourceExpenseGroups,
      incomeGroups: formData.sourceIncomeGroups,
      includeValues: formData.includeValues
    })
  );

  changeYear(targetYear);
  emit('close');
};

watch(
  sourceYear,
  (data) => {
    formData.sourceIncomeGroups = data?.income.map((v) => v.id) ?? [];
    formData.sourceExpenseGroups = data?.expenses.map((v) => v.id) ?? [];
    formData.targetYear = undefined;
  },
  { immediate: true }
);
</script>

<style lang="scss" module>
.copyPasteModalContent {
  max-width: 350px;
}
</style>
