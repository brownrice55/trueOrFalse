import type { Inputs } from '../types/inputs.type';
import type { InputsCategory } from '../types/inputsCategory.type';
import {
  setupDisplay,
  setCategoryInputs,
  getCategoryInputHTML,
} from '../modules/display';

export function saveCategoryData(
  aQuizData: Map<number, Inputs>,
  aButtonSaveElm: HTMLButtonElement,
  aInputCategoryAreaElm: HTMLElement
) {
  aButtonSaveElm?.addEventListener('click', function () {
    const inputCategoryElms =
      aInputCategoryAreaElm.querySelectorAll<HTMLInputElement>('input');

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
        values.isActive = elm?.dataset?.isActive?.toLowerCase() === 'true';
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
      aQuizData as Map<number, Inputs>
    );

    setCategoryInputs(
      newMap as Map<number, InputsCategory>,
      aQuizData as Map<number, Inputs>,
      aButtonSaveElm as HTMLButtonElement,
      aInputCategoryAreaElm as HTMLElement
    );
  });
}

export function addCategoryInput(aInputCategoryAreaElm: HTMLElement) {
  const buttonAddInputElm =
    document.querySelector<HTMLButtonElement>('.js-buttonAddInput');
  buttonAddInputElm?.addEventListener('click', function () {
    const div = document.createElement('div');
    div.classList.add('my-3');

    div.innerHTML = `<input type="text" class="form-control" value="" data-isActive="false" />`;
    aInputCategoryAreaElm?.appendChild(div);
  });
}

export function getCategoryInputValues(
  aInputCategoryElms: NodeListOf<HTMLInputElement>
) {
  let inputValues: string[] = [];

  aInputCategoryElms.forEach((elm) => {
    elm.classList.remove('border', 'border-danger', 'border-3');
    inputValues.push(elm.value);
  });

  return inputValues;
}

export function setValidation(
  aButtonSaveElm: HTMLButtonElement,
  aInitialInputValues: string[],
  aQuizCategory: Map<number, InputsCategory>,
  aInputCategoryAreaElm: HTMLElement
) {
  aInputCategoryAreaElm?.addEventListener('keyup', function (e) {
    if (e?.target instanceof HTMLInputElement) {
      (e.target as HTMLInputElement).value = e.target.value.trim();
    }
    const inputCategoryElms = this.querySelectorAll<HTMLInputElement>('input');

    let inputValues: string[] = getCategoryInputValues(inputCategoryElms);

    const buttonCancelElm =
      document.querySelector<HTMLButtonElement>('.js-buttonCancel');
    let isSame =
      JSON.stringify(aInitialInputValues) ===
      JSON.stringify(inputValues.filter(Boolean));
    if (buttonCancelElm) {
      buttonCancelElm.disabled = isSame;
    }

    buttonCancelElm?.addEventListener('click', function () {
      inputValues = aInitialInputValues;

      if (aInputCategoryAreaElm !== null) {
        aInputCategoryAreaElm.innerHTML = getCategoryInputHTML(aQuizCategory);
      }
      aButtonSaveElm.disabled = true;
      this.disabled = true;
    });

    const getDuplicateValuesIndices = (
      aInputValues: string[],
      aIndex: number
    ) => {
      let result: number[] = [];

      aInputValues.forEach((val, cnt) => {
        if (val === aInputValues[aIndex] && aInputValues[aIndex]) {
          result.push(cnt);
        }
      });
      return result;
    };

    const getNextIndex = (
      aInputValues: string[],
      aDuplicateValuesIndices: number[],
      aNextIndex: number
    ) => {
      if (!aInputValues[aNextIndex]) {
        return ++aNextIndex;
      }
      for (
        let cnt = 0, len = aDuplicateValuesIndices.length;
        cnt < len;
        ++cnt
      ) {
        if (aNextIndex === aDuplicateValuesIndices[cnt]) {
          getNextIndex(aInputValues, aDuplicateValuesIndices, ++aNextIndex);
        }
      }
      return aNextIndex;
    };

    let duplicateValuesIndices: number[] = [];
    let nextIndex: number = getNextIndex(
      inputValues,
      duplicateValuesIndices,
      0
    );

    const inputValuesLength = inputValues.length;
    inputValues.forEach((_, cnt) => {
      if (nextIndex < inputValuesLength) {
        nextIndex = getNextIndex(inputValues, duplicateValuesIndices, cnt);
        let tempIndices = getDuplicateValuesIndices(inputValues, cnt);
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
      inputCategoryElms[index].classList.add(
        'border',
        'border-danger',
        'border-3'
      );
    });

    aButtonSaveElm.disabled =
      !duplicateValuesIndices.length && !isSame ? false : true;
  });
}
