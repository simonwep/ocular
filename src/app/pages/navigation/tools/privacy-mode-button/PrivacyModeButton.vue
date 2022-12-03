<template>
  <ContextMenuButton
    :text="privacyMode ? t('settings.mode.disablePrivacyMode') : t('settings.mode.enablePrivacyMode')"
    :icon="privacyMode ? 'eye-line' : 'eye-close'"
    @click="togglePrivacyMode"
  />
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import ContextMenuButton from '@components/base/context-menu/ContextMenuButton.vue';
import { computed } from 'vue';
import { useSettingsStore } from '@store/settings';

const { setMode, state } = useSettingsStore();
const { t } = useI18n();

const privacyMode = computed(() => state.appearance.mode === 'privacy');
const togglePrivacyMode = () => setMode(privacyMode.value ? 'normal' : 'privacy');
</script>
