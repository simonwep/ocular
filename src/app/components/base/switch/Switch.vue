<template>
  <button type="button" :class="$style.switch" @click="modelValue = !modelValue">
    <span :class="$style.icons">
      <span :class="$style.icon">
        <component :is="iconOff" />
      </span>
      <span :class="$style.icon">
        <component :is="iconOn" />
      </span>
    </span>

    <span :class="[$style.icons, $style.active, { [$style.on]: modelValue }]">
      <span :class="$style.icon">
        <component :is="iconOff" />
      </span>
      <span :class="$style.icon">
        <component :is="iconOn" />
      </span>
    </span>
  </button>
</template>

<script lang="ts" setup>
import { type Component } from 'vue';

const modelValue = defineModel<boolean>();

defineProps<{
  iconOn: Component;
  iconOff: Component;
}>();
</script>

<style lang="scss" module>
.switch {
  all: unset;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 46px;
  height: 22px;
  border-radius: 100px;
  background-color: var(--c-primary);
}

.icons {
  position: absolute;
  display: flex;
  width: calc(100% - 6px);
  justify-content: space-between;

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--c-primary-hover);
    border-radius: 50%;
    width: 18px;
    height: 18px;
    padding: 2px;
  }

  &.active {
    clip-path: circle(9px at 9px 9px);
    transition: var(--transition-m) clip-path;
    background: var(--c-primary-hover);

    .icon {
      color: var(--c-primary-text);
    }

    &.on {
      clip-path: circle(9px at calc(100% - 9px) 9px);
    }
  }
}
</style>
