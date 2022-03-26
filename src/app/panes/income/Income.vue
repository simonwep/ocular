<template>
  <Pane :class="$style.income" title="Income">
    <BudgetGroups :groups="state.income"/>
  </Pane>
</template>

<script lang="ts" setup>
import BudgetGroups from '@components/budget-groups/BudgetGroups.vue';
import {useState} from '@state/index';
import Pane from '../Pane.vue';

const state = useState();
</script>

<style lang="scss" module>

.income {

}

</style>
