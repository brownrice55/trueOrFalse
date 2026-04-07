import {
  saveCategoryData,
  setButtonDisabledForCategory,
  editOrDeleteCategoryName,
} from './utils';
import type { Inputs } from '../common/types/inputs.type';
import type { InputsCategory } from '../common/types/inputsCategory.type';
import type { modalForDeleteElmsType } from '../common/types/modalForDeleteElms.type';
import { getInputValues } from '../common/forms/validation';

export function getCategoryInputHTML(
  aQuizCategory: Map<number, InputsCategory>
) {
  let inputsData = '';

  if (aQuizCategory.size) {
    [...aQuizCategory].forEach(([key, val]) => {
      let isDisabled = '';
      inputsData += '<div class="my-3 position-relative">';
      if (val?.isActive) {
        inputsData += `<span>問題に設定済みのカテゴリー名</span>`;
        inputsData += `<div class="position-absolute bottom-0 end-0">
                      <button class="btn btn-primary me-1 js-categoryEditBtn" type="button">編集する</button>
                      <button class="btn btn-primary js-categoryDeleteBtn" type="button">削除する</button>
                    </div>`;
        isDisabled = ' disabled';
      }
      inputsData += `<input type="text" class="form-control" id="input-${key}" value="${val?.categoryName || ''}" data-is-active="${val?.isActive || false}" data-index="${key}" ${isDisabled} />
    </div>`;
    });
  } else {
    Array(3)
      .fill('')
      .forEach((_, index) => {
        inputsData += `<div class="my-3">
        <input type="text" class="form-control" id="input-${index}" value="" data-is-active="false" data-index="${index}" />
        </div>`;
      });
  }
  return inputsData;
}

export function setCategoryInputs(
  aQuizCategory: Map<number, InputsCategory>,
  aQuizData: Map<number, Inputs>,
  aModalForDeleteElms: modalForDeleteElmsType,
  aButtonCancelElm: HTMLButtonElement,
  aSectionElms: NodeListOf<HTMLElement>,
  aBsModal: bootstrap.Modal,
  aButtonSaveElm: HTMLButtonElement,
  aButtonAddInputElm: HTMLButtonElement
) {
  const inputCategoryAreaElm =
    document.querySelector<HTMLElement>('.js-inputCategory');

  if (inputCategoryAreaElm !== null) {
    inputCategoryAreaElm.innerHTML = getCategoryInputHTML(aQuizCategory);
  }

  const inputCategoryElms =
    inputCategoryAreaElm?.querySelectorAll<HTMLInputElement>('input');

  const initialInputValues: string[] = getInputValues(
    inputCategoryElms as NodeListOf<HTMLInputElement>,
    true
  );

  aButtonSaveElm?.addEventListener('click', function (e) {
    e.preventDefault();
    saveCategoryData(
      aButtonSaveElm as HTMLButtonElement,
      inputCategoryAreaElm as HTMLElement,
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
    inputCategoryAreaElm?.appendChild(div);
  };
  aButtonAddInputElm?.addEventListener('click', addCategoryNameInputField);

  editOrDeleteCategoryName(
    inputCategoryAreaElm as HTMLElement,
    initialInputValues,
    aButtonSaveElm as HTMLButtonElement,
    aButtonCancelElm as HTMLButtonElement,
    aButtonAddInputElm as HTMLButtonElement,
    aModalForDeleteElms,
    aBsModal
  );

  let isUnderEdit = false;

  setButtonDisabledForCategory(
    aButtonSaveElm as HTMLButtonElement,
    initialInputValues as string[],
    inputCategoryAreaElm as HTMLElement,
    isUnderEdit as boolean,
    aButtonCancelElm as HTMLButtonElement,
    aButtonAddInputElm as HTMLButtonElement
  );
}
