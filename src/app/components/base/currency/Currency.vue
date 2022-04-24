<template>
  {{ n(value ?? 0, 'currency') }}
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

const { n } = useI18n();

defineProps<{
  value?: number;
  locale?: string;
}>();
</script>
