<template>
  <div :class="classes">
    <Button color="success" icon="upload-cloud-2-line" textual @click="upload"/>
  </div>
</template>

<script lang="ts" setup>
import Button from '@components/button/Button.vue';
import {useStore} from '@state/index';
import {selectFile} from '@utils';
import {computed} from 'vue';

const props = defineProps<{
  class?: any;
}>();

const classes = computed(() => props.class);
const {state, deserialize} = useStore();

const upload = () => selectFile({
  multiple: false,
  accept: '.budget'
}).then(deserialize);
</script>
