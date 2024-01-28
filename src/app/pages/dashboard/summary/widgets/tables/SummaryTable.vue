<template>
  <div :class="$style.summaryTable">
    <h1 v-if="title" :class="$style.title">{{ title }}</h1>

    <div :class="$style.table">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title?: string;
}>();
</script>

<style lang="scss" module>
.summaryTable {
  min-width: 100%;
}

.title {
  font-size: var(--font-size-s);
  font-weight: var(--font-weight-xl);
  margin-bottom: 5px;
  margin-left: 12px;
  position: sticky;
  left: 0;
}

.table {
  padding: 8px;
  background: var(--c-dimmed-light);
  border-radius: var(--border-radius-xxl);
  overflow: auto;

  --grid-layout: 100px repeat(14, minmax(max-content, auto));
}
</style>
