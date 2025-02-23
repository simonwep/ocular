<template>
  <div :class="$style.pane">
    <div ref="header" :class="$style.header">
      <h1 :class="$style.title">
        <slot v-if="$slots.title" name="title" />
        <span v-else>{{ title }}</span>
        <template v-if="amount">
          <!-- eslint-disable @intlify/vue-i18n/no-raw-text -->
          <span> - </span>
          <Currency :testId="`${testId}-amount`" :value="amount" />
        </template>
      </h1>
      <slot name="header" />
    </div>
    <div ref="content" :class="[$style.content, classes]">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Currency from '@components/base/currency/Currency.vue';
import { useScrollShadow } from '@composables';
import { ClassNames } from '@utils';
import { computed, ref } from 'vue';

const props = defineProps<{
  class?: ClassNames;
  title?: string;
  amount?: number;
  testId?: string;
}>();

const header = ref<HTMLDivElement>();
const content = ref<HTMLDivElement>();
const classes = computed(() => props.class);
useScrollShadow(header, content, 'var(--app-scroll-box-shadow)');
</script>

<style lang="scss" module>
@use '@styles/globals.scss';

.pane {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: var(--app-background);
}

.header {
  display: flex;
  justify-content: space-between;
  position: sticky;
  top: 0;
  padding: 16px 10px;
  background: var(--app-background);
  animation: var(--animation-fade-in-right) var(--transition-s);
  transition: all var(--transition-m);
  z-index: 1;

  .title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: var(--font-size-s);
    font-weight: var(--font-weight-l);
  }
}

.content {
  overflow: auto;
  flex-grow: 1;
  padding: 0 10px;
}

@include globals.onMobileDevices {
  .pane {
    padding: 0;
  }

  .header {
    padding: 15px 15px 10px;
    align-items: center;

    .title {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-xl);
    }
  }

  .content {
    padding: 10px;
  }
}
</style>
