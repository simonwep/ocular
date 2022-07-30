interface Options<M = false> {
  accept?: string;
  multiple?: M;
}

export const selectFile = <M extends boolean, R = M extends true ? File[] : File>({
  accept,
  multiple
}: Options<M> = {}): Promise<R> => {
  const input = document.createElement('input');
  document.body.appendChild(input);

  input.type = 'file';
  input.style.display = 'none';

  accept && (input.accept = accept);
  multiple && (input.multiple = multiple);

  return new Promise((resolve, reject) => {
    input.onchange = () => {
      const files = Array.from(input.files ?? []);
      document.body.removeChild(input);

      if (files.length) {
        resolve((multiple ? files : files[0]) as unknown as R);
      } else {
        reject();
      }
    };

    input.click();
  });
};
