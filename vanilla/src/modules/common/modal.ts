import * as bootstrap from 'bootstrap';
import {
  switchPage,
  displayPage,
  setCategoryInputs,
  setQuizList,
} from '../display';
import { resetIsActiveInTheCategoryData } from '../quizList';
import type { Inputs } from '../../types/inputs.type';
import type { InputsCategory } from '../../types/inputsCategory.type';
import type { modalForDeleteElmsType } from '../../types/modalForDeleteElms.type';

export function displayModalToSelectWhatToDoNextAfterSavingData(
  aType: string,
  aTitle: string,
  aNum: number,
  aPage: string
) {
  const modalForSelectionWhatToDoNextDivElm = document.querySelector(
    '.js-modalForSelectionWhatToDoNextDiv'
  );
  const bsModal = new bootstrap.Modal(
    modalForSelectionWhatToDoNextDivElm as HTMLElement
  );

  bsModal.show();

  if (aType === 'whatToDoNext') {
    const h1Elm = modalForSelectionWhatToDoNextDivElm?.querySelector('h1');
    const spanElms =
      modalForSelectionWhatToDoNextDivElm?.querySelectorAll('span');
    if (h1Elm) {
      h1Elm.innerHTML = aTitle + '完了';
    }
    if (spanElms && spanElms.length) {
      spanElms[0].innerHTML = aTitle;
      spanElms[1].innerHTML = String(aNum);
      spanElms[2].innerHTML = aPage;
    }

    const modalButtonsAreaDivElms = document.querySelectorAll(
      '.js-modalButtonsAreaDiv'
    );
    const divIndices = [
      [0, 1],
      [1, 0],
    ];
    const divIndex = aTitle === '新規登録' ? 0 : 1;
    modalButtonsAreaDivElms[divIndices[divIndex][0]].classList.remove('d-none');
    modalButtonsAreaDivElms[divIndices[divIndex][1]].classList.add('d-none');

    const buttonsForSelectionWhatToDoNextElms =
      modalButtonsAreaDivElms[divIndices[divIndex][0]]?.querySelectorAll(
        'button'
      );

    const switchIndices = aTitle === '新規登録' ? [1, 0] : [2, 1, 0];
    if (buttonsForSelectionWhatToDoNextElms) {
      for (let cnt = 0, len = switchIndices.length; cnt < len; ++cnt) {
        buttonsForSelectionWhatToDoNextElms[cnt + 1].addEventListener(
          'click',
          function () {
            bsModal.hide();
            switchPage(switchIndices[cnt], false);
          }
        );
      }
    }
  } else {
  }
}

export function displayModalToSelectWhetherToGoBackQuizDetailAfterSavingData(
  aButtonSaveElm: HTMLButtonElement,
  aText: string,
  aText2: string
) {
  const modalForPageTransitionDivElm = document.querySelector(
    '.js-modalForPageTransitionDiv'
  );
  const bsModal = new bootstrap.Modal(
    modalForPageTransitionDivElm as HTMLElement
  );

  bsModal.show();

  const textElms = modalForPageTransitionDivElm?.querySelector(
    '.js-modalForPageTransitionTextDiv'
  );

  if (Array.isArray(textElms)) {
    const testArray: string[] = [aText, aText2];
    textElms.forEach((elm: HTMLElement, idx: number) => {
      elm.innerHTML = String(testArray[idx]);
    });
  }

  const pageTransitionButtonAreaDivElm = document.querySelector(
    '.js-pageTransitionButtonAreaDiv'
  );

  const buttonPageTransitionElms =
    pageTransitionButtonAreaDivElm?.querySelectorAll('button');
  if (buttonPageTransitionElms) {
    buttonPageTransitionElms[0].innerHTML = 'ページを移動しない※';
    buttonPageTransitionElms[1].innerHTML = 'クイズ詳細へ戻る';
  }

  buttonPageTransitionElms?.forEach((elm, idx) => {
    elm.addEventListener('click', function () {
      // reset quiz list all to update category names
      aButtonSaveElm.classList.remove('js-quizDataIsUnderEdit');
      // const key = aButtonSaveElm.dataset.key;
      // display quizDetail again***************
      aButtonSaveElm.dataset.key = '0';
      if (!idx) {
        // reset
      } else {
        switchPage(1, false);
      }
      bsModal.hide();
    });
  });
}

export function displayModalForPageTransition(
  aIndex: number,
  aSectionElms: NodeListOf<HTMLElement>
) {
  const buttonCancelElm: HTMLButtonElement | null =
    document.querySelector('.js-buttonCancel');
  if (buttonCancelElm && !buttonCancelElm.disabled) {
    const modalForPageTransitionDivElm = document.querySelector(
      '.js-modalForPageTransitionDiv'
    );
    const bsModal = new bootstrap.Modal(
      modalForPageTransitionDivElm as HTMLElement
    );
    bsModal.show();

    const buttonPageTransitionElm = document.querySelector(
      '.js-buttonPageTransition'
    );
    const formElm = document.querySelector('form');
    if (buttonPageTransitionElm) {
      buttonPageTransitionElm.addEventListener('click', function () {
        formElm?.reset();
        const buttonElms: NodeListOf<HTMLButtonElement> | undefined =
          buttonCancelElm?.parentNode?.querySelectorAll('button');
        if (buttonElms) {
          buttonElms.forEach((elm) => {
            elm.disabled = true;
          });
        }
        bsModal.hide();
        displayPage(aIndex, aSectionElms);
      });
    }
  }
}

export function displayModalForDelete(
  aQuizData: Map<number, Inputs>,
  aQuizCategory: Map<number, InputsCategory>,
  aTargetInputElm: HTMLInputElement | null,
  aModalForDeleteElms: modalForDeleteElmsType,
  aListDivElms: NodeListOf<HTMLElement> | null,
  aListDdElms: NodeListOf<HTMLElement> | null
) {
  const modalForDeleteDivElm = aModalForDeleteElms.containerDiv;
  const modalTextDivElm = aModalForDeleteElms.textDiv;
  const modalTitleH1Elm = aModalForDeleteElms.titleH1;
  const deleteButtonElm = aModalForDeleteElms.deleteButton;

  if (modalTextDivElm) {
    modalTextDivElm.innerHTML = aTargetInputElm
      ? `「${(aTargetInputElm as HTMLInputElement).value}」を削除して、問題に設定済みのカテゴリー名を「指定なし」に変更しますか？`
      : `「${aListDdElms && aListDdElms[2].textContent}」を削除しますか？`;
  }
  if (modalTitleH1Elm) {
    modalTitleH1Elm.innerHTML = aTargetInputElm
      ? 'カテゴリーの削除確認'
      : 'クイズの削除確認';
  }
  if (deleteButtonElm) {
    deleteButtonElm.innerHTML = aTargetInputElm
      ? `削除して問題に設定済みのカテゴリー名を<br />「指定なし」にする`
      : `削除する`;
  }

  const bsModal = new bootstrap.Modal(modalForDeleteDivElm as HTMLElement);
  bsModal.show();

  deleteButtonElm?.addEventListener('click', function () {
    if (aTargetInputElm) {
      const keyNumber = parseInt(
        (aTargetInputElm as HTMLInputElement).dataset.index ?? '10000'
      );
      aQuizCategory.delete(keyNumber);
      localStorage.setItem('quizCategory', JSON.stringify([...aQuizCategory]));

      [...aQuizData].forEach(([_, val]) => {
        if (parseInt(val.category) === keyNumber) {
          val.category = 'unspecified';
        }
      });
      localStorage.setItem('quizData', JSON.stringify([...aQuizData]));

      setCategoryInputs(
        aQuizCategory as Map<number, InputsCategory>,
        aQuizData as Map<number, Inputs>,
        aModalForDeleteElms as modalForDeleteElmsType
      );
    } else {
      if (aListDivElms) {
        const key: number = parseInt(aListDivElms[1].dataset.key ?? '10000');
        aQuizData.delete(key);
        localStorage.setItem('quizData', JSON.stringify([...aQuizData]));

        resetIsActiveInTheCategoryData(
          aQuizData,
          aQuizCategory,
          aModalForDeleteElms
        );

        aListDivElms[0].classList.remove('d-none');
        aListDivElms[1].classList.add('d-none');
        setQuizList(aQuizData, aQuizCategory, aModalForDeleteElms);
      }
    }
    bsModal.hide();
  });
}
