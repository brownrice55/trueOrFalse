import { displayList, setEventForDisplayDetail } from './utils';
import { showModalForDelete } from '../common/modals/modal';
import { switchPage, resetEditQuizBtns } from '../common/utils';
import type { Inputs } from '../common/types/inputs.type';
import type { InputsCategory } from '../common/types/inputsCategory.type';
import type { modalForDeleteElmsType } from '../common/types/modalForDeleteElms.type';

export function setQuizList(
  aQuizData: Map<number, Inputs>,
  aQuizCategory: Map<number, InputsCategory>,
  aModalForDeleteElms: modalForDeleteElmsType,
  aSectionElms: NodeListOf<HTMLElement>,
  aCurrentValKeys: (keyof Inputs)[],
  aBsModal: bootstrap.Modal,
  aButtonSaveElm: HTMLButtonElement,
  aButtonCancelElm: HTMLButtonElement,
  aListDtElms: NodeListOf<HTMLElement>,
  aListDdElms: NodeListOf<HTMLElement>,
  aDivIdx3DivElms: NodeListOf<HTMLElement>,
  aButtonBackToListElms: NodeListOf<HTMLButtonElement>,
  aListDivElms: NodeListOf<HTMLElement>,
  aListUlElm: HTMLElement
) {
  displayList(aQuizData, aListUlElm as HTMLElement);
  setEventForDisplayDetail(
    aQuizData,
    aQuizCategory,
    aListDivElms,
    aCurrentValKeys,
    aListDdElms,
    aSectionElms,
    aButtonSaveElm,
    aButtonCancelElm,
    aListDtElms,
    aDivIdx3DivElms,
    aButtonBackToListElms
  );

  aButtonBackToListElms.forEach((elm) => {
    elm.addEventListener('click', function () {
      aListDivElms[0].classList.remove('d-none');
      aListDivElms[1].classList.add('d-none');
      resetEditQuizBtns(false);
      if (this.classList.contains('js-questionIsUpdated')) {
        displayList(aQuizData, aListUlElm as HTMLElement);
        setEventForDisplayDetail(
          aQuizData,
          aQuizCategory,
          aListDivElms,
          aCurrentValKeys,
          aListDdElms,
          aSectionElms,
          aButtonSaveElm,
          aButtonCancelElm,
          aListDtElms,
          aDivIdx3DivElms,
          aButtonBackToListElms
        );
      }
    });
  });

  const buttonDeleteQuizElm = document.querySelector('.js-buttonDeleteQuiz');
  buttonDeleteQuizElm?.addEventListener('click', function () {
    showModalForDelete(
      null,
      aModalForDeleteElms,
      aListDdElms as NodeListOf<HTMLElement>,
      aBsModal
    );
  });

  const buttonGoToAddNewElm = document.querySelector('.js-buttonGoToAddNew');
  buttonGoToAddNewElm?.addEventListener('click', function () {
    switchPage(2, false, {}, null, aSectionElms, aListDivElms);
  });
}
