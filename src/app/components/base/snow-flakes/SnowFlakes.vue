<template>
  <canvas ref="canvas" :data-testid="testId" :class="[classes, $style.canvas]" />
</template>

<script lang="ts" setup>
import SnowFlakesWorker from './SnowFlakes.worker.ts?worker';
import { useSvgImageElement } from '@components/base/snow-flakes/SnowFlakes.utils.ts';
import { useCssVarValue } from '@composables/css-var-value/useCssVarValue.ts';
import { ClassNames } from '@utils/types.ts';
import { useElementSize, watchDebounced } from '@vueuse/core';
import { computed, onUnmounted, shallowRef, useTemplateRef, watch } from 'vue';

const SNOWFLAKE_SIZE = 24;
const SNOWFLAKE_MIN_DISTANCE = 2;

const props = defineProps<{
  class: ClassNames;
  testId?: string;
}>();

const classes = computed(() => props.class);

const canvas = useTemplateRef('canvas');
const canvasSize = useElementSize(canvas);
const color = useCssVarValue('--app-snowflakes');
const worker = shallowRef<Worker>();

const image = useSvgImageElement(
  () =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color.value}"><path d="M11.9998 3.29814L14.4451 1.66794L15.5545 3.33204L12.9998 5.03517V10.2678L17.5313 7.65149L17.7289 4.58748L19.7247 4.7162L19.5356 7.64899L22.17 8.95159L21.2836 10.7444L18.5313 9.38354L14.0001 11.9996L18.5317 14.616L21.284 13.2551L22.1704 15.0479L19.536 16.3505L19.7251 19.2833L17.7293 19.412L17.5317 16.348L12.9998 13.7315V18.9648L15.5545 20.6679L14.4451 22.332L11.9998 20.7018L9.55446 22.332L8.44506 20.6679L10.9998 18.9648V13.7319L6.46786 16.3484L6.27026 19.4124L4.2744 19.2836L4.46355 16.3508L1.8291 15.0483L2.71555 13.2554L5.46786 14.6163L10.0001 11.9996L5.46824 9.38319L2.71594 10.7441L1.82948 8.95124L4.46393 7.64864L4.27478 4.71585L6.27064 4.58713L6.46824 7.65113L10.9998 10.2674V5.03517L8.44506 3.33204L9.55446 1.66794L11.9998 3.29814Z"/></svg>`
);

const sprite = computed(() => {
  if (!image.value) return;

  const canvas = document.createElement('canvas');
  canvas.width = SNOWFLAKE_SIZE * window.devicePixelRatio;
  canvas.height = SNOWFLAKE_SIZE * window.devicePixelRatio;

  const ctx = canvas.getContext('2d')!;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  ctx.drawImage(image.value, 0, 0, SNOWFLAKE_SIZE, SNOWFLAKE_SIZE);

  return ctx.getImageData(0, 0, canvas.width, canvas.height);
});

const snowflakeCount = computed(() => Math.floor((canvasSize.width.value * canvasSize.height.value) / 80 ** 2));

watch([sprite, canvas], ([spr, cvs]) => {
  if (!cvs || !spr) return;

  const offscreenCanvas = cvs.transferControlToOffscreen();

  worker.value = new SnowFlakesWorker();
  worker.value!.postMessage(
    {
      type: 'start',
      config: {
        devicePixelRatio: window.devicePixelRatio,
        snowflakesCount: snowflakeCount.value,
        snowflakesSize: SNOWFLAKE_SIZE,
        snowflakesMinDistance: SNOWFLAKE_MIN_DISTANCE,
        canvas: offscreenCanvas,
        sprite: sprite.value
      }
    },
    [offscreenCanvas]
  );
});

watchDebounced(
  [worker, canvasSize.width, canvasSize.height],
  ([wk, width, height]) => {
    wk?.postMessage({
      type: 'resize',
      size: { width, height }
    });
  },
  { debounce: 100 }
);

watchDebounced(
  [worker, snowflakeCount],
  ([wk, count]) => {
    wk?.postMessage({
      type: 'update',
      config: { snowflakesCount: count }
    });
  },
  { debounce: 100 }
);

onUnmounted(() => worker.value?.terminate());
</script>

<style lang="scss" module>
.canvas {
  width: 100%;
  height: 100%;
  z-index: 0;
}
</style>
