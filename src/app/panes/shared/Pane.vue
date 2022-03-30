<template>
  <div :class="$style.pane">
    <div :class="$style.header">
      <h1>{{ title + (subTitle ? ` - ${subTitle}` : '') }}</h1>
      <slot name="header"/>
    </div>
    <slot/>
  </div>
</template>

<script lang="ts" setup>

defineProps<{
  title: string;
  subTitle?: string;
}>();

</script>

<style lang="scss" module>

.pane {
  padding: 0 20px 20px;
  height: 100%;
  width: 100%;
  overflow: auto;
  background: var(--app-backround);
}

.header {
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  position: sticky;
  top: 0;
  height: 40px;
  background: var(--app-backround);

  > h1 {
    font-size: var(--font-size-s);
    font-weight: var(--font-weight-l);
    margin-right: auto;
  }
}

</style>
