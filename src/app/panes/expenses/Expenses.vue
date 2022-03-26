<template>
  <Pane :class="$style.expenses" title="Expenses">
    <BudgetGroups :groups="state.expenses"/>
  </Pane>
</template>

<script lang="ts" setup>
import BudgetGroups from '@components/budget-groups/BudgetGroups.vue';
import {useState} from '@state/index';
import Pane from '../Pane.vue';

const state = useState();
</script>

<style lang="scss" module>

.expenses {

}

</style>
