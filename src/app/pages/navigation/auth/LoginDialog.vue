<template>
  <Dialog :open="open" @close="emit('close')">
    <InputFields :title="t('auth.signIn')" @submit="signIn">
      <InputField v-model="username" :label="t('auth.username')" type="text" />
      <InputField v-model="password" :label="t('auth.password')" type="password" />
      <Alert v-if="state === 'errored'" :text="t('auth.errors.login')" color="danger" />
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
const { login } = useStorage();

const username = ref(import.meta.env.APP_USERNAME ?? '');
const password = ref(import.meta.env.APP_PASSWORD ?? '');
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
