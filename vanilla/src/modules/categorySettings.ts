import type { Inputs } from '../types/inputs.type';
import type { InputsCategory } from '../types/inputsCategory.type';
import { setupDisplay, setCategoryInputs } from '../modules/display';

export function saveCategoryData(quizData: Map<number, Inputs>) {
  const buttonSaveElm = document.querySelector('.js-buttonSave');
  buttonSaveElm?.addEventListener('click', function () {
    const inputCategoryElms = document.querySelectorAll<HTMLInputElement>(
      '.js-inputCategory input'
    );
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
