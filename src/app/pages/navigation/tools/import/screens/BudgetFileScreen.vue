<template>
  <Screen :back="back" :class="$style.screen" :title="t('navigation.tools.import.what.ocular')">
    <FilePicker
      v-model="budgetFile"
      :class="$style.input"
      :placeholder="t('navigation.tools.import.ocular.pickFile')"
      :accept="['.json']"
    />
    <Button
      v-if="budgetFile"
      :icon="RiUploadCloud2Line"
      :text="t('navigation.tools.import.ocular.import')"
      @click="load"
    />
  </Screen>
</template>

<script lang="ts" setup>
import Screen from './Screen.vue';
import Button from '@components/base/button/Button.vue';
import FilePicker from '@components/base/file-picker/FilePicker.vue';
import { RiUploadCloud2Line } from '@remixicon/vue';
import { useDataStore } from '@store/state';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

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
  gap: 10px;
}

.input {
  width: 250px;
}
</style>
