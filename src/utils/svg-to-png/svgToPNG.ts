export const svgToPNG = (svgString: string, scale = 1) => {
  const img = new Image();
  const svg = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svg);

  return new Promise<Blob>((resolve, reject) => {
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const width = img.width * scale;
      const height = img.height * scale;

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);

      canvas.toBlob((v) => (v ? resolve(v) : reject(new Error('Failed to convert canvas to PNG blob'))), 'image/png');
    };

    img.onerror = () => reject(new Error('Failed to load image for PNG conversion'));
    img.src = url;
  });
};
