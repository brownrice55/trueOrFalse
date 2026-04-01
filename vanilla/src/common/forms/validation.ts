import type { Inputs } from '../../types/inputs.type';

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

export function setDisabled(
  aAddNewTypeSelectElm: HTMLSelectElement,
  aAddNewTextAreaElms: NodeListOf<HTMLTextAreaElement> | null,
  aFormOptionInputsDivElm: HTMLElement,
  aButtonAddNewElm: HTMLButtonElement | null,
  aElms: string,
  aEvent: string,
  aCurrentVal: Inputs | null
) {
  const checkboxElms = aFormOptionInputsDivElm.querySelectorAll(
    '.js-formOptionsCheckbox'
  );
  const inputTextElms = aFormOptionInputsDivElm.querySelectorAll(
    '.js-formOptionsInputText'
  );

  const elms: NodeListOf<Element> | null =
    aElms === 'textarea'
      ? aAddNewTextAreaElms
      : aElms === 'checkbox'
        ? checkboxElms
        : inputTextElms;

  if (elms) {
    for (const elm of elms) {
      elm.addEventListener(aEvent, function () {
        const type = aAddNewTypeSelectElm.value;

        if (aButtonAddNewElm && aAddNewTextAreaElms) {
          setValidationForDataEntry(
            type,
            aAddNewTextAreaElms,
            aButtonAddNewElm,
            aFormOptionInputsDivElm
          );
        } else {
          const getDataAfterSettingsValidation =
            setValidationForQuizDetailOfIdx3(
              aFormOptionInputsDivElm,
              'quizList'
            );
          const isChecked = getDataAfterSettingsValidation[0];
          const isInputed = getDataAfterSettingsValidation[1];
          const duplicateValuesIndices = getDataAfterSettingsValidation[2];
          const numberOfOptions = getDataAfterSettingsValidation[3];
          const options = getDataAfterSettingsValidation[4];

          const listDlElm = document.querySelector('.js-listDl');
          const listDtElms = listDlElm?.querySelectorAll('dt');
          if (listDtElms) {
            const buttonElms = listDtElms[1].querySelectorAll('button');
            buttonElms[0].disabled =
              (aCurrentVal?.numberOfOptions !== numberOfOptions ||
                JSON.stringify(aCurrentVal?.options) !==
                  JSON.stringify(options)) &&
              isInputed &&
              isChecked &&
              !(duplicateValuesIndices as number[]).length
                ? false
                : true;
          }
        }

        if (aElms === 'checkbox') {
          (elm as HTMLInputElement).dataset.checktemporary = String(
            (elm as HTMLInputElement).checked
          );
        } else if (aElms === 'inputText') {
          (elm as HTMLInputElement).dataset.texttemporary = (
            elm as HTMLInputElement
          ).value;
        }
      });
    }
  }
}

export function setValidation(
  aAddNewTypeSelectElm: HTMLSelectElement,
  aButtonAddNewElm: HTMLButtonElement,
  aAddNewTextAreaElms: NodeListOf<HTMLTextAreaElement>,
  aFormOptionInputsDivElm: HTMLElement
) {
  setDisabled(
    aAddNewTypeSelectElm,
    aAddNewTextAreaElms,
    aFormOptionInputsDivElm,
    aButtonAddNewElm,
    'textarea',
    'keyup',
    null
  );
  setDisabled(
    aAddNewTypeSelectElm,
    aAddNewTextAreaElms,
    aFormOptionInputsDivElm,
    aButtonAddNewElm,
    'checkbox',
    'click',
    null
  );
  setDisabled(
    aAddNewTypeSelectElm,
    aAddNewTextAreaElms,
    aFormOptionInputsDivElm,
    aButtonAddNewElm,
    'inputText',
    'keyup',
    null
  );
}

export function setValidationForDataEntry(
  aType: string,
  aAddNewTextAreaElms: NodeListOf<HTMLTextAreaElement>,
  aButtonAddNewElm: HTMLButtonElement,
  aFormOptionInputsDivElm: HTMLElement
) {
  const isInputed = [...aAddNewTextAreaElms].every((elm) => elm.value);
  setAlertForInputField(
    aAddNewTextAreaElms as NodeListOf<HTMLTextAreaElement>,
    isInputed,
    'textarea'
  );
  aButtonAddNewElm.disabled = isInputed ? false : true;

  if (aType === 'selection') {
    const getDataAfterSettingsValidation = setValidationForQuizDetailOfIdx3(
      aFormOptionInputsDivElm,
      'addNew'
    );
    const isChecked = getDataAfterSettingsValidation[0];
    const isInputed2 = getDataAfterSettingsValidation[1];
    const duplicateValuesIndices = getDataAfterSettingsValidation[2];

    aButtonAddNewElm.disabled =
      isInputed &&
      isChecked &&
      isInputed2 &&
      !(duplicateValuesIndices as number[]).length
        ? false
        : true;
  }
}

export function setValidationForQuizDetailOfIdx3(
  aElm: HTMLElement,
  aPage: string
) {
  const checkboxElms = aElm.querySelectorAll('.js-formOptionsCheckbox');
  const inputTextElms = aElm.querySelectorAll('.js-formOptionsInputText');
  const isChecked = [...checkboxElms].some(
    (elm) => (elm as HTMLInputElement).checked
  );
  const isInputed2 = [...inputTextElms].every(
    (elm) => (elm as HTMLInputElement).value
  );

  setAlertForInputField(
    checkboxElms as NodeListOf<HTMLInputElement>,
    isChecked,
    'checkbox'
  );

  const inputValues: string[] = getInputValues(
    inputTextElms as NodeListOf<HTMLInputElement>,
    true
  );
  const duplicateValuesIndices =
    setInputValidationForDuplicateCheckAndGetDuplicateValuesIndices(
      inputValues,
      inputTextElms as NodeListOf<HTMLInputElement>
    );
  if (!duplicateValuesIndices.length) {
    setAlertForInputField(
      inputTextElms as NodeListOf<HTMLInputElement>,
      isInputed2,
      'inputText'
    );
  }

  const formOptionNumberSelectElm =
    aPage === 'quizList'
      ? document.querySelector('.js-listDl .js-formOptionNumberSelect')
      : null;

  const numberOfOptions = formOptionNumberSelectElm
    ? parseInt((formOptionNumberSelectElm as HTMLSelectElement).value)
    : 2;

  let array: [boolean, string][] = [];
  checkboxElms.forEach((elm, idx: number) => {
    array.push([
      (elm as HTMLInputElement).checked,
      (inputTextElms[idx] as HTMLInputElement).value,
    ]);
  });
  const options = array;

  return [
    isChecked,
    isInputed2,
    duplicateValuesIndices,
    numberOfOptions,
    options,
  ];
}

const setAlertForInputField = (
  aElms: NodeListOf<Element>,
  aIsInputed: boolean,
  aType: string
) => {
  aElms.forEach((elm) => {
    const targetValue =
      aType === 'checkbox'
        ? (elm as HTMLInputElement).checked
        : (elm as HTMLInputElement | HTMLTextAreaElement).value;
    elm.classList.remove('border', 'border-danger', 'border-3');
    if (!targetValue && !aIsInputed) {
      elm.classList.add('border', 'border-danger', 'border-3');
    }
  });
};
