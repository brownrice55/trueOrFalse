import * as bootstrap from 'bootstrap';
import {
  switchPage,
  setCategoryInputs,
  setQuizList,
  displayPage,
} from '../display';
import { resetIsActiveInTheCategoryData } from '../quizList';
import { resetCategoryForm } from '../categorySettings';
import type { Inputs } from '../../types/inputs.type';
import type { InputsCategory } from '../../types/inputsCategory.type';
import type { modalForDeleteElmsType } from '../../types/modalForDeleteElms.type';
import type { modalForPageTransitionElmsType } from '../../types/modalForPageTransitionElms.type';

export function displayModalToSelectWhatToDoNextAfterSavingData(
  aType: string,
  aTitle: string,
  aNum: number,
  aPage: string,
  aSectionElms: NodeListOf<HTMLElement>
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
            switchPage(switchIndices[cnt], false, {}, null, aSectionElms);
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
  aText2: string,
  aSectionElms: NodeListOf<HTMLElement>
) {
  const modalForPageTransitionDivElm = document.querySelector(
    '.js-modalForPageTransitionDiv'
  );
  const bsModal = new bootstrap.Modal(
    modalForPageTransitionDivElm as HTMLElement
  );

  bsModal.show();

  const textDivElms =
    modalForPageTransitionDivElm?.querySelector('.js-textDiv');

  if (Array.isArray(textDivElms)) {
    const testArray: string[] = [aText, aText2];
    textDivElms.forEach((elm: HTMLElement, idx: number) => {
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
        switchPage(1, false, {}, null, aSectionElms);
      }
      bsModal.hide();
    });
  });
}

export function displayModalForPageTransition(
  aIndex: number,
  aButtonCancelElm: HTMLButtonElement,
  aPatternIndex: number,
  aModalForPageTransitionElms: modalForPageTransitionElmsType,
  aSectionElms: NodeListOf<HTMLElement>
) {
  const globalMenuName = [
    'クイズスタート',
    'クイズ一覧',
    '新規登録',
    'カテゴリー設定',
  ];
  const textArray = [
    [
      '変更内容を全てキャンセルの上、',
      '移動しない',
      '変更内容をキャンセルしてページを移動する',
    ],
    [
      '編集途中のクイズ詳細の変更内容をキャンセルの上、',
      'キャンセルせずに<br />クイズ詳細に戻る',
      '変更内容をキャンセルして<br />ページを移動する',
    ],
    [
      '編集途中のカテゴリー設定とクイズ詳細の変更内容を全てキャンセルの上、',
      '移動しない',
      '変更内容を全てキャンセルして<br />ページを移動する',
    ],
  ];

  const resetAndDisplayPage = (
    aCategoryButtonElms: NodeListOf<HTMLButtonElement>,
    aIndex: number,
    aSectionElms: NodeListOf<HTMLElement>
  ) => {
    if (aCategoryButtonElms) {
      resetCategoryForm(aCategoryButtonElms[0], aCategoryButtonElms[1]);
    }
    displayPage(aIndex, aSectionElms);
  };

  const modalForPageTransitionElms = aModalForPageTransitionElms;
  const buttonCancelElm: HTMLButtonElement | null =
    document.querySelector('.js-buttonCancel');
  if (buttonCancelElm) {
    const modalForPageTransitionDivElm = document.querySelector(
      '.js-modalForPageTransitionDiv'
    );
    const bsModal = new bootstrap.Modal(
      modalForPageTransitionDivElm as HTMLElement
    );
    bsModal.show();
    const textDivElm = modalForPageTransitionElms.textDiv;
    if (textDivElm) {
      textDivElm.innerHTML = `${textArray[aPatternIndex][0]}「${globalMenuName[aIndex]}」に移動しますか？`;
    }
    const pageTransitionButtonAreaDivElm =
      modalForPageTransitionElms.containerDiv;
    const buttonElms =
      pageTransitionButtonAreaDivElm?.querySelectorAll('button');
    buttonElms?.forEach((elm, idx) => {
      if (idx) {
        elm.innerHTML = textArray[aPatternIndex][idx];
      }
    });

    const resetQuizDetail = () => {
      const listDlElm = document.querySelector('.js-listDl');
      if (listDlElm) {
        const listDtElms = listDlElm.querySelectorAll('dt');
        const listDdElms = listDlElm.querySelectorAll('dd');
        const btnElms = listDtElms[0].querySelectorAll('button');
        const saveBtn = btnElms[0];
        const cancelBtn = btnElms[1];
        cancelBtn.remove();
        saveBtn.innerHTML = '編集する';
        listDdElms[0].innerHTML = String(listDdElms[0].dataset.key);
        const listEditBtnElms = document.querySelectorAll('.js-listEditBtn');
        listEditBtnElms.forEach((elm) => {
          (elm as HTMLButtonElement).disabled = false;
        });
      }
      const listDivElms = document.querySelectorAll('.js-listDiv');
      listDivElms[0].classList.remove('d-none');
      listDivElms[1].classList.add('d-none');
    };

    const categoryButtonElms: NodeListOf<HTMLButtonElement> | undefined =
      aButtonCancelElm?.parentNode?.querySelectorAll('button');
    buttonElms?.forEach((elm: HTMLButtonElement, idx: number) => {
      elm.addEventListener('click', function () {
        if (!aPatternIndex) {
          if (idx === 2) {
            resetAndDisplayPage(
              categoryButtonElms as NodeListOf<HTMLButtonElement>,
              aIndex,
              aSectionElms
            );
          }
        } else if (aPatternIndex === 1) {
          if (idx === 1) {
          } else if (idx === 2) {
            resetQuizDetail();
            displayPage(aIndex, aSectionElms);
          }
        } else if (aPatternIndex === 2) {
          if (idx === 2) {
            resetQuizDetail();
            resetAndDisplayPage(
              categoryButtonElms as NodeListOf<HTMLButtonElement>,
              aIndex,
              aSectionElms
            );
          }
        }

        bsModal.hide();
      });
    });
  }
}

export function displayModalForDelete(
  aQuizData: Map<number, Inputs>,
  aQuizCategory: Map<number, InputsCategory>,
  aTargetInputElm: HTMLInputElement | null,
  aModalForDeleteElms: modalForDeleteElmsType,
  aListDivElms: NodeListOf<HTMLElement> | null,
  aListDdElms: NodeListOf<HTMLElement> | null,
  aButtonCancelElm: HTMLButtonElement | null,
  aSectionElms: NodeListOf<HTMLElement>
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
        aModalForDeleteElms as modalForDeleteElmsType,
        aButtonCancelElm as HTMLButtonElement,
        aSectionElms
      );
    } else {
      if (aListDivElms) {
        const key: number = parseInt(aListDivElms[1].dataset.key ?? '10000');
        aQuizData.delete(key);
        localStorage.setItem('quizData', JSON.stringify([...aQuizData]));

        resetIsActiveInTheCategoryData(
          aQuizData,
          aQuizCategory,
          aModalForDeleteElms,
          aButtonCancelElm as HTMLButtonElement,
          aSectionElms
        );

        aListDivElms[0].classList.remove('d-none');
        aListDivElms[1].classList.add('d-none');
        setQuizList(
          aQuizData,
          aQuizCategory,
          aModalForDeleteElms,
          aButtonCancelElm as HTMLButtonElement,
          aSectionElms
        );
      }
    }
    bsModal.hide();
  });
}
