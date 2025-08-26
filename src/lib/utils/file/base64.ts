export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (r) {
      const base64 = r.target?.result as string;
      resolve(base64);
    };
    reader.onerror = reject;
  });
};
