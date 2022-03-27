<template>
  {{ text }}
</template>

<script lang="ts" setup>
import {useCurrencyFormatter} from '@composables';
import {toRefs} from 'vue';

const props = withDefaults(defineProps<{
  value?: number;
  locale?: string;
  currency?: string;
}>(), {
  locale: 'en-us',
  currency: 'USD'
});

const {locale, currency, value} = toRefs(props);
const text = useCurrencyFormatter(value, locale, currency);
</script>

