<template>
  <button :class="classes" @click="emit('click', $event)">
    <Icon v-if="icon" :icon="icon"/>
    <span :class="$style.text">{{ text }}</span>
  </button>
</template>

<script lang="ts" setup>
import Icon from '@components/icon/Icon.vue';
import {computed, useCssModule} from 'vue';

const emit = defineEmits<{
  (e: 'click', v: MouseEvent): void;
}>();

const props = defineProps<{
  class?: any;
  icon?: string
  text?: string;
}>();

const styles = useCssModule();
const classes = computed(() => [
  props.class,
  styles.button,
  {[styles.icon]: props.icon}
]);
</script>

<style lang="scss" module>

.button {
  all: unset;
  display: flex;
  align-items: center;
  cursor: pointer;

  &.icon .text {
    margin-left: 5px;
  }

  .text {
    width: 100%;
    font-size: var(--font-size-s);
    font-weight: var(--font-weight-m);
  }
}

</style>
