import { fileToBase64 } from './base64';

/**
 * Resize image dropped in html input before upload to server
 * If the passed file is not an image, it will not be resized
 *
 * @param file the dropped file
 * @param maxSize the max accepted size in bytes
 */
export const reduceImageSize = async (file: File, maxSize: number): Promise<File> => {
  const notImage = !file.type.startsWith('image/');

  if (maxSize >= file.size || notImage) {
    return file;
  }

  // Keep reducing until be less than 500kb
  let reduced = await reduce(file);

  while (reduced.size > maxSize) {
    reduced = await reduce(reduced);
  }

  return reduced;
};

const reduce = async (file: File): Promise<File> => {
  const base64 = await fileToBase64(file);
  const img = new Image();
  img.src = base64;

  return new Promise((resolve, reject) => {
    img.onload = function () {
      const $this = this as GlobalEventHandlers & {
        width: number;
        height: number;
      };
      const width = $this.width;
      const height = $this.height;

      // Resize ratio 10%
      const ratio = 0.9; // Math.min(maxSize / file.size, 0.5);
      const reducedWidth = width * ratio;
      const reducedHeight = height * ratio;
      const canvas = document.createElement('canvas');
      canvas.width = reducedWidth;
      canvas.height = reducedHeight;

      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, reducedWidth, reducedHeight);

      canvas.toBlob(async (blob) => {
        if (!blob) {
          return reject('Cannot create image from canvas');
        }
        const accepted = new File([blob as Blob], file.name, {
          type: file.type,
        });
        resolve(accepted);
      }, file.type);
    };
  });
};
