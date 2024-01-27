<template>
  <ul :class="$style.list">
    <slot />
  </ul>
</template>

<style lang="scss" module>
.list {
  display: flex;
  flex-direction: column;
  list-style: none outside none;
  gap: 10px;
}
</style>
