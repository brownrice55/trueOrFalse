import * as bootstrap from 'bootstrap';
import { switchPage, displayPage } from '../display';

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
