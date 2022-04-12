<template>
  <DialogButton
    :class="classes"
    color="dimmed"
    icon="upload-cloud-2-line"
    textual
    @close="close"
  >
    <Steps ref="steps" v-slot="{ previous }" @finish="close">
      <Step :class="$style.step">
        <h1 :class="$style.title">What would you like to import?</h1>
        <Button
          icon="file-fill"
          text="A previously exported file"
          @click="next(BudgetFileScreen)"
        />
        <Button
          icon="google-fill"
          text="Google-sheets annual budget"
          @click="next(GoogleAnnualBudgetScreen)"
        />
      </Step>
      <Step>
        <component
          :is="screen"
          v-if="screen"
          :back="previous"
          @loaded="close"
        />
      </Step>
    </Steps>
  </DialogButton>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import DialogButton from '@components/base/dialog-button/DialogButton.vue';
import Step from '@components/base/steps/Step.vue';
import { StepsExposed } from '@components/base/steps/Steps.types';
import Steps from '@components/base/steps/Steps.vue';
import { ClassNames } from '@utils';
import { computed, DefineComponent, shallowRef } from 'vue';
import BudgetFileScreen from './screens/BudgetFileScreen.vue';
import GoogleAnnualBudgetScreen from './screens/GoogleAnnualBudgetScreen.vue';

const props = defineProps<{
  class?: ClassNames;
}>();

const classes = computed(() => props.class);
const screen = shallowRef<DefineComponent>();
const steps = shallowRef<StepsExposed>();

const close = () => steps.value?.reset();

/* eslint-disable @typescript-eslint/no-explicit-any */
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
