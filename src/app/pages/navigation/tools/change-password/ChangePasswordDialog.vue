<template>
  <Dialog :title="t('navigation.tools.changePassword.change')" :open="open" @close="emit('close')">
    <Form :submitLabel="t('navigation.tools.changePassword.change')" @submit="submit">
      <TextField
        v-model="currentPassword"
        required
        :label="t('navigation.tools.changePassword.current')"
        type="password"
      />
      <TextField
        v-model="newPassword"
        :minLength="8"
        :maxLength="64"
        required
        :label="t('navigation.tools.changePassword.new')"
        type="password"
        showPasswordStrength
      />
      <Alert v-if="state === 'invalid-password'" :text="t('navigation.tools.changePassword.invalid')" type="error" />
      <Alert v-if="state === 'errored'" :text="t('navigation.tools.changePassword.unknownError')" type="error" />
    </Form>
  </Dialog>
</template>

<script lang="ts" setup>
import Alert from '@components/base/alert/Alert.vue';
import Dialog from '@components/base/dialog/Dialog.vue';
import Form from '@components/base/form/Form.vue';
import TextField from '@components/base/text-field/TextField.vue';
import { useStorage } from '@storage/index';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

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
