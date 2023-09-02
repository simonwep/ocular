<template>
  <Dialog :title="t('auth.changePassword')" :open="open" @close="emit('close')">
    <Form :submit-label="t('auth.changePassword')" @submit="submit">
      <TextField v-model="currentPassword" required :label="t('auth.currentPassword')" type="password" />
      <TextField
        v-model="newPassword"
        :min-length="8"
        :max-length="64"
        required
        :label="t('auth.newPassword')"
        type="password"
        show-password-strength
      />
      <Alert v-if="state === 'invalid-password'" :text="t('auth.errors.invalidPassword')" type="error" />
      <Alert v-if="state === 'errored'" :text="t('auth.errors.generic')" type="error" />
    </Form>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Alert from '@components/base/alert/Alert.vue';
import Dialog from '@components/base/dialog/Dialog.vue';
import Form from '@components/base/form/Form.vue';
import TextField from '@components/base/form/TextField.vue';
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
const state = ref<'idle' | 'loading' | 'invalid-password' | 'errored'>('idle');

const submit = async () => {
  if (state.value !== 'loading') {
    state.value = 'loading';

    updatePassword({
      currentPassword: currentPassword.value,
      newPassword: newPassword.value
    })
      .then(() => {
        currentPassword.value = '';
        newPassword.value = '';
        state.value = 'idle';
        emit('close');
      })
      .catch((err) => {
        state.value = err instanceof Response && err.status === 401 ? 'invalid-password' : 'errored';
      });
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
