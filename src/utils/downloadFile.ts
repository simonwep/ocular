export const downloadFile = (content: string, fileName: string, contentType: string): void => {
  downloadBlob(new Blob([content], { type: contentType }), fileName);
};

export const downloadBlob = (data: Blob, fileName: string): void => {
  const link = document.createElement('a');
  link.style.display = 'none';
  document.body.appendChild(link);

  link.href = URL.createObjectURL(data);
  link.download = fileName;
  link.click();

  document.body.removeChild(link);
};
