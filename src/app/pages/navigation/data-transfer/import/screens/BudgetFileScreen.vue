<template>
  <Screen :back="back" :class="$style.screen" :title="t('data.import.start.ocular')">
    <FilePicker
      v-model="budgetFile"
      :class="$style.input"
      :placeholder="t('data.import.ocular.pickFile')"
      :accept="['.json']"
    />
    <Button v-if="budgetFile" icon="upload-cloud-2-line" :text="t('data.import.import')" @click="load" />
  </Screen>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import FilePicker from '@components/base/file-picker/FilePicker.vue';
import { useDataStore } from '@store/state';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Screen from './Screen.vue';

const emit = defineEmits<{
  (e: 'loaded'): void;
}>();

defineProps<{
  back: () => void;
}>();

const { deserialize } = useDataStore();
const budgetFile = ref<File>();
const { t } = useI18n();

const load = async () => {
  if (budgetFile.value) {
    await deserialize(budgetFile.value);
    emit('loaded');
  }
};
</script>

<style lang="scss" module>
.screen {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  grid-gap: 10px;
}

.input {
  width: 250px;
}
</style>
