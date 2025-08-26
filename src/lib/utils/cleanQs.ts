export const sanitizeQueryParams = <T extends Record<string, any>>(
  obj: T,
  options: { stripEmptyArrays?: boolean } = {}
): Partial<T> => {
  const { stripEmptyArrays = false } = options;

  const cleaned = Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => {
      const isInvalid =
        value === null ||
        value === undefined ||
        value === "undefined" ||
        value === "null" ||
        value === "" ||
        (typeof value === "number" && isNaN(value));

      const isEmptyArray = Array.isArray(value) && value.length === 0;

      return !isInvalid && (!stripEmptyArrays || !isEmptyArray);
    })
  );

  return cleaned as Partial<T>;
};
