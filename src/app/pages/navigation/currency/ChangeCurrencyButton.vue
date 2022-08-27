<template>
  <ContextMenu :class="classes" :options="currencies" @select="changeCurrency($event.id as AvailableCurrency)">
    <Button icon="currency-line" textual color="dimmed" />
  </ContextMenu>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import ContextMenu from '@components/base/context-menu/ContextMenu.vue';
import { ClassNames } from '@utils';
import { ContextMenuOption } from '@components/base/context-menu';
import { useI18n } from 'vue-i18n';
import Button from '@components/base/button/Button.vue';
import { useDataStore } from '@store/state';
import { availableCurrencies, AvailableCurrency } from '@store/state/types';

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
