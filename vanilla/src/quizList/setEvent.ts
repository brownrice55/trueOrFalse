import * as bootstrap from 'bootstrap';
import { getDataFromLocalStorage } from '../common/dataManagement';
import { setCategoryInputs } from '../display';
import {
  resetIsActiveInTheCategoryData,
  displayList,
  setDisabledForListEditBtns,
  getUpdatedCurrentVal,
  setIdx3SelectionPartOfQuizDetailAndValidation,
} from '../quizList/quizList';
import { getEachValueForDivIndex0 } from '../common/forms/form';
import type { Inputs } from '../types/inputs.type';
import type { InputsCategory } from '../types/inputsCategory.type';
import type { modalForDeleteElmsType } from '../types/modalForDeleteElms.type';

export function deleteDataThroughDeleteBtnInTheModal(
  aQuizData: Map<number, Inputs>,
  aQuizCategory: Map<number, InputsCategory>,
  aButtonCancelElm: HTMLButtonElement | null,
  aSectionElms: NodeListOf<HTMLElement>,
  aCurrentValKeys: (keyof Inputs)[],
  aModalForDeleteElms: modalForDeleteElmsType,
  aBsModal: bootstrap.Modal,
  aButtonSaveElm: HTMLButtonElement,
  aListDtElms: NodeListOf<HTMLElement>,
  aDivIdx3DivElms: NodeListOf<HTMLElement>
) {
  const modalForDeleteDivElm = aModalForDeleteElms.containerDiv;
  const deleteButtonElm = aModalForDeleteElms.deleteButton;
  const listDivElms = document.querySelectorAll('.js-listDiv');
  const listUlElm = document.querySelector('.js-listUl');

  const deleteQuizDetailWhenClickingDeleteButton = function (this: any) {
    if (
      modalForDeleteDivElm &&
      modalForDeleteDivElm.dataset.page === 'category'
    ) {
      //delete a category name
      const keyNumber = parseInt(modalForDeleteDivElm.dataset.key ?? '10000');
      aQuizCategory.delete(keyNumber);
      localStorage.setItem('quizCategory', JSON.stringify([...aQuizCategory]));

      [...aQuizData].forEach(([_, val]) => {
        if (parseInt(val.category, 10) === keyNumber) {
          val.category = 'unspecified';
        }
      });
      localStorage.setItem('quizData', JSON.stringify([...aQuizData]));

      setCategoryInputs(
        aQuizCategory as Map<number, InputsCategory>,
        aQuizData as Map<number, Inputs>,
        aModalForDeleteElms as modalForDeleteElmsType,
        aButtonCancelElm as HTMLButtonElement,
        aSectionElms,
        aBsModal,
        aButtonSaveElm
      );
    } else if (
      modalForDeleteDivElm &&
      modalForDeleteDivElm.dataset.page === 'quizlist'
    ) {
      // delete a question
      if (listDivElms) {
        const key: number = parseInt(
          (listDivElms[1] as HTMLElement).dataset.key ?? '10000',
          10
        );
        aQuizData.delete(key);
        localStorage.setItem('quizData', JSON.stringify([...aQuizData]));

        resetIsActiveInTheCategoryData(
          aQuizData,
          aQuizCategory,
          aModalForDeleteElms,
          aButtonCancelElm as HTMLButtonElement,
          aSectionElms,
          aBsModal,
          aButtonSaveElm
        );

        listDivElms[0].classList.remove('d-none');
        listDivElms[1].classList.add('d-none');

        displayList(
          aQuizData,
          aQuizCategory,
          listDivElms as NodeListOf<Element>,
          listUlElm as HTMLElement,
          aModalForDeleteElms,
          aCurrentValKeys,
          aBsModal,
          aSectionElms,
          aButtonSaveElm,
          aButtonCancelElm as HTMLButtonElement,
          aListDtElms,
          aDivIdx3DivElms as NodeListOf<HTMLElement>
        );
      }
    }
    if (modalForDeleteDivElm) {
      modalForDeleteDivElm.dataset.page = '';
    }
    aBsModal.hide();
  };
  deleteButtonElm?.removeEventListener(
    'click',
    deleteQuizDetailWhenClickingDeleteButton
  );
  deleteButtonElm?.addEventListener(
    'click',
    deleteQuizDetailWhenClickingDeleteButton
  );
}

const hideOrShowDivElms = (
  aIdx: number,
  aDivElms: NodeListOf<HTMLElement>,
  aDivIdx3Elms: NodeListOf<HTMLElement>,
  aIsUnderEdit: boolean,
  aCurrentValType: string,
  aDivIdx3DivElms: NodeListOf<HTMLElement>
) => {
  const indices = aIsUnderEdit ? [1, 0] : [0, 1];
  aDivElms[indices[0]].classList.remove('d-none');
  aDivElms[indices[1]].classList.add('d-none');
  if (aDivIdx3Elms && aDivIdx3DivElms && aIdx === 1) {
    aDivIdx3Elms[indices[0]].classList.remove('d-none');
    aDivIdx3Elms[indices[1]].classList.add('d-none');
    const typeIndices = aCurrentValType === 'trueOrFalse' ? [0, 1] : [1, 0];
    aDivIdx3DivElms[typeIndices[0]].classList.remove('d-none');
    aDivIdx3DivElms[typeIndices[1]].classList.add('d-none');
  }
};

export function resetIdx3Form(aCurrentVal: Inputs) {
  // trueOrFalse
  const formAnswerRadioElms = document.querySelectorAll('.js-formAnswerRadio');
  const checkedIndex = aCurrentVal.answer === 0 ? 0 : 1;
  (formAnswerRadioElms[checkedIndex] as HTMLInputElement).checked = true;

  // selection
  const formOptionNumberSelectElm = document.querySelector(
    '.js-listDl  .js-formOptionNumberSelect'
  );
  const formOptionInputsDivElm = document.querySelector(
    '.js-listDl  .js-formOptionInputsDiv'
  );
  const detailTypeElm = document.querySelector('.js-listDl  .js-detailType');
  setIdx3SelectionPartOfQuizDetailAndValidation(
    aCurrentVal,
    formOptionNumberSelectElm as HTMLSelectElement,
    formOptionInputsDivElm as HTMLElement,
    detailTypeElm as HTMLSelectElement
  );
}

export function editQuizData(
  aQuizData: Map<number, Inputs>,
  aQuizCategory: Map<number, InputsCategory>,
  aListEditBtnElms: NodeListOf<HTMLButtonElement>,
  aListDlElm: HTMLElement,
  aListDdElms: NodeListOf<HTMLElement>,
  aCurrentValKeys: (keyof Inputs)[],
  aButtonSaveElm: HTMLButtonElement,
  aDivIdx3Elms: NodeListOf<HTMLElement>,
  aDivIdx3DivElms: NodeListOf<HTMLElement>
) {
  let quizCategory = aQuizCategory;
  let isUnderEdit = false;
  let cancelBtnElm: HTMLButtonElement | null = null;
  let currentVal: Inputs | undefined;

  aListEditBtnElms.forEach((elm, idx) => {
    const divElms = aListDdElms[idx].querySelectorAll('div');
    if (
      (elm?.parentNode?.parentNode?.parentNode as HTMLElement).dataset.add !==
      'true'
    ) {
      elm.addEventListener('click', function () {
        const key = parseInt(
          (aListDlElm.parentNode as HTMLElement).dataset.key ?? '1000'
        );
        currentVal = aQuizData.get(key);
        isUnderEdit = !isUnderEdit;
        if (elm.dataset.adjustment === 'true') {
          isUnderEdit = true;
          aListEditBtnElms.forEach((elm2) => {
            elm2.dataset.adjustment = 'false';
          });
        }
        setDisabledForListEditBtns(isUnderEdit);

        if (isUnderEdit) {
          resetIdx3Form(currentVal as Inputs);
          hideOrShowDivElms(
            idx,
            divElms,
            aDivIdx3Elms as NodeListOf<HTMLElement>,
            isUnderEdit,
            currentVal!.type,
            aDivIdx3DivElms as NodeListOf<HTMLElement>
          );
          elm.textContent = '上書きする';
          elm.disabled = true;

          const cancelBtnElms = document.querySelectorAll('.btn-secondary');
          if (cancelBtnElms) {
            cancelBtnElms.forEach((elm) => {
              if (elm) {
                elm.remove();
              }
            });
          }

          cancelBtnElm = document.createElement('button');
          cancelBtnElm.textContent = 'キャンセル';
          cancelBtnElm.classList.add(
            'btn',
            'btn-secondary',
            'btn-sm',
            'ms-2',
            'js-quizDetailEditCancelBtn'
          );

          elm?.parentNode?.appendChild(cancelBtnElm);
          cancelBtnElm.addEventListener('click', function () {
            isUnderEdit = false;
            this.remove();
            cancelBtnElm = null;
            hideOrShowDivElms(
              idx,
              divElms,
              aDivIdx3Elms as NodeListOf<HTMLElement>,
              isUnderEdit,
              currentVal!.type,
              aDivIdx3DivElms as NodeListOf<HTMLElement>
            );

            elm.textContent = '編集する';
            setDisabledForListEditBtns(isUnderEdit);
            if (idx === 0 || idx === 1 || idx === 5) {
              const selectElm = divElms[1].querySelector('select');
              if (
                selectElm &&
                currentVal &&
                selectElm.value !== currentVal[aCurrentValKeys[idx]]
              ) {
                // restore to the original value
                const optionElms = selectElm?.querySelectorAll('option');
                optionElms.forEach((elm) => {
                  elm.selected = false;
                  if (
                    currentVal &&
                    elm.value === currentVal[aCurrentValKeys[idx]]
                  ) {
                    elm.selected = true;
                  }
                });
              }
              if (idx === 1) {
                resetIdx3Form(currentVal as Inputs);
              }
            } else if (idx === 3) {
              // resetIdx3Form(currentVal as Inputs);
            } else {
              const textareaElm = divElms[1].querySelector('textarea');
              if (textareaElm && currentVal) {
                if (textareaElm.value !== currentVal[aCurrentValKeys[idx]]) {
                  textareaElm.value = String(currentVal[aCurrentValKeys[idx]]);
                }
              }
            }
          });
        } else if (currentVal) {
          // when clicking save button
          // save a new value
          quizCategory = aButtonSaveElm.classList.contains(
            'js-categoryNameIsUpdated'
          )
            ? getDataFromLocalStorage('quizCategory')
            : aQuizCategory;
          if (idx === 1 || idx === 3) {
            if (currentVal.type === 'trueOrFalse') {
              const formAnswerRadioElms = document.querySelectorAll(
                '.js-listDl .js-formAnswerRadio'
              );
              const checkedIndex =
                (formAnswerRadioElms[0] as HTMLInputElement).checked === true
                  ? 0
                  : 1;
              (formAnswerRadioElms[checkedIndex] as HTMLInputElement).checked =
                true;
              currentVal.answer = checkedIndex; //update
              currentVal.numberOfOptions = 2; //default
              currentVal.options = [
                [false, ''],
                [false, ''],
              ]; //default
            } else {
              const formOptionNumberSelectElm = document.querySelector(
                '.js-listDl .js-formOptionNumberSelect'
              );
              currentVal.numberOfOptions = parseInt(
                (formOptionNumberSelectElm as HTMLSelectElement).value
              ); //update

              const checkboxElms = document.querySelectorAll(
                '.js-listDl .js-formOptionsCheckbox'
              );
              const inputTextElms = document.querySelectorAll(
                '.js-listDl .js-formOptionsInputText'
              );
              let array: [boolean, string][] = [];
              checkboxElms.forEach((elm, idx: number) => {
                array.push([
                  (elm as HTMLInputElement).checked,
                  (inputTextElms[idx] as HTMLInputElement).value,
                ]);
              });
              currentVal.options = array; //update
              currentVal.answer = 0; //default
            }
          }
          if (idx !== 3) {
            currentVal = getUpdatedCurrentVal(
              idx,
              currentVal as Inputs,
              aCurrentValKeys[idx],
              aListDdElms
            );
          }
          aQuizData.set(key, currentVal);
          localStorage.setItem('quizData', JSON.stringify([...aQuizData]));
          // display an updated value
          divElms[0].innerHTML = getEachValueForDivIndex0(
            idx,
            currentVal,
            aCurrentValKeys,
            aListDdElms,
            quizCategory
          );
          hideOrShowDivElms(
            idx,
            divElms,
            aDivIdx3Elms as NodeListOf<HTMLElement>,
            isUnderEdit,
            currentVal!.type,
            aDivIdx3DivElms as NodeListOf<HTMLElement>
          );

          // set buttons
          elm.textContent = '編集する';
          cancelBtnElm?.remove();
          cancelBtnElm = null;
        }

        (elm.parentNode?.parentNode?.parentNode as HTMLElement).dataset.add =
          String(true);
      });
    }
  });
}
