import type { Inputs } from '../types/inputs.type';
import type { InputsCategory } from '../types/inputsCategory.type';
import { setupDisplay } from '../modules/display';

export function saveCategoryData(quizData: Map<number, Inputs>) {
  const buttonSaveElm = document.querySelector('.js-buttonSave');
  buttonSaveElm?.addEventListener('click', function () {
    const inputCategoryElms = document.querySelectorAll<HTMLInputElement>(
      '.js-inputCategory input'
    );
    let newMap = new Map<number, InputsCategory>();
    inputCategoryElms.forEach((elm, i) => {
      let values: InputsCategory = {
        categoryId: '',
        categoryName: '',
        isActive: true,
      };
      values.categoryId = self.crypto.randomUUID();
      values.categoryName = elm.value;
      values.isActive = true;
      newMap.set(i, values);
    });
    localStorage.setItem('quizCategory', JSON.stringify([...newMap]));

    setupDisplay(
      newMap as Map<number, InputsCategory>,
      quizData as Map<number, Inputs>
    );
  });
}
