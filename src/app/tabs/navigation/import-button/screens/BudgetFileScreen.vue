<template>
  <Screen
    :back="back"
    :class="$style.screen"
    title="Import a previously imported file"
  >
    <FilePicker
      v-model="budgetFile"
      :class="$style.input"
      placeholder="Select your .budget file to import"
      :accept="['.budget']"
    />
    <Button
      v-if="budgetFile"
      icon="upload-cloud-2-line"
      text="Import"
      @click="load"
    />
  </Screen>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import FilePicker from '@components/base/file-picker/FilePicker.vue';
import { useStore } from '@state/index';
import { ref } from 'vue';
import Screen from './Screen.vue';

const emit = defineEmits<{
  (e: 'loaded'): void;
}>();

defineProps<{
  back: () => void;
}>();

const { deserialize } = useStore();
const budgetFile = ref<File>();

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
