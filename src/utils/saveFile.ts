export const saveFile = (content: string, fileName: string, contentType: string): void => {
  const link = document.createElement('a');
  link.style.display = 'none';
  document.body.appendChild(link);

  const blob = new Blob([content], { type: contentType });
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();

  document.body.removeChild(link);
};
