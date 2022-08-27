<template>
  {{ n(value ?? 0, { key: 'currency', currency: state.currency }) }}
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { useDataStore } from '@store/state';

const { n } = useI18n();
const { state } = useDataStore();

defineProps<{
  value?: number;
  locale?: string;
}>();
</script>
