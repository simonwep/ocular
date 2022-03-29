<template>
  <div :class="[$style.saveButton, classes]">
    <Button color="success" icon="download-cloud-2-line" textual @click="save"/>
  </div>
</template>

<script lang="ts" setup>
import Button from '@components/button/Button.vue';
import {useStore} from '@state/index';
import {saveFile} from '@utils';
import {computed} from 'vue';

const props = defineProps<{
  class: any;
}>();

const classes = computed(() => props.class);
const {state, serialize} = useStore();

const save = () => {
  saveFile(serialize(), `${state.title}.json`, 'application/json');
};
</script>

<style lang="scss" module>

.saveButton {

}

</style>
