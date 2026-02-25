import * as bootstrap from 'bootstrap';
import { switchPage, displayPage } from '../display';

export function displayModalToSelectWhatToDoNext(
  aTitle: string,
  aNum: number,
  aType: string
) {
  const modalForSelectionWhatToDoNextDivElm = document.querySelector(
    '.js-modalForSelectionWhatToDoNextDiv'
  );
  const bsModal = new bootstrap.Modal(
    modalForSelectionWhatToDoNextDivElm as HTMLElement
  );

  bsModal.show();

  const h1Elm = modalForSelectionWhatToDoNextDivElm?.querySelector('h1');
  const spanElms =
    modalForSelectionWhatToDoNextDivElm?.querySelectorAll('span');
  if (h1Elm) {
    h1Elm.innerHTML = aTitle + '完了';
  }
  if (spanElms && spanElms.length) {
    spanElms[0].innerHTML = aTitle;
    spanElms[1].innerHTML = String(aNum);
    spanElms[2].innerHTML = aType;
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
