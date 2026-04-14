import {
  saveCategoryData,
  getCategoryInputHTML,
  resetCategoryForm,
  editOrDeleteCategoryNamesAndSetValidationForInput,
} from './utils';
import { getDataFromLocalStorage } from '../common/dataManagement';
import { getInputValues } from '../common/forms/validation';
import type { Inputs } from '../common/types/inputs.type';
import type { InputsCategory } from '../common/types/inputsCategory.type';
import type { modalForDeleteElmsType } from '../common/types/modalForDeleteElms.type';

export function setCategorySettings(
  aQuizCategory: Map<number, InputsCategory>,
  aQuizData: Map<number, Inputs>,
  aButtonCancelElm: HTMLButtonElement,
  aSectionElms: NodeListOf<HTMLElement>,
  aButtonSaveElm: HTMLButtonElement,
  aButtonAddInputElm: HTMLButtonElement,
  aInputCategoryAreaElm: HTMLElement,
  aModalForDeleteElms: modalForDeleteElmsType,
  aBsModal: bootstrap.Modal,
  aListDivElms: NodeListOf<HTMLElement>
) {
  // set html of input fields
  if (aInputCategoryAreaElm !== null) {
    aInputCategoryAreaElm.innerHTML = getCategoryInputHTML(aQuizCategory);
  }

  const inputCategoryElms: NodeListOf<HTMLInputElement> =
    aInputCategoryAreaElm?.querySelectorAll('input');

  const initialInputValues: string[] = getInputValues(
    inputCategoryElms as NodeListOf<HTMLInputElement>,
    true
  );

  editOrDeleteCategoryNamesAndSetValidationForInput(
    aQuizData,
    aQuizCategory,
    aInputCategoryAreaElm,
    aButtonAddInputElm,
    initialInputValues,
    aButtonCancelElm,
    aButtonSaveElm,
    aModalForDeleteElms,
    aBsModal,
    aSectionElms,
    aListDivElms
  );

  // save data
  aButtonSaveElm?.addEventListener('click', function () {
    saveCategoryData(
      aButtonSaveElm as HTMLButtonElement,
      aInputCategoryAreaElm as HTMLElement,
      aSectionElms,
      aQuizData,
      aQuizCategory,
      aButtonCancelElm,
      aButtonAddInputElm,
      aModalForDeleteElms,
      aBsModal,
      aListDivElms
    );
  });

  const addCategoryNameInputField = () => {
    const keysArray: number[] = aQuizCategory.size
      ? Array.from(aQuizCategory.keys())
      : [];
    const newId: number = aQuizCategory.size
      ? keysArray[keysArray.length - 1] + 1
      : 1;

    const div = document.createElement('div');
    div.classList.add('my-3');

    div.innerHTML = `<input type="text" class="form-control" value="" data-isActive="false" data-index="${newId}" />`;
    aInputCategoryAreaElm?.appendChild(div);
  };
  aButtonAddInputElm?.addEventListener('click', addCategoryNameInputField);

  aButtonCancelElm?.addEventListener('click', function () {
    if (this.dataset.iscategorynameedited === 'true') {
      // reset category inputs : start
      const quizCategory = getDataFromLocalStorage('quizCategory');
      if (aInputCategoryAreaElm !== null) {
        aInputCategoryAreaElm.innerHTML = getCategoryInputHTML(quizCategory);
      }
      const inputCategoryElms: NodeListOf<HTMLInputElement> =
        aInputCategoryAreaElm?.querySelectorAll('input');

      const initialInputValues: string[] = getInputValues(
        inputCategoryElms as NodeListOf<HTMLInputElement>,
        true
      );
      editOrDeleteCategoryNamesAndSetValidationForInput(
        aQuizData,
        quizCategory,
        aInputCategoryAreaElm,
        aButtonAddInputElm,
        initialInputValues,
        aButtonCancelElm,
        aButtonSaveElm,
        aModalForDeleteElms,
        aBsModal,
        aSectionElms,
        aListDivElms
      );
      // reset category inputs : end
      this.dataset.iscategorynameedited = 'false';
    } else {
      resetCategoryForm(aButtonCancelElm, aButtonSaveElm);
      if (aButtonSaveElm.disabled) {
        // remove red borders
        const inputCategoryElms: NodeListOf<HTMLInputElement> =
          aInputCategoryAreaElm?.querySelectorAll('input');
        inputCategoryElms.forEach((elm) => {
          elm.classList.remove('border', 'border-danger', 'border-3');
        });
      }
    }
    aButtonSaveElm.disabled = true;
    aButtonCancelElm.disabled = true;
  });
}
