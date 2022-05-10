<template>
  <RouterView v-slot="{ Component }">
    <Transition
      :enter-active-class="$style.transitionTarget"
      :enter-from-class="$style.transitionOrigin"
      :leave-active-class="$style.transitionTarget"
      :leave-to-class="$style.transitionOrigin"
      mode="out-in"
    >
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style lang="scss" module>
.transitionTarget {
  transition: all var(--transition-s);
}

.transitionOrigin {
  opacity: 0;
}
</style>
