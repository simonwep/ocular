<template>
  <div :class="$style.pane">
    <div :class="$style.header">
      <h1>
        <span>{{ title }}</span>
        <template v-if="amount">
          <span> - </span>
          <Currency :value="amount"/>
        </template>
      </h1>
      <slot name="header"/>
    </div>
    <div :class="[$style.content, classes]">
      <slot/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Currency from '@components/base/currency/Currency.vue';
import {computed} from 'vue';

const props = defineProps<{
  class?: any;
  title: string;
  amount?: number;
}>();

const classes = computed(() => props.class);
</script>

<style lang="scss" module>


@keyframes fade-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.pane {
  display: flex;
  flex-direction: column;
  padding: 0 20px 20px;
  height: 100%;
  width: 100%;
  overflow: auto;
  background: var(--app-backround);
}

.header {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  position: sticky;
  top: 0;
  padding-top: 10px;
  height: 50px;
  background: var(--app-backround);
  animation: fade-down var(--transition-s);

  > h1 {
    font-size: var(--font-size-m);
    font-weight: var(--font-weight-l);
    margin-right: auto;
  }
}

.content {
  flex-grow: 1;
}

</style>
