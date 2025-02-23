<template>
  <Button
    :tooltip="t('navigation.settings.settings')"
    :class="classes"
    textual
    color="dimmed"
    testId="settings"
    :icon="RiSettings4Line"
    @click="showSettingsDialog = true"
  />
  <SettingsDialog :open="showSettingsDialog" @close="showSettingsDialog = false" />
</template>

<script lang="ts" setup>
import SettingsDialog from '@app/pages/navigation/settings/SettingsDialog.vue';
import Button from '@components/base/button/Button.vue';
import { RiSettings4Line } from '@remixicon/vue';
import { ClassNames } from '@utils';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  class?: ClassNames;
}>();

const { t } = useI18n();
const showSettingsDialog = ref(false);

const classes = computed(() => props.class);
</script>
