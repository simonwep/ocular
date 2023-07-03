<template>
  <ContextMenu :class="classes" :options="currencies" @select="changeCurrency($event.id as AvailableCurrency)">
    <Button icon="currency-line" textual color="dimmed" />
  </ContextMenu>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@components/base/button/Button.vue';
import { ContextMenuOption } from '@components/base/context-menu';
import ContextMenu from '@components/base/context-menu/ContextMenu.vue';
import { useDataStore } from '@store/state';
import { availableCurrencies, AvailableCurrency } from '@store/state/types';
import { ClassNames } from '@utils';

const props = defineProps<{
  class?: ClassNames;
}>();

const { t } = useI18n();
const { changeCurrency, state } = useDataStore();

const classes = computed(() => props.class);

const currencies = computed<ContextMenuOption[]>(() =>
  availableCurrencies.map((value) => ({
    id: value,
    icon: state.currency === value ? 'check' : undefined,
    label: t(`currency.${value}`)
  }))
);
</script>
