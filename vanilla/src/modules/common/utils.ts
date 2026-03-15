import { getDataFromLocalStorage } from '../dataManagement';
import { resetQuizDetail } from '../quizList';
import { switchPage } from '../display';
import type { Inputs } from '../../types/inputs.type';

export function getAccuracyRate(aVal: Inputs) {
  return aVal.numberOfAnswers && aVal.numberOfCorrectAnswers
    ? (aVal.numberOfCorrectAnswers / aVal.numberOfAnswers) * 100
    : '0';
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
export function resetBtns(aIsFromModal: boolean) {
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

    const targetListDtElmIndex = parseInt(
      (targetListDtElm as HTMLElement).dataset.index ?? '0',
      10
    );

    const key = parseInt(
      (targetListDtElm?.parentNode?.parentNode as HTMLElement).dataset.key ??
        '0',
      10
    );
    const quizData = getDataFromLocalStorage('quizData');
    const quizCategory = getDataFromLocalStorage('quizCategory');
    const currentVal = quizData.get(key);
    const listDdElms = document.querySelectorAll('.js-listDl dd');
    const sectionElms = document.querySelectorAll<HTMLElement>('.js-section')!;
    resetQuizDetail(
      saveBtn,
      targetListDtElmIndex,
      currentVal as Inputs,
      quizCategory,
      listDdElms as NodeListOf<HTMLElement>,
      sectionElms as NodeListOf<HTMLElement>,
      currentValKeys,
      listEditBtnElms as NodeListOf<HTMLButtonElement>
    );
  }
}

export function goToCategoryToSetNewCategory(
  aSectionElms: NodeListOf<HTMLElement>,
  aFrom: string
) {
  switchPage(3, false, {}, null, aSectionElms);
  const buttonSaveElm =
    document.querySelector<HTMLButtonElement>('.js-buttonSave');
  if (buttonSaveElm) {
    const className =
      aFrom === 'quizList' ? 'js-quizDataIsUnderEdit' : 'js-newDataIsUnderEdit';
    buttonSaveElm.classList.add(className);
    const listDdElms = document.querySelectorAll('.js-listDd');
    buttonSaveElm.dataset.key = (
      listDdElms[0]?.parentNode?.parentNode as HTMLElement
    )?.dataset?.key;
  }
}
