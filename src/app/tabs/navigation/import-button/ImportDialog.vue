<template>
  <Dialog @close="close" :open="open" :class="$style.dialog">
    <Steps ref="steps" v-slot="{previous}" @finish="close">
      <Step :class="$style.step">
        <h1 :class="$style.title">What would you like to import?</h1>
        <Button icon="file-fill" text="A previously exported file" @click="next(BudgetFileScreen)"/>
        <Button icon="google-fill" text="Google-sheets annual budget" @click="next(GoogleAnnualBudgetScreen)"/>
      </Step>
      <Step>
        <component :is="screen" v-if="screen" :back="previous" @loaded="close"/>
      </Step>
    </Steps>
  </Dialog>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import Dialog from '@components/base/dialog/Dialog.vue';
import Step from '@components/base/steps/Step.vue';
import {StepsExposed} from '@components/base/steps/Steps.types';
import Steps from '@components/base/steps/Steps.vue';
import {shallowRef} from 'vue';
import BudgetFileScreen from './screens/BudgetFileScreen.vue';
import GoogleAnnualBudgetScreen from './screens/GoogleAnnualBudgetScreen.vue';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const props = defineProps<{
  open: boolean;
}>();

const screen = shallowRef();
const steps = shallowRef<StepsExposed>();

const close = () => {
  emit('close');
  steps.value?.reset();
};

const next = (component: any) => {
  screen.value = component;
  steps.value?.next();
};

</script>

<style lang="scss" module>

.step {
  display: flex;
  flex-direction: column;
  grid-gap: 15px;

  .title {
    font-size: var(--font-size-s);
    font-weight: var(--font-weight-m);
  }
}

</style>
