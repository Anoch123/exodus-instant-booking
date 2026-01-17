export const getUpdatedFields = (oldData, newData, options = {}) => {
  const {
    ignoreKeys = ["updated_at", "created_at"],
  } = options;

  const changes = {};

  const isEqual = (a, b) => {
    if (Array.isArray(a) && Array.isArray(b)) {
      return JSON.stringify(a) === JSON.stringify(b);
    }
    return a === b;
  };

  Object.keys(newData || {}).forEach((key) => {
    if (ignoreKeys.includes(key)) return;

    if (!isEqual(oldData?.[key], newData?.[key])) {
      changes[key] = {
        old: oldData?.[key] ?? null,
        new: newData?.[key] ?? null,
      };
    }
  });

  return changes;
};
