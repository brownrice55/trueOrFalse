import type { Inputs } from '../types/inputs.type';
import type { InputsCategory } from '../types/inputsCategory.type';
import { setupDisplay, setCategoryInputs } from '../modules/display';

export function saveCategoryData(
  quizData: Map<number, Inputs>,
  inputCategoryElms: NodeListOf<HTMLInputElement>
) {
  const buttonSaveElm = document.querySelector('.js-buttonSave');
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
      quizData as Map<number, Inputs>
    );
  });
}

export function addCategoryInput() {
  const inputCategoryAreaElm =
    document.querySelector<HTMLElement>('.js-inputCategory');
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

export function setValidation(inputCategoryElms: NodeListOf<HTMLInputElement>) {
  inputCategoryElms.forEach((elm) => {
    elm.addEventListener('keyup', function () {
      let inputValues: string[] = [];
      inputCategoryElms.forEach((elm2) => {
        elm2.classList.remove('border', 'border-danger', 'border-3');
        inputValues.push(elm2.value);
      });

      const inputsArray = Object.values(inputValues);

      const getIndexArray = (inputsArray: string[], aIndex: number) => {
        let result = [];
        for (let cnt = 0, len = inputsArray.length; cnt < len; ++cnt) {
          if (inputsArray[cnt] === inputsArray[aIndex]) {
            result.push(cnt);
          }
        }
        return result;
      };

      let indexArray = getIndexArray(inputsArray, 0);
      indexArray = indexArray.length > 1 ? indexArray : [];

      const getNextIndex = (indexArray: number[], nextIndex: number) => {
        for (let cnt = 0, len = indexArray.length; cnt < len; ++cnt) {
          if (nextIndex === indexArray[cnt]) {
            getNextIndex(indexArray, ++nextIndex);
          }
        }
        return nextIndex;
      };

      let nextIndex = getNextIndex(indexArray, 1);

      for (let cnt = 1, len = inputsArray.length; cnt < len; ++cnt) {
        if (nextIndex < len) {
          nextIndex = getNextIndex(indexArray, cnt);
          let indexArray2 = getIndexArray(inputsArray, cnt);
          if (indexArray.length > 1 && indexArray2.length > 1) {
            indexArray = indexArray.concat(indexArray2);
          } else if (indexArray2.length > 1) {
            indexArray = indexArray2;
          }
        }
      }

      indexArray.forEach((index) => {
        inputCategoryElms[index].classList.add(
          'border',
          'border-danger',
          'border-3'
        );
      });
    });
  });
}
