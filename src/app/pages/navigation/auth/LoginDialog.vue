<template>
  <Dialog
    :native="false"
    :closeOnBackgroundClick="false"
    :open="open"
    :lock="lockDialog"
    :title="t('navigation.auth.welcomeBack')"
    @close="emit('close')"
  >
    <Form
      :maxWidth="INSECURE_CONNECTION ? 350 : undefined"
      :submitIcon="RiLoginCircleLine"
      :submitLabel="t('navigation.auth.signIn')"
      @submit="signIn"
    >
      <Alert v-if="INSECURE_CONNECTION" :text="t('navigation.auth.loginNotAvailableDueToHttp')" type="warning" />

      <TextField
        v-model="username"
        testId="username"
        required
        :label="t('navigation.auth.username')"
        type="text"
        name="username"
      />
      <TextField
        v-model="password"
        testId="password"
        required
        :label="t('navigation.auth.password')"
        type="password"
        name="password"
      />
      <Alert v-if="state === 'errored'" testId="login-failed" :text="t('navigation.auth.loginFailed')" type="error" />
    </Form>
  </Dialog>
</template>

<script lang="ts" setup>
import Alert from '@components/base/alert/Alert.vue';
import Dialog from '@components/base/dialog/Dialog.vue';
import Form from '@components/base/form/Form.vue';
import TextField from '@components/base/text-field/TextField.vue';
import { useStorage } from '@store/storage/useStorage.ts';
import { RiLoginCircleLine } from '@remixicon/vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const INSECURE_CONNECTION = window.location.protocol === 'http:' && !import.meta.env.OCULAR_HYBRID_MODE;

const emit = defineEmits<{
  close: [];
}>();

defineProps<{
  open: boolean;
  lockDialog?: boolean;
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
