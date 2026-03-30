import { switchPage } from '../display';
import type { Inputs } from '../types/inputs.type';

export function getAccuracyRate(aVal: Inputs) {
  return (
    (aVal.numberOfAnswers && aVal.numberOfCorrectAnswers
      ? (aVal.numberOfCorrectAnswers / aVal.numberOfAnswers) * 100
      : '0') + '%'
  );
}

export const currentValKeys: (keyof Inputs)[] = [
  'category',
  'type',
  'question',
  'answer',
  'explanation',
  'priority',
  'notes',
  'numberOfCorrectAnswers',
];
export function resetEditQuizBtns(aIsFromModal: boolean) {
  const quizDetailEditCancelBtnElm =
    document.querySelector('.js-quizDetailEditCancelBtn') || null;
  if (!quizDetailEditCancelBtnElm) {
    return;
  }
  const listDlElm = document.querySelector('.js-listDl');
  if (listDlElm) {
    const listDtElms = listDlElm.querySelectorAll('dt');
    const targetListDtElm = aIsFromModal
      ? listDtElms[0]
      : quizDetailEditCancelBtnElm?.parentNode?.parentNode;
    const btnElms = targetListDtElm?.querySelectorAll(
      'button'
    ) as NodeListOf<HTMLButtonElement>;
    const saveBtn = btnElms[0];
    const cancelBtn = btnElms[1];
    cancelBtn.remove();
    saveBtn.innerHTML = '編集する';

    const listEditBtnElms = document.querySelectorAll('.js-listEditBtn');
    listEditBtnElms.forEach((elm) => {
      (elm as HTMLButtonElement).disabled = false;
      if (!aIsFromModal) {
        (elm as HTMLButtonElement).dataset.adjustment = 'true';
      }
    });
  }
}

export function goToCategoryToSetNewCategory(
  aSectionElms: NodeListOf<HTMLElement>,
  aFrom: string,
  aButtonSaveElm: HTMLButtonElement,
  aButtonCancelElm: HTMLButtonElement
) {
  switchPage(3, false, {}, aButtonCancelElm, aSectionElms);
  if (aButtonSaveElm) {
    const className =
      aFrom === 'quizList' ? 'js-quizDataIsUnderEdit' : 'js-newDataIsUnderEdit';
    aButtonSaveElm.classList.add(className);
    const listDdElms = document.querySelectorAll('.js-listDd');
    aButtonSaveElm.dataset.key = (
      listDdElms[0]?.parentNode?.parentNode as HTMLElement
    )?.dataset?.key;
  }
}
