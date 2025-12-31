import { watchImmediate } from '@vueuse/core';
import { computed, MaybeRefOrGetter, shallowRef, toRef, toValue } from 'vue';

export const useSvgImageElement = (svg: MaybeRefOrGetter<string>) => {
  const value = shallowRef<HTMLImageElement>();

  watchImmediate(toRef(svg), (newSvg) => {
    const image = new Image();
    image.onload = () => (value.value = image);
    image.src = `data:image/svg+xml;base64,${btoa(newSvg)}`;
  });

  return value;
};

type SnowFlake = {
  createdAt: number;
  maxAge: number;
  size: number;
  x: number;
  y: number;
  vy: number;
  vx: number;
};

type SnowFlakesAnimationConfig = {
  canvas: MaybeRefOrGetter<HTMLCanvasElement | undefined>;
  snowflakeImage: MaybeRefOrGetter<HTMLImageElement | undefined>;
  snowflakesCount: number;
  snowflakesSize: number;
  snowflakesMinDistance: number;
};

export const createSnowflakesAnimation = (config: SnowFlakesAnimationConfig) => {
  const dpr = window.devicePixelRatio;
  let lastTime = 0;
  let firstRun = false;

  // Separate snowflake sprite for faster drawing
  const canvas = toRef(config.canvas);
  const sprite = computed(() => {
    const image = toValue(config.snowflakeImage);
    if (!image) return;

    const canvas = document.createElement('canvas');
    canvas.width = config.snowflakesSize * dpr;
    canvas.height = config.snowflakesSize * dpr;

    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);
    ctx.drawImage(image, 0, 0, config.snowflakesSize, config.snowflakesSize);

    return canvas;
  });

  const context = computed(() => {
    if (!canvas.value) return;

    const context = canvas.value.getContext('2d')!;
    context.scale(dpr, dpr);

    return context;
  });

  // Create
  const snowflakes = Array.from(
    { length: config.snowflakesCount },
    (): SnowFlake => ({ createdAt: 0, maxAge: 0, vy: 0, vx: 0, size: 0, x: 0, y: 0 })
  );

  // Main function to be called on each animation frame
  const loop = (now: number) => {
    if (!context.value || !canvas.value || !sprite.value) return;
    if (!lastTime) lastTime = now;

    const { width, height } = canvas.value;
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    context.value.clearRect(0, 0, width, height);
    outer: for (const snowflake of snowflakes) {
      // Revive snowflake
      if (!snowflake.createdAt && Math.random() > 0.9) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = Math.max(3, Math.random() * config.snowflakesSize);

        // Avoid adding snowflakes that are too close to existing ones
        for (const other of snowflakes) {
          if (
            x + config.snowflakesMinDistance + size > other.x &&
            x - config.snowflakesMinDistance < other.x + other.size &&
            y + config.snowflakesMinDistance + size > other.y &&
            y - config.snowflakesMinDistance < other.y + other.size
          ) {
            continue outer;
          }
        }

        snowflake.createdAt = now;
        snowflake.maxAge = Math.random() * 5000 + (firstRun ? 0 : 1000);
        snowflake.vy = Math.random() * 15 + 15;
        snowflake.vx = Math.random() * 5 * (Math.random() < 0.5 ? -1 : 1);
        snowflake.size = size;
        snowflake.x = x;
        snowflake.y = y;
      }

      // Skip dead snowflakes
      const age = now - snowflake.createdAt;
      if (age > snowflake.maxAge) {
        snowflake.createdAt = 0;
        continue;
      }

      // Update opacity
      context.value.globalAlpha =
        age < snowflake.maxAge / 2
          ? age / (snowflake.maxAge / 2)
          : 1 - (age - snowflake.maxAge / 2) / (snowflake.maxAge / 2);

      // Update position and draw
      snowflake.x += snowflake.vx * dt;
      snowflake.y += snowflake.vy * dt;

      context.value.drawImage(
        sprite.value,
        Math.floor(snowflake.x),
        Math.floor(snowflake.y),
        snowflake.size,
        snowflake.size
      );
    }

    firstRun = false;
  };

  return { loop };
};
