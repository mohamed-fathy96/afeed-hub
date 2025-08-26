/**
 *
 * @param size The file size in bytes
 * @returns
 */
export const getFileSize = (size: number) => {
  if (size < 1e6) {
    return `${(size / 1e3).toFixed(1)} KB`;
  } else {
    return `${(size / 1e6).toFixed(1)} MB`;
  }
};
