<template>
  <Pane :class="$style.income" title="Income">
    <BudgetGroups :groups="state.income" type="income"/>
  </Pane>
</template>

<script lang="ts" setup>
import BudgetGroups from '@shared/budget-groups/BudgetGroups.vue';
import Pane from '@shared/Pane.vue';
import {useStore} from '@state/index';

const {state} = useStore();
</script>

<style lang="scss" module>

.income {

}

</style>
