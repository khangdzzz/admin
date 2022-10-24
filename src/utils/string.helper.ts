export const makeUniqueName = (name: string | undefined): string | null => {
  if (!name) return null;
  return name.replace(/\s+/g, " ").trim();
};
