<template>
  <div :class="classes">
    <Button icon="download-cloud-2-line" textual @click="save" />
  </div>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import { useStore } from '@state/index';
import { ClassNames, saveFile } from '@utils';
import { computed } from 'vue';

const props = defineProps<{
  class?: ClassNames;
}>();

const classes = computed(() => props.class);
const { state, serialize } = useStore();

const save = () => {
  saveFile(serialize(), `${state.title}.budget`, 'application/json');
};
</script>
