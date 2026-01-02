import { MaybeRefOrGetter, onScopeDispose, toRef, watch } from 'vue';

type UseKeyboardNavigationOptions = {
  inputs: HTMLInputElement[];
  rows: number;
  cols: number;
};

const arrowEvents = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

export const useKeyboardNavigation = (options: MaybeRefOrGetter<UseKeyboardNavigationOptions>) => {
  const rOptions = toRef(options);
  const controllers = new Set<AbortController>();

  const unbindEvents = () => {
    controllers.forEach((controller) => controller.abort());
    controllers.clear();
  };

  const resolveNextIndex = (currentIndex: number, key: string, cols: number, rows: number) => {
    const currentRow = Math.floor(currentIndex / cols);
    const currentCol = currentIndex % cols;

    switch (key) {
      case 'ArrowUp':
        return currentRow > 0 ? (currentRow - 1) * cols + currentCol : (rows - 1) * cols + currentCol;
      case 'ArrowDown':
        return currentRow < rows - 1 ? (currentRow + 1) * cols + currentCol : currentCol;
      case 'ArrowLeft':
        return currentCol > 0 ? currentRow * cols + (currentCol - 1) : currentRow * cols + (cols - 1);
      case 'ArrowRight':
        return currentCol < cols - 1 ? currentRow * cols + (currentCol + 1) : currentRow * cols;
      default:
        return currentIndex; // Ignore other keys
    }
  };

  const onKeyDown = (event: KeyboardEvent, index: number, options: UseKeyboardNavigationOptions) => {
    if (!event.shiftKey && !event.metaKey && !event.ctrlKey) {
      return;
    }

    const newIndex = resolveNextIndex(index, event.key, options.cols, options.rows);

    if (newIndex !== index) {
      event.preventDefault();
      options.inputs[index].blur();
      options.inputs[newIndex].focus();
    }
  };

  watch(rOptions, (options) => {
    unbindEvents();

    options.inputs.forEach((input) => {
      const controller = new AbortController();
      controllers.add(controller);

      input.addEventListener(
        'keydown',
        (event) => {
          if (!arrowEvents.includes(event.key)) return;

          const sortedInputs = options.inputs.toSorted((a, b) => {
            const position = a.compareDocumentPosition(b);

            if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
              return -1;
            } else if (position & Node.DOCUMENT_POSITION_PRECEDING) {
              return 1;
            }

            return 0;
          });

          const index = sortedInputs.indexOf(input);

          if (index !== -1) {
            onKeyDown(event, index, { ...options, inputs: sortedInputs });
          }
        },
        { signal: controller.signal }
      );
    });
  });

  onScopeDispose(unbindEvents);
};
