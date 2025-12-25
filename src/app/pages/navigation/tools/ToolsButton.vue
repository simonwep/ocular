<template>
  <ContextMenu
    :tooltip="t('navigation.tools.tools')"
    :position="media === 'mobile' ? 'top' : 'right-end'"
    tooltipPosition="right"
  >
    <template #default="{ toggle }">
      <Button testId="tools-menu" :class="classes" :icon="RiToolsLine" textual color="dimmed" @click="toggle" />
    </template>

    <template #options>
      <LoadDemoDataButton v-if="status === 'idle'" />
      <ChangePasswordButton v-if="user" />
      <PrivacyModeButton />
      <ExportButton />
      <ImportButton />
      <CopyPasteButton />
      <DeleteYearButton />
    </template>
  </ContextMenu>
</template>

<script lang="ts" setup>
import ChangePasswordButton from './change-password/ChangePasswordButton.vue';
import CopyPasteButton from './copy-paste/CopyPasteButton.vue';
import DeleteYearButton from './delete-year/DeleteYearButton.vue';
import ExportButton from './export/ExportButton.vue';
import ImportButton from './import/ImportButton.vue';
import LoadDemoDataButton from './load-demo-data/LoadDemoDataButton.vue';
import PrivacyModeButton from './privacy-mode/PrivacyModeButton.vue';
import Button from '@components/base/button/Button.vue';
import ContextMenu from '@components/base/context-menu/ContextMenu.vue';
import { useMediaQuery } from '@composables/useMediaQuery.ts';
import { RiToolsLine } from '@remixicon/vue';
import { useStorage } from '@storage/index';
import { ClassNames } from '@utils/types.ts';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  class: ClassNames;
}>();

const { status, user } = useStorage();
const { t } = useI18n();
const media = useMediaQuery();

const classes = computed(() => props.class);
</script>
