<template>
  {{ formatCurrency(value, locale, currency) }}
</template>

<script lang="ts" setup>
import { formatCurrency } from '@utils';

withDefaults(
  defineProps<{
    value?: number;
    locale?: string;
    currency?: string;
  }>(),
  {
    locale: 'en-us',
    currency: 'USD',
  }
);
</script>
