<template>
  <ContextMenu
    :tooltip="t('navigation.admin.settings')"
    :position="media === 'mobile' ? 'top' : 'right-end'"
    tooltip-position="right"
    :class="classes"
  >
    <Button icon="shield-flash-line" textual color="dimmed"></Button>

    <template #options>
      <CreateUserButton />
    </template>
  </ContextMenu>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import Button from '@components/base/button/Button.vue';
import ContextMenu from '@components/base/context-menu/ContextMenu.vue';
import { useMediaQuery } from '@composables';
import { ClassNames } from '@utils';
import CreateUserButton from './create-user/CreateUserButton.vue';

const props = defineProps<{
  class: ClassNames;
}>();

const { t } = useI18n();
const media = useMediaQuery();

const classes = computed(() => props.class);
</script>
