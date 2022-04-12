<template>
  <div :class="classes">
    <Button icon="download-cloud-2-line" color="dimmed" textual @click="save" />
  </div>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import { useDataStore } from '@store/data';
import { ClassNames, saveFile } from '@utils';
import { computed } from 'vue';

const props = defineProps<{
  class?: ClassNames;
}>();

const classes = computed(() => props.class);
const { state, serialize } = useDataStore();

const save = () => {
  saveFile(serialize(), `${state.title}.budget`, 'application/json');
};
</script>
