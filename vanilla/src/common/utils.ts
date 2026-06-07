import { displayModalForPageTransition } from './modals/modal';
import type { Inputs } from './types/inputs.type';
import type { modalForPageTransitionElmsType } from './types/modalForPageTransitionElms.type';

export function getAccuracyRate(aVal: Inputs) {
  const correctAnswers = aVal.areCorrectAnswers.filter((val) => val);
  return (
    (correctAnswers.length
      ? Math.round(
          (correctAnswers.length / aVal.areCorrectAnswers.length) * 100
        )
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
  aButtonCancelElm: HTMLButtonElement,
  aListDivElms: NodeListOf<HTMLElement>
) {
  switchPage(3, false, {}, aButtonCancelElm, aSectionElms, aListDivElms);
  if (aButtonSaveElm) {
    if (aFrom === 'quizList') {
      aButtonSaveElm.dataset.isquizdataunderedit = 'true';
    } else {
      aButtonSaveElm.dataset.isnewdataunderedit = 'true';
    }
    const listDdElms = document.querySelectorAll('.js-listDd');
    aButtonSaveElm.dataset.key = (
      listDdElms[0]?.parentNode?.parentNode as HTMLElement
    )?.dataset?.key;
  }
}

export function switchPage(
  aIndex: number,
  aIsCategorySettingsUnderEdit: boolean,
  aModalForPageTransitionElms: Partial<modalForPageTransitionElmsType>,
  aButtonCancelElm: HTMLButtonElement | null,
  aSectionElms: NodeListOf<HTMLElement>,
  aListDivElms: NodeListOf<HTMLElement>
) {
  const sectionElms = document.querySelectorAll<HTMLElement>('.js-section')!;

  const hasDnoneArray = Array.from(sectionElms).map((elm) =>
    elm.classList.contains('d-none')
  );

  let isContinued = true;
  if (!hasDnoneArray[1]) {
    //when leaving quizlist
    // reset quizlist
    // setQuizList(aQuizData, aQuizCategory);
    displayPage(aIndex, sectionElms);
  } else if (!hasDnoneArray[3]) {
    //when leaving the category settings
    const buttons = (
      aButtonCancelElm?.parentNode as HTMLElement
    ).querySelectorAll('button');
    const isQuestionUnderEdit =
      buttons[1].dataset.isquizdataunderedit === 'true';
    const isNewDataUnderEdit = buttons[1].dataset.isnewdataunderedit === 'true';

    const setModalFunction = (
      aIndex: number,
      aPageTransitionPatternIndex: number
    ) => {
      displayModalForPageTransition(
        aIndex,
        aButtonCancelElm as HTMLButtonElement,
        aPageTransitionPatternIndex,
        aModalForPageTransitionElms as modalForPageTransitionElmsType,
        aSectionElms,
        aListDivElms
      );
    };

    if (aIsCategorySettingsUnderEdit) {
      isContinued = false;
      let pageTransitionPatternIndex = 0;
      if (isQuestionUnderEdit) {
        pageTransitionPatternIndex = aIndex === 1 ? 5 : 2;
      } else if (isNewDataUnderEdit) {
        pageTransitionPatternIndex = aIndex === 2 ? 6 : 4;
      }
      setModalFunction(aIndex, pageTransitionPatternIndex);
    } else if (isQuestionUnderEdit) {
      if (aIndex !== 1 && aIndex !== 3) {
        isContinued = false;
        setModalFunction(aIndex, 1);
      }
    } else if (isNewDataUnderEdit) {
      if (aIndex !== 2 && aIndex !== 3) {
        isContinued = false;
        setModalFunction(aIndex, 3);
      }
    }
  }
  if (isContinued) {
    displayPage(aIndex, sectionElms);
  }
}

export function displayPage(
  aIndex: number,
  aSectionElms: NodeListOf<HTMLElement>
) {
  aSectionElms.forEach((elm) => {
    elm.classList.add('d-none');
  });
  aSectionElms[aIndex].classList.remove('d-none');
}
