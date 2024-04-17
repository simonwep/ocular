<template>
  <Button
    :tooltip="t('navigation.info.about')"
    :class="classes"
    textual
    color="dimmed"
    :icon="RiInformationLine"
    @click="showInfoDialog = true"
  />
  <InfoDialog :open="showInfoDialog" @close="showInfoDialog = false" />
</template>

<script lang="ts" setup>
import { RiInformationLine } from '@remixicon/vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@components/base/button/Button.vue';
import { ClassNames } from '@utils';
import InfoDialog from './InfoDialog.vue';

const props = defineProps<{
  class?: ClassNames;
}>();

const { t } = useI18n();
const showInfoDialog = ref(false);

const classes = computed(() => props.class);
</script>
