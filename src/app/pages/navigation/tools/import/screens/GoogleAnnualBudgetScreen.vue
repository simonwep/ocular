<template>
  <Screen :back="back" :class="$style.screen" :title="t('data.import.start.google')">
    <FilePicker
      :class="$style.input"
      v-model="incomeFile"
      :placeholder="t('data.import.google.income')"
      :accept="['.csv']"
    />
    <FilePicker
      :class="$style.input"
      v-model="expensesFile"
      :placeholder="t('data.import.google.expenses')"
      :accept="['.csv']"
    />
    <Button
      v-if="expensesFile && incomeFile"
      icon="upload-cloud-2-line"
      :text="t('data.import.import')"
      @click="load"
    />
  </Screen>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import FilePicker from '@components/base/file-picker/FilePicker.vue';
import { useDataStore } from '@store/state';
import { convertGoogleAnnualBudgetCSVToBudgetGroups } from '@store/state/parser/googleAnnualBudgetSheet';
import { readFile } from '@utils';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Screen from './Screen.vue';

const emit = defineEmits<{
  (e: 'loaded'): void;
}>();

defineProps<{
  back: () => void;
}>();

const { setBudgetGroups } = useDataStore();
const expensesFile = ref<File>();
const incomeFile = ref<File>();
const { t } = useI18n();

const load = async () => {
  if (expensesFile.value && incomeFile.value) {
    const expenses = convertGoogleAnnualBudgetCSVToBudgetGroups(await readFile(expensesFile.value));
    const income = convertGoogleAnnualBudgetCSVToBudgetGroups(await readFile(incomeFile.value));
    setBudgetGroups('expenses', expenses);
    setBudgetGroups('income', income);
    emit('loaded');
  }
};
</script>

<style lang="scss" module>
.screen {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  grid-gap: 10px;
}

.input {
  width: 250px;
}
</style>
