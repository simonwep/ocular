<template>
  <div :class="$style.pane">
    <div :class="$style.header">
      <h1>
        <span>{{ title }}</span>
        <template v-if="amount">
          <span> - </span>
          <Currency :value="amount" />
        </template>
      </h1>
      <slot name="header" />
    </div>
    <div :class="[$style.content, classes]">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Currency from '@components/base/currency/Currency.vue';
import { ClassNames } from '@utils';
import { computed } from 'vue';

const props = defineProps<{
  class?: ClassNames;
  title: string;
  amount?: number;
}>();

const classes = computed(() => props.class);
</script>

<style lang="scss" module>
@use 'src/styles/globals';

.pane {
  display: flex;
  flex-direction: column;
  padding: 0 10px 10px;
  height: 100%;
  overflow: hidden;
  background: var(--app-backround);
}

.header {
  display: flex;
  justify-content: space-between;
  position: sticky;
  top: 0;
  padding-top: 14px;
  padding-bottom: 15px;
  border-bottom: 1px solid var(--app-border);
  background: var(--app-backround);
  animation: var(--animation-fade-in-right) var(--transition-s);

  > h1 {
    font-size: var(--font-size-m);
    font-weight: var(--font-weight-l);
    margin-left: 10px;
  }
}

.content {
  overflow: auto;
  flex-grow: 1;
  padding-top: 10px;
}

@include globals.onMobileDevices {
  .pane {
    padding: 0;
  }

  .header {
    padding: 20px 10px 15px;
    align-items: flex-end;
  }

  .content {
    padding: 10px;
  }
}
</style>
