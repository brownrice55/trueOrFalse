import * as bootstrap from 'bootstrap';
import { setCategoryInputs } from './display';
import { resetIsActiveInTheCategoryData, displayList } from './quizList';
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
          aSectionElms,
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
