<template>
  <div :class="$style.field">
    <label :class="$style.label" :for="inputId">{{ label }}</label>

    <div :class="$style.wrapper">
      <input :id="inputId" v-model="modelValue" :class="$style.input" type="checkbox" />
      <div :class="$style.box">
        <Icon icon="check" :class="$style.icon" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Icon from '@components/base/icon/Icon.vue';
import { uuid } from '@utils';

const modelValue = defineModel<boolean>();

defineProps<{
  label: string;
}>();

const inputId = uuid();
</script>

<style lang="scss" module>
.field {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  font-size: var(--input-field-font-size);
}

.label {
  font-weight: var(--font-weight-l);
  font-size: var(--font-size-xs);
  user-select: none;
}

.wrapper {
  width: 18px;
  height: 18px;
  position: relative;
}

.box,
.input {
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.box {
  background: var(--input-field-background);
  border-radius: var(--border-radius-m);

  .icon {
    opacity: 0;
    color: var(--c-primary);
  }
}

.input {
  position: absolute;
  height: 30px;
  padding: 0 8px;
  display: flex;
  align-items: center;
  border: 1px solid transparent;
  transition: background-color var(--input-field-transition);
  appearance: none;
  z-index: 1;

  &:checked ~ .box .icon {
    opacity: 1;
  }
}
</style>
