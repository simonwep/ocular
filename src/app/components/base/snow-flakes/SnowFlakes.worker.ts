type SnowFlake = {
  createdAt: number;
  maxAge: number;
  size: number;
  x: number;
  y: number;
  vy: number;
  vx: number;
};

type Config = {
  devicePixelRatio: number;
  snowflakesCount: number;
  snowflakesSize: number;
  snowflakesMinDistance: number;
  canvas: OffscreenCanvas;
  sprite: ImageData;
};

let animationFrameId = -1;
let config: Config | undefined;

self.addEventListener('message', ({ data }) => {
  switch (data.type) {
    case 'start': {
      config = data.config;
      start();
      break;
    }
    case 'update': {
      if (config) {
        Object.assign(config, data.config as Partial<Config>);
        start();
      }
      break;
    }
    case 'resize': {
      if (config) {
        config.canvas.width = data.size.width * config.devicePixelRatio;
        config.canvas.height = data.size.height * config.devicePixelRatio;
      }
    }
  }
});

const start = () => {
  if (!config) return;

  cancelAnimationFrame(animationFrameId);

  let lastTime = 0;
  let firstRun = false;

  const context = config.canvas.getContext('2d')!;

  // Create snowflakes array
  const snowflakes = Array.from(
    { length: config.snowflakesCount },
    (): SnowFlake => ({ createdAt: 0, maxAge: 0, vy: 0, vx: 0, size: 0, x: 0, y: 0 })
  );

  // Generate sprite
  const sprite = new OffscreenCanvas(
    config.snowflakesSize * config.devicePixelRatio,
    config.snowflakesSize * config.devicePixelRatio
  );

  const spriteCtx = sprite.getContext('2d')!;
  spriteCtx.scale(config.devicePixelRatio, config.devicePixelRatio);
  spriteCtx.putImageData(config.sprite, 0, 0);

  // Main function to be called on each animation frame
  const loop = (now: number) => {
    if (!lastTime) lastTime = now;
    if (!config) return;

    const { width, height } = config.canvas;
    const dt = (now - lastTime) / 1000;
    lastTime = now;

    context.clearRect(0, 0, width, height);
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
      context.globalAlpha =
        age < snowflake.maxAge / 2
          ? age / (snowflake.maxAge / 2)
          : 1 - (age - snowflake.maxAge / 2) / (snowflake.maxAge / 2);

      // Update position and draw
      snowflake.x += snowflake.vx * dt;
      snowflake.y += snowflake.vy * dt;

      context.drawImage(sprite, Math.floor(snowflake.x), Math.floor(snowflake.y), snowflake.size, snowflake.size);
    }

    firstRun = false;
    animationFrameId = requestAnimationFrame(loop);
  };

  animationFrameId = requestAnimationFrame(loop);
};
