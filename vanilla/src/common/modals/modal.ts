import * as bootstrap from 'bootstrap';
import { displayPage } from '../utils';
import { displayList, setEventForDisplayDetail } from '../../quizList/utils';
import {
  getCategoryInputHTML,
  resetCategoryForm,
  editOrDeleteCategoryNamesAndSetValidationForInput,
} from '../../categorySettings/utils';
import { resetIsActiveInTheCategoryData } from '../../quizList/utils';
import { getInputValues } from '../forms/validation';
import { resetEditQuizBtns } from '../utils';
import type { Inputs } from '../types/inputs.type';
import type { InputsCategory } from '../types/inputsCategory.type';
import type { modalForDeleteElmsType } from '../types/modalForDeleteElms.type';
import type { modalForPageTransitionElmsType } from '../types/modalForPageTransitionElms.type';

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
            displayPage(switchIndices[cnt], aSectionElms);
          }
        );
      }
    }
  } else {
  }
}

const resetAndDisplayList = (aListDivElms: NodeListOf<HTMLElement>) => {
  resetEditQuizBtns(true);
  aListDivElms[0].classList.remove('d-none');
  aListDivElms[1].classList.add('d-none');
};

export function displayModalToSelectWhetherToGoBackToPrecedingPageAfterSavingData(
  aButtonSaveElm: HTMLButtonElement,
  aText: string,
  aText2: string,
  aSectionElms: NodeListOf<HTMLElement>,
  aListDivElms: NodeListOf<HTMLElement>
) {
  const modalForPageTransitionDivElm = document.querySelector(
    '.js-modalForPageTransitionDiv'
  );
  const bsModal = new bootstrap.Modal(
    modalForPageTransitionDivElm as HTMLElement
  );

  bsModal.show();

  const textDivElm = modalForPageTransitionDivElm?.querySelector('.js-textDiv');

  if (textDivElm) {
    textDivElm.innerHTML = aText;
  }
  if (aText2) {
    const noteTextDivElm =
      modalForPageTransitionDivElm?.querySelector('.js-noteTextDiv');
    if (noteTextDivElm) {
      noteTextDivElm.innerHTML = aText2;
    }
  }

  const pageTransitionButtonAreaDivElm = document.querySelector(
    '.js-pageTransitionButtonAreaDiv'
  );
  const buttonPageTransitionElms =
    pageTransitionButtonAreaDivElm?.querySelectorAll('button');
  if (buttonPageTransitionElms) {
    buttonPageTransitionElms[0].innerHTML = aText2
      ? 'ページを移動しない※'
      : 'ページを移動しない';
    buttonPageTransitionElms[1].innerHTML = aText2
      ? 'クイズ詳細へ戻る'
      : '新規登録へ戻る';
  }

  buttonPageTransitionElms?.forEach((elm, idx) => {
    elm.addEventListener('click', function () {
      if (!idx) {
        if (aText2) {
          resetAndDisplayList(aListDivElms);
        }
      } else {
        const nextPageIndex = aText2 ? 1 : 2;
        displayPage(nextPageIndex, aSectionElms);
      }
      aButtonSaveElm.dataset.isquizdataunderedit = 'false';
      bsModal.hide();
    });
  });
}

export function displayModalForPageTransition(
  aIndex: number,
  aButtonCancelElm: HTMLButtonElement,
  aPatternIndex: number,
  aModalForPageTransitionElms: modalForPageTransitionElmsType,
  aSectionElms: NodeListOf<HTMLElement>,
  aListDivElms: NodeListOf<HTMLElement>
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
    ['新規登録が完了していませんが', '移動しない', 'ページを移動する'],
    [
      '編集途中のカテゴリー設定をキャンセルの上、',
      '移動しない',
      '変更内容をキャンセルして<br />ページを移動する',
    ],
    [
      '編集途中のカテゴリー設定をキャンセルの上、',
      '移動しない',
      'クイズ詳細に戻る',
    ],
    [
      '編集途中のカテゴリー設定をキャンセルの上、',
      '移動しない',
      '新規登録に戻る',
    ],
  ];

  const resetCategoryFormAndDisplayPage = (
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

    const categoryButtonElms: NodeListOf<HTMLButtonElement> | undefined =
      aButtonCancelElm?.parentNode?.querySelectorAll('button');
    buttonElms?.forEach((elm: HTMLButtonElement, idx: number) => {
      elm.addEventListener('click', function () {
        if (!aPatternIndex) {
          if (idx === 2) {
            resetCategoryFormAndDisplayPage(
              categoryButtonElms as NodeListOf<HTMLButtonElement>,
              aIndex,
              aSectionElms
            );
          }
        } else if (categoryButtonElms) {
          if (aPatternIndex === 1) {
            if (idx === 1) {
              displayPage(1, aSectionElms);
            } else if (idx === 2) {
              categoryButtonElms[1].dataset.isquizdataunderedit = 'false';
              resetAndDisplayList(aListDivElms);
              displayPage(aIndex, aSectionElms);
            }
          } else if (aPatternIndex === 2 || aPatternIndex === 5) {
            if (idx === 2) {
              categoryButtonElms[1].dataset.isquizdataunderedit = 'false';
              if (aPatternIndex === 2) {
                resetAndDisplayList(aListDivElms);
              }
              resetCategoryFormAndDisplayPage(
                categoryButtonElms as NodeListOf<HTMLButtonElement>,
                aIndex,
                aSectionElms
              );
            }
          } else if (
            aPatternIndex === 3 ||
            aPatternIndex === 4 ||
            aPatternIndex === 6
          ) {
            if (idx === 2) {
              categoryButtonElms[1].dataset.isnewdataunderedit = 'false';
              displayPage(aIndex, aSectionElms);
              if (aPatternIndex === 4 || aPatternIndex === 6) {
                resetCategoryFormAndDisplayPage(
                  categoryButtonElms as NodeListOf<HTMLButtonElement>,
                  aIndex,
                  aSectionElms
                );
              }
            }
          }
        }
        bsModal.hide();
      });
    });
  }
}

export function showModalForDelete(
  aTargetInputElm: HTMLInputElement | null,
  aModalForDeleteElms: modalForDeleteElmsType,
  aListDdElms: NodeListOf<HTMLElement> | null,
  aBsModal: bootstrap.Modal
) {
  const modalForDeleteDivElm = aModalForDeleteElms.containerDiv;
  const modalTextDivElm = aModalForDeleteElms.textDiv;
  const modalTitleH1Elm = aModalForDeleteElms.titleH1;
  const deleteButtonElm = aModalForDeleteElms.deleteButton;

  if (modalTextDivElm) {
    modalTextDivElm.innerHTML = aTargetInputElm
      ? `「${(aTargetInputElm as HTMLInputElement).value}」を削除して、問題に設定済みのカテゴリー名を「指定なし」に変更しますか？`
      : `「${aListDdElms && (aListDdElms[2].querySelector(':scope > div') as HTMLElement).textContent}」を削除しますか？`;
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

  if (modalForDeleteDivElm) {
    modalForDeleteDivElm.dataset.page = aTargetInputElm
      ? 'category'
      : 'quizlist';

    modalForDeleteDivElm.dataset.key = aTargetInputElm
      ? aTargetInputElm.dataset.index
      : '10000';
  }

  aBsModal.show();
}

export function deleteDataThroughDeleteBtnInTheModal(
  aQuizData: Map<number, Inputs>,
  aQuizCategory: Map<number, InputsCategory>,
  aModalForDeleteElms: modalForDeleteElmsType,
  aBsModal: bootstrap.Modal,
  aButtonSaveElm: HTMLButtonElement,
  aInputCategoryAreaElm: HTMLElement,
  aButtonAddInputElm: HTMLButtonElement,
  aButtonCancelElm: HTMLButtonElement,
  aSectionElms: NodeListOf<HTMLElement>,
  aListDivElms: NodeListOf<HTMLElement>,
  aCurrentValKeys: (keyof Inputs)[],
  aListDdElms: NodeListOf<HTMLElement>,
  aListDtElms: NodeListOf<HTMLElement>,
  aDivIdx3DivElms: NodeListOf<HTMLElement>,
  aButtonBackToListElms: NodeListOf<HTMLButtonElement>,
  aListUlElm: HTMLElement
) {
  const modalForDeleteDivElm = aModalForDeleteElms.containerDiv;
  const deleteButtonElm = aModalForDeleteElms.deleteButton;

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

      // reset category inputs : start
      if (aInputCategoryAreaElm !== null) {
        aInputCategoryAreaElm.innerHTML = getCategoryInputHTML(aQuizCategory);
      }
      const inputCategoryElms: NodeListOf<HTMLInputElement> =
        aInputCategoryAreaElm?.querySelectorAll('input');
      const initialInputValues: string[] = getInputValues(
        inputCategoryElms as NodeListOf<HTMLInputElement>,
        true
      );
      editOrDeleteCategoryNamesAndSetValidationForInput(
        aQuizData,
        aQuizCategory,
        aInputCategoryAreaElm,
        aButtonAddInputElm,
        initialInputValues,
        aButtonCancelElm,
        aButtonSaveElm,
        aModalForDeleteElms,
        aBsModal,
        aSectionElms,
        aListDivElms,
        aListUlElm,
        aCurrentValKeys,
        aListDdElms,
        aListDtElms,
        aDivIdx3DivElms,
        aButtonBackToListElms
      );
      // reset category inputs : end
    } else if (
      modalForDeleteDivElm &&
      modalForDeleteDivElm.dataset.page === 'quizlist'
    ) {
      // delete a question
      if (aListDivElms) {
        const key: number = parseInt(
          (aListDivElms[1] as HTMLElement).dataset.key ?? '10000',
          10
        );
        aQuizData.delete(key);
        localStorage.setItem('quizData', JSON.stringify([...aQuizData]));

        resetIsActiveInTheCategoryData(
          aQuizData,
          aQuizCategory,
          aButtonSaveElm,
          aInputCategoryAreaElm,
          aButtonAddInputElm,
          aButtonCancelElm,
          aModalForDeleteElms,
          aBsModal,
          aSectionElms,
          aListDivElms,
          aListUlElm,
          aCurrentValKeys,
          aListDdElms,
          aListDtElms,
          aDivIdx3DivElms,
          aButtonBackToListElms
        );

        aListDivElms[0].classList.remove('d-none');
        aListDivElms[1].classList.add('d-none');

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
