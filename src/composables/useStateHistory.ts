import { nextTick, watch } from 'vue';

export const useStateHistory = <T>(getter: () => T, setter: (v: T) => void) => {
  const snapshots: string[] = [];
  let travelling = false;
  let active = false;
  let index = 0;

  const makeSnapshot = (content: string) => {
    if (!active) {
      snapshots.push(content);
      index = snapshots.length;
      travelling = false;
    }
  };

  const travel = (fn: () => void) => {
    active = true;
    fn();
    travelling = true;
    void nextTick(() => (active = false));
  };

  watch(() => JSON.stringify(getter()), makeSnapshot);
  makeSnapshot(JSON.stringify(getter()));

  return {
    undo() {
      if (index - 1 >= 0 && !active) {
        travel(() => {
          if (!travelling) {
            index--;
          }

          setter(JSON.parse(snapshots[--index]));
        });
      }
    },

    redo() {
      if (index + 1 < snapshots.length && !active) {
        travel(() => {
          setter(JSON.parse(snapshots[++index]));
        });
      }
    }
  };
};
