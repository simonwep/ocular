<template>
  <Transition
    :enter-active-class="$style.transitionTarget"
    :enter-from-class="$style.transitionOrigin"
    :leave-active-class="$style.transitionTarget"
    :leave-to-class="$style.transitionOrigin"
    mode="out-in"
  >
    <component v-if="component" :is="component" />
  </Transition>
</template>

<script lang="ts" setup>
import { AsyncTab } from '@components/misc/tabs/Tabs.types';
import { computed } from 'vue';

const props = defineProps<{
  components: AsyncTab[];
  activeTab: string;
}>();

const component = computed(() => {
  return props.components.find((v) => v.id === props.activeTab)?.component;
});
</script>

<style lang="scss" module>
.transitionTarget {
  transition: all var(--transition-s);
}

.transitionOrigin {
  opacity: 0;
}
</style>
