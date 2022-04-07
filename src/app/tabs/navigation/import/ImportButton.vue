<template>
  <div :class="classes">
    <Button color="success"
            icon="upload-cloud-2-line"
            textual
            @click="showDialog = true"/>

    <ImportDialog :open="showDialog" @close="showDialog = false"/>
  </div>
</template>

<script lang="ts" setup>
import Button from '@components/base/button/Button.vue';
import {useStore} from '@state/index';
import {selectFile} from '@utils';
import {computed, ref} from 'vue';
import ImportDialog from './ImportDialog.vue';

const props = defineProps<{
  class?: any;
}>();

const classes = computed(() => props.class);
const showDialog = ref(false);
const {state, deserialize} = useStore();

const upload = () => selectFile({
  multiple: false,
  accept: '.budget'
}).then(deserialize);
</script>
