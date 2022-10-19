export const inputValidDecimalOnly = (evt: KeyboardEvent): void | boolean => {
  if (!evt?.target) return true;
  if (!/[0-9]/.test(evt.key)) {
    evt.preventDefault();
    return;
  }
  const currentInput = evt.target as HTMLInputElement;
  if (!currentInput.value) return true;
  if (
    currentInput.value?.length > 9 ||
    !/^[0-9][0-9]*[.]?[0-9]{0,1}$/.test(currentInput.value)
  ) {
    evt.preventDefault();
    return;
  }

  return true;
};
