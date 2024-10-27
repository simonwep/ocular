<template>
  <ContextMenuButton
    :text="privacyMode ? t('navigation.tools.privacyMode.disable') : t('navigation.tools.privacyMode.enable')"
    :icon="privacyMode ? RiEyeLine : RiEyeCloseLine"
    @click="togglePrivacyMode"
  />
</template>

<script lang="ts" setup>
import ContextMenuButton from '@components/base/context-menu/ContextMenuButton.vue';
import { RiEyeCloseLine, RiEyeLine } from '@remixicon/vue';
import { useSettingsStore } from '@store/settings';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { setMode, state } = useSettingsStore();
const { t } = useI18n();

const privacyMode = computed(() => state.appearance.mode === 'privacy');
const togglePrivacyMode = () => setMode(privacyMode.value ? 'normal' : 'privacy');
</script>
