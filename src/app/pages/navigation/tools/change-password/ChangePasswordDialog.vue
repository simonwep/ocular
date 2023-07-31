<template>
  <Dialog :open="open" @close="emit('close')">
    <InputFields :title="t('auth.changePassword')" @submit="submit">
      <InputField v-model="currentPassword" :label="t('auth.currentPassword')" type="password" />
      <InputField v-model="newPassword" :label="t('auth.newPassword')" type="password" show-password-strength />
      <Alert v-if="state === 'errored'" :text="t('auth.errors.changePassword')" color="danger" />
    </InputFields>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Alert from '@components/base/alert/Alert.vue';
import Dialog from '@components/base/dialog/Dialog.vue';
import InputField from '@components/base/input-field/InputField.vue';
import InputFields from '@components/base/input-field/InputFields.vue';
import { useStorage } from '@storage/index';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

defineProps<{
  open: boolean;
}>();

const { t } = useI18n();
const { updatePassword } = useStorage();

const currentPassword = ref(import.meta.env.OCULAR_TEST_PASSWORD ?? '');
const newPassword = ref('');
const state = ref<'idle' | 'loading' | 'errored'>('idle');

const submit = async () => {
  if (state.value !== 'loading') {
    if (await updatePassword(currentPassword.value, newPassword.value)) {
      currentPassword.value = '';
      newPassword.value = '';
      state.value = 'idle';
      emit('close');
    } else {
      state.value = 'errored';
    }
  }
};
</script>

<style lang="scss" module>
.fields {
  display: flex;
  flex-direction: column;
  width: 200px;
  gap: 8px;
  padding-top: 8px;

  .title {
    text-align: center;
    font-weight: var(--font-weight-xl);
    font-style: var(--font-size-m);
  }

  .btn {
    text-align: center;
  }
}
</style>
