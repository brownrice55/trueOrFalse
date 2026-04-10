import {
  saveCategoryData,
  setButtonDisabledForCategory,
  getCategoryInputHTML,
  setDisabledStatusForEditAndDeleteButtonsOfCategoryNames,
  setInputValidationForCategory,
} from './utils';
import { showModalForDelete } from '../common/modals/modal';
import type { Inputs } from '../common/types/inputs.type';
import type { InputsCategory } from '../common/types/inputsCategory.type';
import type { modalForDeleteElmsType } from '../common/types/modalForDeleteElms.type';
import { getInputValues } from '../common/forms/validation';

export function setCategorySettings(
  aQuizCategory: Map<number, InputsCategory>,
  aQuizData: Map<number, Inputs>,
  aModalForDeleteElms: modalForDeleteElmsType,
  aButtonCancelElm: HTMLButtonElement,
  aSectionElms: NodeListOf<HTMLElement>,
  aBsModal: bootstrap.Modal,
  aButtonSaveElm: HTMLButtonElement,
  aButtonAddInputElm: HTMLButtonElement,
  aInputCategoryAreaElm: HTMLElement
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

  // edit or delete --- start
  const editBtnElms = document.querySelectorAll<HTMLButtonElement>(
    '.js-categoryEditBtn'
  );
  const deleteBtnElms = document.querySelectorAll<HTMLButtonElement>(
    '.js-categoryDeleteBtn'
  );
  let isUnderEdit: boolean = false;
  let targetInputElm: HTMLInputElement;
  let originalValue: string = '';

  // edit or save data
  editBtnElms.forEach((elm, idx) => {
    elm.addEventListener('click', function (e) {
      isUnderEdit = !isUnderEdit;
      targetInputElm = this.parentNode?.nextSibling as HTMLInputElement;
      const targetEditBtnElm = e.currentTarget as HTMLButtonElement;
      if (targetEditBtnElm) {
        targetEditBtnElm.disabled = isUnderEdit;
        targetEditBtnElm.textContent = isUnderEdit ? '上書きする' : '編集する';
        targetEditBtnElm.classList.add('js-targetEditBtn');
      }
      if (targetInputElm) {
        targetInputElm.disabled = !isUnderEdit;
        targetInputElm.classList.add('js-targetInput');
        targetInputElm.dataset.originalvalue = targetInputElm.value;
      }
      deleteBtnElms[idx].textContent = isUnderEdit ? 'キャンセル' : '削除する';
      setDisabledStatusForEditAndDeleteButtonsOfCategoryNames(
        aInputCategoryAreaElm,
        targetInputElm,
        isUnderEdit
      );

      if (isUnderEdit) {
        targetInputElm.focus();
      } else {
        //when saving the target category name
        const key = parseInt(targetInputElm.dataset.index ?? '10000');
        aQuizCategory.set(key, {
          categoryName: targetInputElm.value,
          isActive: false,
        });
        localStorage.setItem(
          'quizCategory',
          JSON.stringify([...aQuizCategory])
        );
        targetEditBtnElm.classList.remove('js-targetEditBtn');
        targetInputElm.classList.remove('js-targetInput');
      }
    });
  });

  // delete data or cancel change
  deleteBtnElms.forEach((elm, idx) => {
    elm.addEventListener('click', function (e) {
      const targetCancelOrDeleteBtnElm = e.currentTarget as HTMLButtonElement;
      if (isUnderEdit) {
        //when clicking a cancel button
        isUnderEdit = false;
        targetCancelOrDeleteBtnElm.textContent = '削除する';
        editBtnElms[idx].textContent = '編集する';
        editBtnElms[idx].disabled = false;
        targetInputElm.disabled = true;
        targetInputElm.value = originalValue;

        setDisabledStatusForEditAndDeleteButtonsOfCategoryNames(
          aInputCategoryAreaElm,
          targetInputElm,
          isUnderEdit
        );
      } else if (!isUnderEdit) {
        // when deleting data
        const targetInputElm = this?.parentNode?.nextSibling;

        showModalForDelete(
          targetInputElm as HTMLInputElement,
          aModalForDeleteElms,
          null,
          aBsModal
        );
      }
    });
  });

  // edit or delete --- end

  // set validation for input fields
  aInputCategoryAreaElm.addEventListener('keyup', function () {
    setInputValidationForCategory(
      initialInputValues,
      aButtonCancelElm,
      aButtonSaveElm,
      isUnderEdit,
      aInputCategoryAreaElm as HTMLElement
    );
  });

  // save data
  aButtonSaveElm?.addEventListener('click', function () {
    saveCategoryData(
      aButtonSaveElm as HTMLButtonElement,
      aInputCategoryAreaElm as HTMLElement,
      aSectionElms,
      aQuizData,
      aQuizCategory,
      aButtonCancelElm
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

  setButtonDisabledForCategory(
    aButtonSaveElm as HTMLButtonElement,
    initialInputValues as string[],
    aInputCategoryAreaElm as HTMLElement,
    false, //isUnderEdit as boolean,
    aButtonCancelElm as HTMLButtonElement,
    aButtonAddInputElm as HTMLButtonElement
  );
}
