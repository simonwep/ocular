<template>
  <Dialog :title="t('navigation.admin.createUser')" :open="open" @close="emit('close')">
    <InputFields :submit-label="t('navigation.admin.createUser')" @submit="submit">
      <TextField v-model="newUser.name" :label="t('navigation.admin.username')" />
      <TextField
        v-model="newUser.password"
        :label="t('navigation.admin.password')"
        type="password"
        show-password-strength
      />
      <CheckBoxField v-model="newUser.admin" :label="t('navigation.admin.admin')" />
      <Alert v-if="state === 'errored'" :text="t('navigation.admin.errors.userCreation')" color="danger" />
    </InputFields>
  </Dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Alert from '@components/base/alert/Alert.vue';
import Dialog from '@components/base/dialog/Dialog.vue';
import CheckBoxField from '@components/base/input-field/CheckBoxField.vue';
import InputFields from '@components/base/input-field/InputFields.vue';
import TextField from '@components/base/input-field/TextField.vue';
import { NewGenesisUser } from '@storage/createGenesisStore';
import { useStorage } from '@storage/index';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

defineProps<{
  open: boolean;
}>();

const { t } = useI18n();
const { createUser } = useStorage();

const state = ref<'idle' | 'loading' | 'errored'>('idle');
const newUser = reactive<NewGenesisUser>({
  name: '',
  password: '',
  admin: false
});

const submit = async () => {
  if (state.value !== 'loading') {
    const ok = await createUser(newUser)
      .then(() => true)
      .catch(() => false);

    if (ok) {
      newUser.name = '';
      newUser.password = '';
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
