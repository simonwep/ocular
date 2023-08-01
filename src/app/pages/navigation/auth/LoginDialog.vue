<template>
  <Dialog :open="open" @close="emit('close')">
    <div :class="$style.fields">
      <h3 :class="$style.title">Sign in</h3>
      <InputField v-model="username" placeholder="Enter your username" label="User" type="text" />
      <InputField
        v-model="password"
        placeholder="Your password"
        show-password-strength
        label="Password"
        type="password"
      />
      <Button :class="$style.btn" text="Sign in" color="success" @click="signIn" />
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Button from '@components/base/button/Button.vue';
import Dialog from '@components/base/dialog/Dialog.vue';
import InputField from '@components/base/input-field/InputField.vue';
import { useStorage } from '@storage/index';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

defineProps<{
  open: boolean;
}>();

const { login } = useStorage();
const username = ref('foo');
const password = ref('hgEiPCZP');
const state = ref<'idle' | 'loading' | 'errored'>('idle');

const signIn = async () => {
  if (state.value !== 'loading') {
    if (await login(username.value, password.value)) {
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
