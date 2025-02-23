<template>
  <Dialog :open="open" :title="t('navigation.auth.welcomeBack')" @close="emit('close')">
    <Form :submitLabel="t('navigation.auth.signIn')" @submit="signIn">
      <TextField v-model="username" required :label="t('navigation.auth.username')" type="text" name="username" />
      <TextField v-model="password" required :label="t('navigation.auth.password')" type="password" name="password" />
      <Alert v-if="state === 'errored'" :text="t('navigation.auth.loginFailed')" type="error" />
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
