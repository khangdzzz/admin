export function sortDropdown(
  array: { value: string | boolean | number | undefined; label: string }[]
): { value: string | boolean | number | undefined; label: string }[] {
  return array.sort((a, b) => {
    const labelA = a.label.toLowerCase();
    const labelB = b.label.toLowerCase();
    if (labelA < labelB) {
      return -1;
    }
    if (labelA > labelB) {
      return 1;
    }

    return 0;
  });
}
