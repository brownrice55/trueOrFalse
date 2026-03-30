export function getInputValues(
  aInputCategoryElms: NodeListOf<HTMLInputElement>,
  aIsReset: boolean
) {
  let inputValues: string[] = [];
  aInputCategoryElms.forEach((elm) => {
    if (aIsReset) {
      elm.classList.remove('border', 'border-danger', 'border-3');
    }
    inputValues.push(elm.value);
  });
  return inputValues;
}

const getNextIndex = (
  aInputValues: string[],
  aDuplicateValuesIndices: number[],
  aNextIndex: number
) => {
  if (!aInputValues[aNextIndex]) {
    return ++aNextIndex;
  }
  for (let cnt = 0, len = aDuplicateValuesIndices.length; cnt < len; ++cnt) {
    if (aNextIndex === aDuplicateValuesIndices[cnt]) {
      getNextIndex(aInputValues, aDuplicateValuesIndices, ++aNextIndex);
    }
  }
  return aNextIndex;
};

const getDuplicateValuesIndices = (aInputValues: string[], aIndex: number) => {
  let result: number[] = [];
  aInputValues.forEach((val, cnt) => {
    if (val === aInputValues[aIndex] && aInputValues[aIndex]) {
      result.push(cnt);
    }
  });
  return result;
};

export function setInputValidationForDuplicateCheckAndGetDuplicateValuesIndices(
  aInputValues: string[],
  aInputElms: NodeListOf<HTMLInputElement>
) {
  let duplicateValuesIndices: number[] = [];
  let nextIndex: number = getNextIndex(aInputValues, duplicateValuesIndices, 0);
  const inputValuesLength = aInputValues.length;
  aInputValues.forEach((_, cnt) => {
    if (nextIndex < inputValuesLength) {
      nextIndex = getNextIndex(aInputValues, duplicateValuesIndices, cnt);
      let tempIndices = getDuplicateValuesIndices(aInputValues, cnt);
      if (duplicateValuesIndices.length > 1 && tempIndices.length > 1) {
        if (duplicateValuesIndices.every((i) => i !== tempIndices[0])) {
          duplicateValuesIndices = duplicateValuesIndices.concat(tempIndices);
        }
      } else if (tempIndices.length > 1) {
        duplicateValuesIndices = tempIndices;
      }
    }
  });
  duplicateValuesIndices.forEach((index) => {
    aInputElms[index].classList.add('border', 'border-danger', 'border-3');
  });
  return duplicateValuesIndices;
}
