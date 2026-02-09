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
      :disabled="!!retryDuration"
      :maxWidth="INSECURE_CONNECTION ? 350 : undefined"
      :submitIcon="RiLoginCircleLine"
      :submitLabel="t('navigation.auth.signIn')"
      @submit="executeImmediate(username, password)"
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

      <template v-if="state?.error?.status === 429">
        <Alert
          v-if="retryDuration"
          testId="login-too-many-attempts"
          :text="t('navigation.auth.tooManyFailedAttempts', { duration: retryDuration })"
          type="error"
        />
      </template>

      <Alert
        v-else-if="state?.error?.status === 401"
        testId="login-invalid-credentials"
        :text="t('navigation.auth.incorrectUsernameOrPassword')"
        type="error"
      />

      <Alert v-else-if="state?.error" :text="state?.error.message" type="error" />
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
import { useAsyncState, useTimestamp } from '@vueuse/core';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { OCULAR_TEST_USERNAME, OCULAR_TEST_PASSWORD } = import.meta.env;
const INSECURE_CONNECTION = window.location.protocol === 'http:' && !import.meta.env.OCULAR_HYBRID_MODE;

const emit = defineEmits<{
  close: [];
}>();

defineProps<{
  open: boolean;
  lockDialog?: boolean;
}>();

const time = useTimestamp();
const { t, locale } = useI18n();
const { login } = useStorage();
const { state, executeImmediate } = useAsyncState(login, undefined, {
  immediate: false
});

const username = ref(OCULAR_TEST_USERNAME);
const password = ref(OCULAR_TEST_PASSWORD);

const relativeTimeFormatter = computed(() => new Intl.RelativeTimeFormat(locale.value, { numeric: 'auto' }));

const retryTimeLeft = computed(() => {
  const { status, retry_after, retry_timestamp } = state.value?.error ?? {
    retry_after: undefined,
    retry_timestamp: undefined
  };

  if (status !== 429 || typeof retry_after !== 'number' || typeof retry_timestamp !== 'number') {
    return;
  }

  return retry_after - Math.floor(time.value / 1000 - retry_timestamp);
});

const retryDuration = computed(() => {
  if (!retryTimeLeft.value) return;

  if (retryTimeLeft.value < 1) {
    return undefined;
  }

  if (retryTimeLeft.value < 60) {
    return relativeTimeFormatter.value.format(Math.ceil(retryTimeLeft.value), 'second');
  }

  const minutes = Math.ceil(retryTimeLeft.value / 60);
  return relativeTimeFormatter.value.format(minutes, 'minute');
});

watch(retryTimeLeft, (duration) => {
  if (duration && duration < 1) {
    state.value = undefined;
  }
});

watch(state, (response) => {
  if (response?.data) {
    username.value = '';
    password.value = '';
    emit('close');
  }
});
</script>
