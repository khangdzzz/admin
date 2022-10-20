export const inputValidDecimalOnly = (evt: KeyboardEvent): void | boolean => {
  if (!evt?.target) return true;

  const currentInput = evt.target as HTMLInputElement;
  const oldVal = currentInput.value;
  setTimeout(() => {
    const newVal = currentInput.value;
    if (currentInput.value?.length > 8 || !/^\d*(\.\d{0,2})?$/.test(newVal))
      currentInput.value = oldVal;
  }, 1);

  // if (!/[0-9.]/.test(evt.key)) {
  //   evt.preventDefault();
  //   return;
  // }
  // const currentInput = evt.target as HTMLInputElement;
  // console.log(currentInput.selectionStart);
  // if (!currentInput.value) return true;
  // if (
  //   currentInput.value?.length > 9 ||
  //   !/^[0-9][0-9]*[.]?[0-9]{0,1}$/.test(currentInput.value)
  // ) {
  //   evt.preventDefault();
  //   return;
  // }

  return true;
};
