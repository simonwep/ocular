<template>
  <ContextMenu :class="classes" :options="locales" @select="changeLocale($event.id as AvailableLocale)">
    <Button icon="global-line" textual color="dimmed" />
  </ContextMenu>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import ContextMenu from '@components/base/context-menu/ContextMenu.vue';
import { ClassNames } from '@utils';
import { ContextMenuOption } from '@components/base/context-menu';
import { useI18n } from 'vue-i18n';
import Button from '@components/base/button/Button.vue';
import { AvailableLocale, availableLocales } from '@i18n/index';
import { useDataStore } from '@store/state';

const props = defineProps<{
  class?: ClassNames;
}>();

const { t } = useI18n();
const { changeLocale, state } = useDataStore();

const classes = computed(() => props.class);

const locales = computed<ContextMenuOption[]>(() =>
  availableLocales.map((value) => ({
    id: value,
    icon: state.locale === value ? 'check' : undefined,
    label: t(`locale.${value}`)
  }))
);
</script>
