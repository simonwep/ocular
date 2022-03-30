<template>
  <Pane title="Dashboard">
    <Summary :class="$style.graph"/>
  </Pane>
</template>

<script lang="ts" setup>
import Pane from '@shared/Pane.vue';
import Summary from './graphs/Summary.vue';</script>

<style lang="scss" module>

.dashboard {

}

.graph {
  height: 250px;
}

</style>
