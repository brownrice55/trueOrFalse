import { setCategoryInputs } from './display';
import { getDataFromLocalStorage } from './dataManagement';
import {
  getHTMLForOptionInputsOfSelection,
  getEachValueForDivIndex0,
  setDivIndex1FormForQuizDetailIdx0Category,
  getFormElements,
} from './common/form';
// import { setDisabled } from './addNew';
import { showModalForDelete } from './common/modal';
import { resetEditQuizBtns } from './common/utils';
import { getAccuracyRate } from './common/utils';
import type { Inputs } from '../types/inputs.type';
import type { InputsCategory } from '../types/inputsCategory.type';
import type { modalForDeleteElmsType } from '../types/modalForDeleteElms.type';
import type { ListenerForShowModalForDeleteType } from '../types/listenerForShowModalForDelete.type';
import type { FormElementsIrregularIndex3Type } from '../types/formElementsIrregularIndex3.type';

export function getUpdatedCurrentVal<K extends keyof Inputs>(
  aIdx: number,
  aCurrentVal: Inputs,
  aCurrentValKey: K,
  aListDdElms: NodeListOf<HTMLElement>
): Inputs {
  if (!aIdx || aIdx === 1 || aIdx === 5) {
    const selectElm = aListDdElms[aIdx].querySelector(
      'select'
    ) as HTMLSelectElement | null;
    if (selectElm && typeof aCurrentVal[aCurrentValKey] === 'string') {
      (aCurrentVal as any)[aCurrentValKey] = (
        selectElm as HTMLSelectElement
      ).value;
    }
    if (aIdx === 1) {
      if (aCurrentVal.type === 'trueOrFalse') {
        const addNewAnswerRadioElms = document.querySelectorAll(
          '.js-addNewAnswerRadio'
        );

        aCurrentVal.answer = (addNewAnswerRadioElms[0] as HTMLInputElement)
          .checked
          ? 0
          : 1;
      } else {
        //selection
        const addNewOptionNumberSelectElm = document.querySelector(
          '.js-addNewOptionNumberSelect'
        );
        aCurrentVal.numberOfOptions = parseInt(
          (addNewOptionNumberSelectElm as HTMLSelectElement).value,
          10
        );
        const addNewOptionsCheckboxElms = document.querySelectorAll(
          '.js-addNewOptionsCheckbox'
        );
        const addNewOptionsInputTextElms = document.querySelectorAll(
          '.js-addNewOptionsInputText'
        );
        let newArray: [boolean, string][] = [];
        Array(aCurrentVal.numberOfOptions)
          .fill('')
          .forEach((_, idx) => {
            newArray.push([
              (addNewOptionsCheckboxElms[idx] as HTMLInputElement).checked,
              (addNewOptionsInputTextElms[idx] as HTMLInputElement).value,
            ]);
          });
        aCurrentVal.options = newArray;
      }
    }
  } else if (aIdx === 2 || aIdx === 4 || aIdx === 6) {
    const textareaElm = aListDdElms[aIdx].querySelector(
      'textarea'
    ) as HTMLTextAreaElement | null;
    if (textareaElm && typeof aCurrentVal[aCurrentValKey] === 'string') {
      (aCurrentVal as any)[aCurrentValKey] = textareaElm.value;
    }
  }
  return aCurrentVal;
}

export function setDisabledForListEditBtns(aIsUnderEdit: boolean) {
  const listEditBtnElms = document.querySelectorAll('.js-listEditBtn');
  listEditBtnElms.forEach((elm) => {
    (elm as HTMLButtonElement).disabled = aIsUnderEdit ? true : false;
  });
}

export function displayDetail(
  aCurrentVal: Inputs,
  aCurrentValKeys: (keyof Inputs)[],
  aListDdElms: NodeListOf<HTMLElement>,
  aQuizCategory: Map<number, InputsCategory>,
  aSectionElms: NodeListOf<HTMLElement>,
  aButtonSaveElm: HTMLButtonElement,
  aButtonCancelElm: HTMLButtonElement
) {
  const formElementsArray = getFormElements(
    aQuizCategory,
    aCurrentVal,
    aButtonSaveElm,
    'quizlist'
  );
  const formElements = formElementsArray[0] as string[];
  const formElementsIrregularIndex3 =
    formElementsArray[1] as FormElementsIrregularIndex3Type;

  aCurrentValKeys.forEach((_, idx: number) => {
    const divElms = aListDdElms[idx].querySelectorAll('div');

    if (idx === 7) {
      aListDdElms[7].innerHTML = String(getAccuracyRate(aCurrentVal));
    } else {
      divElms[1].classList.add('d-none');
      divElms[0].innerHTML = getEachValueForDivIndex0(
        idx,
        aCurrentVal,
        aCurrentValKeys,
        aListDdElms,
        aQuizCategory
      );

      if (idx === 3) {
        const divDivElms = divElms[1].querySelectorAll('div');
        divDivElms[0].innerHTML = formElementsIrregularIndex3['trueOrFalse'];
        divDivElms[1].innerHTML = formElementsIrregularIndex3['selection'];

        const addNewAnswerRadioElms = document.querySelectorAll(
          '.js-addNewAnswerRadio'
        );
        const checkedIndex = aCurrentVal.answer == 0 ? 0 : 1;
        (addNewAnswerRadioElms[checkedIndex] as HTMLInputElement).checked =
          true;
        // trueOrFalse end

        //selection start
        const addNewOptionNumberSelectElm = divElms[1].querySelector(
          '.js-addNewOptionNumberSelect'
        );

        const numberOfOptions = aCurrentVal.numberOfOptions
          ? aCurrentVal.numberOfOptions
          : 2;

        if (addNewOptionNumberSelectElm) {
          (addNewOptionNumberSelectElm as HTMLSelectElement).value =
            String(numberOfOptions);
        }
        const addNewOptionInputsDivElm = divElms[1].querySelector(
          '.js-addNewOptionInputsDiv'
        );

        if (addNewOptionInputsDivElm) {
          (addNewOptionInputsDivElm as HTMLElement).innerHTML =
            getHTMLForOptionInputsOfSelection(
              numberOfOptions,
              addNewOptionInputsDivElm as HTMLElement,
              'quizlist'
            );
        }

        addNewOptionNumberSelectElm?.addEventListener('change', function (e) {
          (addNewOptionInputsDivElm as HTMLElement).innerHTML =
            getHTMLForOptionInputsOfSelection(
              parseInt((e.currentTarget as HTMLSelectElement).value),
              addNewOptionInputsDivElm as HTMLElement,
              'quizlist'
            );
        });
        //selection end

        // idx===3 end
      } else {
        if (idx === 0) {
          setDivIndex1FormForQuizDetailIdx0Category(
            aQuizCategory,
            aCurrentVal,
            aSectionElms,
            aListDdElms,
            divElms[1],
            aButtonSaveElm,
            aButtonCancelElm
          );
        } else {
          divElms[1].innerHTML = formElements[idx];
        }
        if (idx === 1) {
          const typeSelectElm = divElms[1].querySelector('select');
          const answerDivElms = aListDdElms[3].querySelectorAll('div');
          const answerDivDivElms = answerDivElms[1].querySelectorAll('div');
          typeSelectElm?.addEventListener('change', function (e) {
            const indices =
              (e.currentTarget as HTMLSelectElement).value === 'trueOrFalse'
                ? [0, 1]
                : [1, 0];
            answerDivDivElms[indices[0]].classList.remove('d-none');
            answerDivDivElms[indices[1]].classList.add('d-none');
          });
        }
      }
    }
  });
}

export function resetQuizDetail(
  aElm: HTMLButtonElement,
  aIdx: number,
  aCurrentVal: Inputs,
  aQuizCategory: Map<number, InputsCategory>,
  aListDdElms: NodeListOf<HTMLElement>,
  aSectionElms: NodeListOf<HTMLElement>,
  aCurrentValKeys: (keyof Inputs)[],
  aListEditBtnElms: NodeListOf<HTMLButtonElement>
) {
  let isUnderEdit = false;
  setDisabledForListEditBtns(isUnderEdit);
  aElm.textContent = '編集する';

  if (aIdx === 3 || aIdx === 7) {
    // ******
    console.log(aQuizCategory);
    console.log(aCurrentVal);
    console.log(aCurrentValKeys);
    console.log(aListDdElms);
    console.log(aSectionElms);
  } else {
    // ******
  }
  aListEditBtnElms.forEach((elm) => {
    elm.dataset.adjustment = 'true';
  });
}

const setEventForBackToListPage = (aListDivElms: NodeListOf<HTMLElement>) => {
  const buttonBackToListElms = document.querySelectorAll(
    '.js-buttonBackToList'
  );

  buttonBackToListElms.forEach((elm) => {
    elm.addEventListener('click', function () {
      aListDivElms[0].classList.remove('d-none');
      aListDivElms[1].classList.add('d-none');
      resetEditQuizBtns(false);
    });
  });
};

export function displayList(
  aQuizData: Map<number, Inputs>,
  aQuizCategory: Map<number, InputsCategory>,
  aListDivElms: NodeListOf<Element>,
  aListUlElm: HTMLElement,
  aModalForDeleteElms: modalForDeleteElmsType,
  aCurrentValKeys: (keyof Inputs)[],
  aBsModal: bootstrap.Modal,
  aSectionElms: NodeListOf<HTMLElement>,
  aButtonSaveElm: HTMLButtonElement,
  aButtonCancelElm: HTMLButtonElement
) {
  let liHtml = '';
  [...aQuizData].forEach(([idx, val]) => {
    liHtml += `<li class="my-3">
                <button class="btn btn-primary btn-sm float-end js-listDetailButton" type="button" data-key="${idx}">詳細</button>
                ${val.question}<br />
                <span>正解率：${getAccuracyRate(val)}%</span>
              </li>`;
  });
  aListUlElm.innerHTML = liHtml;
  const listDdElms = document.querySelectorAll('.js-listDd');

  const listDetailButtonElms = document.querySelectorAll(
    '.js-listDetailButton'
  );

  listDetailButtonElms.forEach((elm) => {
    elm.addEventListener('click', function (e) {
      let quizCategory = aButtonSaveElm.classList.contains(
        'js-categoryNameIsUpdated'
      )
        ? getDataFromLocalStorage('quizCategory')
        : aQuizCategory;
      aListDivElms[0].classList.add('d-none');
      aListDivElms[1].classList.remove('d-none');

      const key = parseInt(
        (e.currentTarget as HTMLButtonElement).dataset.key ?? '0',
        10
      );
      let currentVal: Inputs | undefined = aQuizData.get(key);
      (aListDivElms[1] as HTMLElement).dataset.key = String(key);

      if (currentVal) {
        displayDetail(
          currentVal,
          aCurrentValKeys,
          listDdElms as NodeListOf<HTMLButtonElement>,
          quizCategory,
          aSectionElms,
          aButtonSaveElm,
          aButtonCancelElm
        );
      }
    });
  });

  setEventForBackToListPage(aListDivElms as NodeListOf<HTMLElement>);

  const handleEventForshowModalForDelete: ListenerForShowModalForDeleteType['handleEvent'] =
    function (this: any) {
      showModalForDelete(
        this.targetInputElm,
        this.modalForDeleteElms,
        this.listDdElms,
        this.bsModal
      );
    };

  const listener = {
    targetInputElm: null,
    modalForDeleteElms: aModalForDeleteElms,
    listDdElms: listDdElms,
    bsModal: aBsModal,
    handleEvent: handleEventForshowModalForDelete,
  };

  const buttonDeleteQuizElm = document.querySelector('.js-buttonDeleteQuiz');
  buttonDeleteQuizElm?.removeEventListener('click', listener, false);
  buttonDeleteQuizElm?.addEventListener('click', listener, false);
}

export function resetIsActiveInTheCategoryData(
  aQuizData: Map<number, Inputs>,
  aQuizCategory: Map<number, InputsCategory>,
  aModalForDeleteElms: modalForDeleteElmsType,
  aButtonCancelElm: HTMLButtonElement,
  aSectionElms: NodeListOf<HTMLElement>,
  aBsModal: bootstrap.Modal,
  aButtonSaveElm: HTMLButtonElement
) {
  let activeCategoryKeys: string[] = [];
  aQuizData.forEach((val: Inputs) => {
    if (val.category !== 'unspecified') {
      activeCategoryKeys.push(val.category);
    }
  });
  const activeCategoryKeysSet = new Set(activeCategoryKeys);
  aQuizCategory.forEach((val, key) => {
    val.isActive = false;
    activeCategoryKeysSet.forEach((val2) => {
      if (key === parseInt(val2, 10)) {
        val.isActive = true;
      }
    });
  });
  localStorage.setItem('quizCategory', JSON.stringify([...aQuizCategory]));
  setCategoryInputs(
    aQuizCategory,
    aQuizData,
    aModalForDeleteElms,
    aButtonCancelElm,
    aSectionElms,
    aBsModal,
    aButtonSaveElm
  );
}
