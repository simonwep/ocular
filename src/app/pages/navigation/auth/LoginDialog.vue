<template>
  <Dialog :open="open" :title="t('auth.signIn')" @close="emit('close')">
    <Form :submit-label="t('auth.signIn')" @submit="signIn">
      <TextField v-model="username" required :label="t('auth.username')" type="text" />
      <TextField v-model="password" required :label="t('auth.password')" type="password" />
      <Alert v-if="state === 'errored'" :text="t('auth.errors.loginFailed')" type="error" />
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
const { login } = useStorage();

const username = ref(import.meta.env.OCULAR_TEST_USERNAME ?? '');
const password = ref(import.meta.env.OCULAR_TEST_PASSWORD ?? '');
const state = ref<'idle' | 'loading' | 'errored'>('idle');

const signIn = async () => {
  if (state.value !== 'loading') {
    state.value = 'loading';

    if (await login(username.value, password.value)) {
      username.value = '';
      password.value = '';
      state.value = 'idle';
      emit('close');
    } else {
      state.value = 'errored';
    }
  }
};
</script>
