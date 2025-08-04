<template>
  <Screen :back="back" :class="$style.screen" :title="t('navigation.tools.import.thirdParty.import')">
    <Alert :text="t('navigation.tools.import.thirdParty.instructions')" type="info" />

    <div :class="$style.content">
      <Button
        color="success"
        size="s"
        :text="t('navigation.tools.import.thirdParty.downloadTemplate')"
        :icon="RiFileDownloadLine"
        @click="downloadTemplate"
      />

      <FilePicker
        v-model="incomeFile"
        :placeholder="t('navigation.tools.import.thirdParty.income')"
        :accept="['.csv']"
      />
      <FilePicker
        v-model="expensesFile"
        :placeholder="t('navigation.tools.import.thirdParty.expenses')"
        :accept="['.csv']"
      />
      <Button
        v-if="expensesFile && incomeFile"
        :icon="RiUploadCloud2Line"
        :text="t('navigation.tools.import.thirdParty.import')"
        @click="load"
      />
    </div>
  </Screen>
</template>

<script lang="ts" setup>
import Screen from './Screen.vue';
import Alert from '@components/base/alert/Alert.vue';
import Button from '@components/base/button/Button.vue';
import FilePicker from '@components/base/file-picker/FilePicker.vue';
import { RiFileDownloadLine, RiUploadCloud2Line } from '@remixicon/vue';
import { useDataStore } from '@store/state';
import { convertGoogleAnnualBudgetCSVToBudgetGroups } from '@store/state/parser/googleAnnualBudgetSheet';
import { readFile } from '@utils/readFile.ts';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

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

const downloadTemplate = () => {
  // TODO: Download template and implement the logic to import the file
};
</script>

<style lang="scss" module>
.screen {
  width: 400px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}
</style>
