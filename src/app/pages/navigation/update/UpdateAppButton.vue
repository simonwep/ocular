<template>
  <Button
    v-if="needRefresh"
    :class="[classes, { [$style.spin]: updating }]"
    textual
    color="success"
    :tooltip="t('navigation.update.updateApp')"
    :icon="RiLoopRightLine"
    @click="update"
  />
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import { ClassNames } from '@utils/types.ts';
import { RiLoopRightLine } from '@remixicon/vue';
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps<{
  class?: ClassNames;
}>();

const { t } = useI18n();
const { needRefresh, updateServiceWorker } = useRegisterSW();

const updating = ref(false);

const classes = computed(() => props.class);

const update = () => {
  if (updating.value) return;
  updating.value = true;
  updateServiceWorker(true);
};
</script>

<style lang="scss" module>
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.spin {
  animation: rotate 1s linear infinite;
}
</style>
