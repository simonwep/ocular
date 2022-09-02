<template>
  <div :class="$style.pane">
    <div ref="header" :class="$style.header">
      <h1 :class="$style.title">
        <span>{{ title }}</span>
        <template v-if="amount">
          <span> - </span>
          <Currency :value="amount" />
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
import { ClassNames } from '@utils';
import { computed, ref } from 'vue';
import { useScrollShadow } from '../../../composables/useScrollShadow';

const props = defineProps<{
  class?: ClassNames;
  title: string;
  amount?: number;
}>();

const header = ref<HTMLDivElement>();
const content = ref<HTMLDivElement>();
const classes = computed(() => props.class);
useScrollShadow(header, content, 'var(--app-scroll-box-shadow)');
</script>

<style lang="scss" module>
@use 'src/styles/globals';

.pane {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: var(--app-backround);
}

.header {
  display: flex;
  justify-content: space-between;
  position: sticky;
  top: 0;
  padding: 15px 10px;
  background: var(--app-backround);
  animation: var(--animation-fade-in-right) var(--transition-s);
  transition: all var(--transition-m);

  .title {
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
    padding: 20px 10px 15px;
    align-items: flex-end;
  }

  .content {
    padding: 10px;
  }
}
</style>
