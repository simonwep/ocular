<template>
  <Button :class="classes" icon="download-cloud-2-line" color="dimmed" textual @click="save" />
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import { useDataStore } from '@store/data';
import { ClassNames, saveFile } from '@utils';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  class?: ClassNames;
}>();

const classes = computed(() => props.class);
const { serialize } = useDataStore();
const { t } = useI18n();

const save = () => {
  saveFile(serialize(), `${t('dashboard.title')}.budget`, 'application/json');
};
</script>
