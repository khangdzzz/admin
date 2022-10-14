export const makeUniqueName = (name: string | undefined): string => {
  if (!name) return "";
  return name.replace(/\s+/g, " ").trim();
};
