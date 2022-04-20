<template>
  {{ formatCurrency(value, locale, currency) }}
</template>

<script lang="ts" setup>
import { formatCurrency } from '@utils';

defineProps<{
  value?: number;
  locale?: string;
  currency?: string;
}>();
</script>
