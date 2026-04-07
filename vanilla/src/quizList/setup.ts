import { displayList } from './utils';
import { switchPage } from '../common/utils';
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
  aDivIdx3DivElms: NodeListOf<HTMLElement>
) {
  const listDivElms = document.querySelectorAll('.js-listDiv');
  const listUlElm = document.querySelector('.js-listUl');
  displayList(
    aQuizData,
    aQuizCategory,
    listDivElms as NodeListOf<Element>,
    listUlElm as HTMLElement,
    aModalForDeleteElms,
    aCurrentValKeys,
    aBsModal,
    aSectionElms,
    aButtonSaveElm as HTMLButtonElement,
    aButtonCancelElm,
    aListDtElms,
    aDivIdx3DivElms as NodeListOf<HTMLElement>
  );

  const buttonGoToAddNewElm = document.querySelector('.js-buttonGoToAddNew');
  buttonGoToAddNewElm?.addEventListener('click', function () {
    switchPage(2, false, {}, null, aSectionElms);
  });
}
