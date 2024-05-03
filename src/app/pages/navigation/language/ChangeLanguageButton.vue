<template>
  <ContextMenu
    :tooltip="t('navigation.language.switch')"
    tooltip-position="right"
    :options="locales"
    @select="changeLocale($event.id as AvailableLocale)"
  >
    <template #default="{ toggle }">
      <Button :class="classes" :icon="RiGlobalLine" textual color="dimmed" @click="toggle" />
    </template>
  </ContextMenu>
</template>

<script lang="ts" setup>
import { RiCheckLine, RiGlobalLine } from '@remixicon/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@components/base/button/Button.vue';
import { ContextMenuOption } from '@components/base/context-menu/ContextMenu.types';
import ContextMenu from '@components/base/context-menu/ContextMenu.vue';
import { AvailableLocale, availableLocales } from '@i18n/index';
import { useDataStore } from '@store/state';
import { ClassNames } from '@utils';

const props = defineProps<{
  class?: ClassNames;
}>();

const { t, locale } = useI18n();
const { changeLocale, state } = useDataStore();

const classes = computed(() => props.class);

const locales = computed<ContextMenuOption[]>(() => {
  const displayNames = new Intl.DisplayNames(locale.value, { type: 'language' });

  return availableLocales.map((value) => ({
    id: value,
    icon: state.locale === value ? RiCheckLine : undefined,
    label: displayNames.of(value)
  }));
});
</script>
