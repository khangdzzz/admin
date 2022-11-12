export const sortByName = (
  previousItem: { name: string },
  currentItem: { name: string }
): number => {
  if (previousItem.name.toLowerCase() > currentItem.name.toLowerCase()) {
    return 1;
  }
  if (previousItem.name.toLowerCase() < currentItem.name.toLowerCase()) {
    return -1;
  }
  return 0;
};
