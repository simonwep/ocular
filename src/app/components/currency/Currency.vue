<template>
  {{ text }}
</template>

<script lang="ts" setup>

import {computed} from 'vue';

const props = withDefaults(defineProps<{
  value?: number;
  locale?: string;
  currency?: string;
}>(), {
  locale: 'en-us',
  currency: 'USD'
});

const text = computed(() => {
  if (props.value === undefined) {
    return '';
  }

  return new Intl.NumberFormat(props.locale, {
    currency: props.currency,
    style: 'currency'
  }).format(props.value);
});

</script>

