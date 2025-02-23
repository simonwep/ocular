<template>
  <Dialog :title="t('navigation.admin.createUser')" :open="open" @close="emit('close')">
    <Form :submitLabel="t('navigation.admin.createUser')" @submit="submit">
      <TextField
        v-model="newUser.name"
        :minLength="3"
        :maxLength="32"
        required
        :label="t('navigation.admin.username')"
      />
      <TextField
        v-model="newUser.password"
        required
        :minLength="8"
        :maxLength="64"
        :label="t('navigation.admin.password')"
        type="password"
        showPasswordStrength
      />
      <CheckBox v-model="newUser.admin" :label="t('navigation.admin.admin')" />

      <Alert v-if="state === 'errored'" :text="t('navigation.admin.error')" type="error" />
      <Alert v-if="state === 'conflict'" :text="t('navigation.admin.conflict')" type="error" />
    </Form>
  </Dialog>
</template>

<script lang="ts" setup>
import Alert from '@components/base/alert/Alert.vue';
import CheckBox from '@components/base/check-box/CheckBox.vue';
import Dialog from '@components/base/dialog/Dialog.vue';
import Form from '@components/base/form/Form.vue';
import TextField from '@components/base/text-field/TextField.vue';
import { NewGenesisUser } from '@storage/createGenesisStore';
import { useStorage } from '@storage/index';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

defineProps<{
  open: boolean;
}>();

const { t } = useI18n();
const { createUser } = useStorage();

const state = ref<'idle' | 'loading' | 'conflict' | 'errored'>('idle');
const newUser = reactive<NewGenesisUser>({
  name: '',
  password: '',
  admin: false
});

const submit = () => {
  if (state.value !== 'loading') {
    state.value = 'loading';

    createUser(newUser)
      .then(() => {
        newUser.name = '';
        newUser.password = '';
        state.value = 'idle';
        emit('close');
      })
      .catch((err) => {
        state.value = err instanceof Response && err.status === 409 ? 'conflict' : 'errored';
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
