export const readFile = (file: File): Promise<string> => {
  const reader = new FileReader();

  return new Promise((resolve) => {
    reader.onload = () => resolve(reader.result as string);
    reader.readAsText(file);
  });
};
