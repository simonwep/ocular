<template>
  <ContextMenuButton :text="t('navigation.import.import')" icon="upload-cloud-2-line" @click="visible = true" />

  <Dialog ref="dialog" :open="visible" @close="visible = false">
    <Steps ref="steps" v-slot="{ previous }" @finish="close">
      <Step :class="$style.step">
        <h1 :class="$style.title">{{ t('navigation.import.start.title') }}</h1>
        <Button icon="file-fill" :text="t('navigation.import.start.ocular')" @click="next(BudgetFileScreen)" />
        <Button
          icon="google-fill"
          :text="t('navigation.import.start.google')"
          @click="next(GoogleAnnualBudgetScreen)"
        />
      </Step>
      <Step>
        <component :is="screen" v-if="screen" :back="previous" @loaded="close" />
      </Step>
    </Steps>
  </Dialog>
</template>

<script lang="ts" setup>
import { DefineComponent, ref, shallowRef, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@components/base/button/Button.vue';
import ContextMenuButton from '@components/base/context-menu/ContextMenuButton.vue';
import Dialog from '@components/base/dialog/Dialog.vue';
import Step from '@components/base/steps/Step.vue';
import { StepsExposed } from '@components/base/steps/Steps.types';
import Steps from '@components/base/steps/Steps.vue';
import BudgetFileScreen from './screens/BudgetFileScreen.vue';
import GoogleAnnualBudgetScreen from './screens/GoogleAnnualBudgetScreen.vue';

const screen = shallowRef<DefineComponent>();
const steps = shallowRef<StepsExposed>();
const visible = ref(false);

const { t } = useI18n();

const close = () => {
  visible.value = false;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
const next = (component: any) => {
  screen.value = component;
  steps.value?.next();
};

watch(visible, () => steps.value?.reset());
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
