<template>
  <li :class="$style.listItem">
    <slot />
  </li>
</template>

<style lang="scss" module>
.listItem {
  margin: 0;
}
</style>
