<template>
  <Screen :back="back" :class="$style.screen" title="Import from Google's Annual Budget sheet">
    <FilePicker :class="$style.input" v-model="incomeFile" placeholder="Income.csv" :accept="['.csv']"/>
    <FilePicker :class="$style.input" v-model="expensesFile" placeholder="Expenses.csv" :accept="['.csv']"/>
    <Button v-if="expensesFile && incomeFile" icon="upload-cloud-2-line" text="Import" @click="load"/>
  </Screen>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import FilePicker from '@components/base/file-picker/FilePicker.vue';
import {useStore} from '@state/index';
import {convertGoogleAnnualBudgetCSVToBudgetGroups} from '@state/parser/google-annual-budget-sheet';
import {ref} from 'vue';
import {readFile} from '../../../../../utils/readFile';
import Screen from './Screen.vue';

const emit = defineEmits<{
  (e: 'loaded'): void;
}>();

const props = defineProps<{
  back: () => void;
}>();

const {setBudgetGroups} = useStore();
const expensesFile = ref<File>();
const incomeFile = ref<File>();

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
