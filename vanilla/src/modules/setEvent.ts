import * as bootstrap from 'bootstrap';
import { setCategoryInputs, setQuizList } from './display';
import {
  resetIsActiveInTheCategoryData,
  displayList,
  setDisabledForListEditBtns,
  getUpdatedCurrentVal,
  setInnerHTMLForEdit,
  setInnerHTMLForEditIrregular,
  resetQuizDetail,
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
          aBsModal
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
  aQuizCategory: Map<number, InputsCategory>,
  aListEditBtnElms: NodeListOf<HTMLButtonElement>,
  aListDlElm: HTMLElement,
  aListDdElms: NodeListOf<HTMLElement>,
  aSectionElms: NodeListOf<HTMLElement>,
  aCurrentValKeys: (keyof Inputs)[],
  aModalForDeleteElms: modalForDeleteElmsType,
  aBsModal: bootstrap.Modal
) {
  let isUnderEdit = false;
  let cancelBtnElm: HTMLButtonElement | null = null;

  aListEditBtnElms.forEach((elm, idx) => {
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
            resetQuizDetail(
              elm,
              idx,
              currentVal as Inputs,
              aQuizCategory,
              aListDdElms,
              aSectionElms,
              aCurrentValKeys,
              aListEditBtnElms
            );
          });
        } else {
          currentVal = getUpdatedCurrentVal(
            idx,
            currentVal as Inputs,
            aCurrentValKeys[idx],
            aListDdElms
          );
          aQuizData.set(key, currentVal);
          localStorage.setItem('quizData', JSON.stringify([...aQuizData]));
          if (!idx) {
            resetIsActiveInTheCategoryData(
              aQuizData,
              aQuizCategory,
              aModalForDeleteElms,
              cancelBtnElm as HTMLButtonElement,
              aSectionElms,
              aCurrentValKeys,
              aBsModal
            );
          }
          if (idx === 2) {
            setQuizList(
              aQuizData,
              aQuizCategory,
              aModalForDeleteElms,
              aSectionElms,
              aCurrentValKeys,
              aBsModal
            );
          }

          elm.textContent = '編集する';
          cancelBtnElm?.remove();
          cancelBtnElm = null;
        }
        if (idx === 3 || idx === 7) {
          setInnerHTMLForEditIrregular(
            idx,
            currentVal as Inputs,
            isUnderEdit,
            aListDdElms
          );
        } else {
          setInnerHTMLForEdit(
            idx,
            currentVal as Inputs,
            isUnderEdit,
            aQuizCategory,
            aListDdElms,
            aSectionElms,
            aCurrentValKeys
          );
        }
        (elm.parentNode?.parentNode?.parentNode as HTMLElement).dataset.add =
          String(true);
      });
    }
  });
}
