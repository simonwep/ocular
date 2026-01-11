<template>
  <Button
    :tooltip="t('navigation.settings.settings')"
    :class="classes"
    textual
    color="dimmed"
    testId="navigation-settings"
    :icon="showWinterFeatures ? RiSnowflakeLine : RiSettings4Line"
    @click="showSettingsDialog = true"
  />
  <SettingsDialog :open="showSettingsDialog" @close="showSettingsDialog = false" />
</template>

<script lang="ts" setup>
import SettingsDialog from '@app/pages/navigation/settings/SettingsDialog.vue';
import Button from '@components/base/button/Button.vue';
import { useShowWinterFeatures } from '@composables/winter-features/useShowWinterFeatures.ts';
import { ClassNames } from '@utils/types.ts';
import { RiSettings4Line, RiSnowflakeLine } from '@remixicon/vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  class?: ClassNames;
}>();

const { t } = useI18n();
const showWinterFeatures = useShowWinterFeatures();
const showSettingsDialog = ref(false);

const classes = computed(() => props.class);
</script>
