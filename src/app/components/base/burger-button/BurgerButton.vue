<template>
  <button :class="classes">
    <span />
    <span />
    <span />
  </button>
</template>

<script lang="ts" setup>
import { ClassNames } from '@utils';
import { computed, useCssModule } from 'vue';

const props = defineProps<{
  class?: ClassNames;
  active?: boolean;
}>();

const styles = useCssModule();
const classes = computed(() => [
  props.class,
  styles.menuButton,
  { [styles.active]: props.active }
]);
</script>

<style lang="scss" module>
.menuButton {
  all: unset;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  position: relative;

  > span {
    position: absolute;
    width: 40%;
    height: 1.5px;
    flex-shrink: 0;
    background: var(--c-dimmed);
    transition: all var(--transition-m);

    &:nth-child(1) {
      margin-bottom: 30%;
    }

    &:nth-child(3) {
      margin-top: 30%;
    }
  }

  &.active > span {
    &:nth-child(2) {
      opacity: 0;
      transform: scale(0.5);
    }

    &:nth-child(1) {
      margin-bottom: 0;
      transform: rotate(45deg);
    }

    &:nth-child(3) {
      margin-top: 0;
      transform: rotate(-45deg);
    }
  }
}
</style>
