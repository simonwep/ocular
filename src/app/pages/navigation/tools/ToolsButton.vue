<template>
  <ContextMenu
    :tooltip="t('navigation.tools')"
    :position="media === 'mobile' ? 'top' : 'right-end'"
    tooltip-position="right"
    :class="classes"
  >
    <Button icon="settings-4-line" textual color="dimmed"></Button>

    <template #options>
      <LoadDemoDataButton v-if="status === 'idle'" />
      <ChangePasswordButton v-if="user" />
      <PrivacyModeButton />
      <ExportButton />
      <ImportButton />
      <CopyButton />
      <PasteButton />
    </template>
  </ContextMenu>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@components/base/button/Button.vue';
import ContextMenu from '@components/base/context-menu/ContextMenu.vue';
import { useMediaQuery } from '@composables';
import { useStorage } from '@storage/index';
import { ClassNames } from '@utils';
import ChangePasswordButton from './change-password/ChangePasswordButton.vue';
import CopyButton from './copy-paste/CopyButton.vue';
import PasteButton from './copy-paste/PasteButton.vue';
import LoadDemoDataButton from './demo/LoadDemoDataButton.vue';
import ExportButton from './export/ExportButton.vue';
import ImportButton from './import/ImportButton.vue';
import PrivacyModeButton from './privacy-mode-button/PrivacyModeButton.vue';

const props = defineProps<{
  class: ClassNames;
}>();

const { status, user } = useStorage();
const { t } = useI18n();
const media = useMediaQuery();

const classes = computed(() => props.class);
</script>
