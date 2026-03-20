import * as bootstrap from 'bootstrap';
import { setCategoryInputs } from './display';
import {
  resetIsActiveInTheCategoryData,
  displayList,
  setDisabledForListEditBtns,
  getUpdatedCurrentVal,
} from './quizList';
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
  aBsModal: bootstrap.Modal
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
        aCurrentValKeys,
        aBsModal
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
          aCurrentValKeys,
          aBsModal
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
          aSectionElms
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

export function editQuizData(
  aQuizData: Map<number, Inputs>,
  aListEditBtnElms: NodeListOf<HTMLButtonElement>,
  aListDlElm: HTMLElement,
  aListDdElms: NodeListOf<HTMLElement>,
  aCurrentValKeys: (keyof Inputs)[]
) {
  let isUnderEdit = false;
  let cancelBtnElm: HTMLButtonElement | null = null;

  aListEditBtnElms.forEach((elm, idx) => {
    const divElms = aListDdElms[idx].querySelectorAll('div');
    if (
      (elm?.parentNode?.parentNode?.parentNode as HTMLElement).dataset.add !==
      'true'
    ) {
      elm.addEventListener('click', function (e) {
        const key = parseInt(
          (aListDlElm.parentNode as HTMLElement).dataset.key ?? '1000'
        );
        let currentVal = aQuizData.get(key);
        isUnderEdit = !isUnderEdit;
        if (elm.dataset.adjustment === 'true') {
          isUnderEdit = true;
          aListEditBtnElms.forEach((elm2) => {
            elm2.dataset.adjustment = 'false';
          });
        }
        setDisabledForListEditBtns(isUnderEdit);

        const targetBtnElm = e.currentTarget;
        if (isUnderEdit) {
          divElms[0].classList.add('d-none');
          divElms[1].classList.remove('d-none');
          elm.textContent = '上書きする';

          if (targetBtnElm) {
            (targetBtnElm as HTMLButtonElement).disabled = false;
          }

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
            this.remove();
            cancelBtnElm = null;
            divElms[0].classList.remove('d-none');
            divElms[1].classList.add('d-none');
            elm.textContent = '編集する';
            isUnderEdit = false;
            setDisabledForListEditBtns(isUnderEdit);
          });
        } else {
          // when clicking save button
          // save a new value
          currentVal = getUpdatedCurrentVal(
            idx,
            currentVal as Inputs,
            aCurrentValKeys[idx],
            aListDdElms
          );
          aQuizData.set(key, currentVal);
          localStorage.setItem('quizData', JSON.stringify([...aQuizData]));
          // display an updated value
          divElms[0].classList.remove('d-none');
          divElms[1].classList.add('d-none');

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
