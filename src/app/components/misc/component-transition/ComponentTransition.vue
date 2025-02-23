<template>
  <Transition
    :enterActiveClass="$style.transitionTarget"
    :enterFromClass="$style.transitionOrigin"
    :leaveActiveClass="$style.transitionTarget"
    :leaveToClass="$style.transitionOrigin"
    mode="out-in"
  >
    <component :is="is" />
  </Transition>
</template>

<script setup lang="ts">
defineProps<{
  is: object;
}>();
</script>

<style lang="scss" module>
.transitionTarget {
  transition: all var(--transition-s);
}

.transitionOrigin {
  opacity: 0;
}
</style>
