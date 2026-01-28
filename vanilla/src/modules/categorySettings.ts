import type { Inputs } from '../types/inputs.type';
import type { InputsCategory } from '../types/inputsCategory.type';
import {
  setupDisplay,
  setCategoryInputs,
  getCategoryInputHTML,
} from '../modules/display';

export function saveCategoryData(
  quizData: Map<number, Inputs>,
  buttonSaveElm: HTMLButtonElement,
  inputCategoryAreaElm: HTMLElement
) {
  const inputCategoryElms = document.querySelectorAll<HTMLInputElement>(
    '.js-inputCategory input'
  );

  buttonSaveElm?.addEventListener('click', function () {
    let newMap = new Map<number, InputsCategory>();
    let empty = 0;
    let cnt = 0;
    inputCategoryElms.forEach((elm) => {
      if (!elm.value) {
        ++empty;
      }
      let values: InputsCategory = {
        categoryName: '',
        isActive: false,
      };
      if (elm.value) {
        values.categoryName = elm.value;
        values.isActive = true;
        newMap.set(cnt, values);
        ++cnt;
      }
    });
    if (empty === inputCategoryElms.length) {
      return;
    }

    localStorage.setItem('quizCategory', JSON.stringify([...newMap]));

    setupDisplay(
      newMap as Map<number, InputsCategory>,
      quizData as Map<number, Inputs>
    );

    setCategoryInputs(
      newMap as Map<number, InputsCategory>,
      quizData as Map<number, Inputs>,
      buttonSaveElm as HTMLButtonElement,
      inputCategoryAreaElm as HTMLElement
    );
  });
}

export function addCategoryInput(inputCategoryAreaElm: HTMLElement) {
  const buttonAddInputElm =
    document.querySelector<HTMLButtonElement>('.js-buttonAddInput');
  buttonAddInputElm?.addEventListener('click', function () {
    const div = document.createElement('div');

    div.innerHTML = `<div class="my-3">
    <input type="text" class="form-control" value="" data-isActive="false" />
    </div>`;
    inputCategoryAreaElm?.appendChild(div);
  });
}

export function getCategoryInputValues(
  inputCategoryElms: NodeListOf<HTMLInputElement>
) {
  let inputValues: string[] = [];

  inputCategoryElms.forEach((elm) => {
    elm.classList.remove('border', 'border-danger', 'border-3');
    inputValues.push(elm.value);
  });

  return inputValues;
}

export function setValidation(
  buttonSaveElm: HTMLButtonElement,
  initialInputValues: string[],
  quizCategory: Map<number, InputsCategory>,
  inputCategoryAreaElm: HTMLElement
) {
  inputCategoryAreaElm?.addEventListener('keyup', function (e) {
    if (e?.target instanceof HTMLInputElement) {
      (e.target as HTMLInputElement).value = e.target.value.trim();
    }
    const inputCategoryElms = this.querySelectorAll<HTMLInputElement>('input');

    let inputValues: string[] = getCategoryInputValues(inputCategoryElms);

    const buttonCancelElm =
      document.querySelector<HTMLButtonElement>('.js-buttonCancel');
    let isSame =
      JSON.stringify(initialInputValues) ===
      JSON.stringify(inputValues.filter(Boolean));
    if (buttonCancelElm) {
      buttonCancelElm.disabled = isSame;
    }

    buttonCancelElm?.addEventListener('click', function () {
      inputValues = initialInputValues;

      if (inputCategoryAreaElm !== null) {
        inputCategoryAreaElm.innerHTML = getCategoryInputHTML(quizCategory);
      }
      buttonSaveElm.disabled = true;
      this.disabled = true;
    });

    const inputsArray = Object.values(inputValues);

    const getDuplicateValuesIndices = (
      inputsArray: string[],
      aIndex: number
    ) => {
      let result = [];
      for (let cnt = 0, len = inputsArray.length; cnt < len; ++cnt) {
        if (inputsArray[cnt] === inputsArray[aIndex] && inputsArray[aIndex]) {
          result.push(cnt);
        }
      }
      return result;
    };

    let duplicateValuesIndices = getDuplicateValuesIndices(inputsArray, 0);
    duplicateValuesIndices =
      duplicateValuesIndices.length > 1 ? duplicateValuesIndices : [];

    const getNextIndex = (
      aDuplicateValuesIndices: number[],
      aNextIndex: number
    ) => {
      if (!inputsArray[aNextIndex]) {
        return ++aNextIndex;
      }
      for (
        let cnt = 0, len = aDuplicateValuesIndices.length;
        cnt < len;
        ++cnt
      ) {
        if (aNextIndex === aDuplicateValuesIndices[cnt]) {
          getNextIndex(aDuplicateValuesIndices, ++aNextIndex);
        }
      }
      return aNextIndex;
    };

    let nextIndex = getNextIndex(duplicateValuesIndices, 1);

    for (let cnt = 1, len = inputsArray.length; cnt < len; ++cnt) {
      if (nextIndex < len) {
        nextIndex = getNextIndex(duplicateValuesIndices, cnt);
        let indexArray2 = getDuplicateValuesIndices(inputsArray, cnt);
        if (duplicateValuesIndices.length > 1 && indexArray2.length > 1) {
          duplicateValuesIndices = duplicateValuesIndices.concat(indexArray2);
        } else if (indexArray2.length > 1) {
          duplicateValuesIndices = indexArray2;
        }
      }
    }

    duplicateValuesIndices.forEach((index) => {
      inputCategoryElms[index].classList.add(
        'border',
        'border-danger',
        'border-3'
      );
    });

    buttonSaveElm.disabled =
      !duplicateValuesIndices.length && !isSame ? false : true;
  });
}
