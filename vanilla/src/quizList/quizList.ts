import { setCategoryInputs } from '../display';
import { getDataFromLocalStorage } from '../common/dataManagement';
import {
  getHTMLForOptionInputsOfSelection,
  getEachValueForDivIndex0,
  setDivIndex1FormForQuizDetailIdx0Category,
  getFormElements,
} from '../common/forms/form';
import {
  setDisabled,
  setValidationForQuizDetailOfIdx3,
} from '../common/forms/validation';
import { showModalForDelete } from '../common/modals/modal';
import { resetEditQuizBtns } from '../common/utils';
import { getAccuracyRate } from '../common/utils';
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
        const formAnswerRadioElms = document.querySelectorAll(
          '.js-formAnswerRadio'
        );

        aCurrentVal.answer = (formAnswerRadioElms[0] as HTMLInputElement)
          .checked
          ? 0
          : 1;
      } else {
        //selection
        const formOptionNumberSelectElm = document.querySelector(
          '.js-formOptionNumberSelect'
        );
        aCurrentVal.numberOfOptions = parseInt(
          (formOptionNumberSelectElm as HTMLSelectElement).value,
          10
        );
        const formOptionsCheckboxElms = document.querySelectorAll(
          '.js-formOptionsCheckbox'
        );
        const formOptionsInputTextElms = document.querySelectorAll(
          '.js-formOptionsInputText'
        );
        let newArray: [boolean, string][] = [];
        Array(aCurrentVal.numberOfOptions)
          .fill('')
          .forEach((_, idx) => {
            newArray.push([
              (formOptionsCheckboxElms[idx] as HTMLInputElement).checked,
              (formOptionsInputTextElms[idx] as HTMLInputElement).value,
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

export function setIdx3PartOfQuizDetail(
  aCurrentVal: Inputs,
  aFormOptionNumberSelectElm: HTMLSelectElement,
  aFormOptionInputsDivElm: HTMLElement,
  aDetailTypeElm: HTMLSelectElement
) {
  const numberOfOptions = aCurrentVal.numberOfOptions
    ? aCurrentVal.numberOfOptions
    : 2;

  if (aFormOptionNumberSelectElm) {
    (aFormOptionNumberSelectElm as HTMLSelectElement).value =
      String(numberOfOptions);
  }

  if (aFormOptionInputsDivElm) {
    (aFormOptionInputsDivElm as HTMLElement).innerHTML =
      getHTMLForOptionInputsOfSelection(
        numberOfOptions,
        aFormOptionInputsDivElm as HTMLElement,
        'quizlist',
        aCurrentVal
      );
    setDisabled(
      aDetailTypeElm as HTMLSelectElement,
      null,
      aFormOptionInputsDivElm as HTMLElement,
      null,
      'checkbox',
      'click',
      aCurrentVal
    );
    setDisabled(
      aDetailTypeElm as HTMLSelectElement,
      null,
      aFormOptionInputsDivElm as HTMLElement,
      null,
      'inputText',
      'keyup',
      aCurrentVal
    );
  }
}

export function displayDetail(
  aCurrentVal: Inputs,
  aCurrentValKeys: (keyof Inputs)[],
  aListDdElms: NodeListOf<HTMLElement>,
  aQuizCategory: Map<number, InputsCategory>,
  aSectionElms: NodeListOf<HTMLElement>,
  aButtonSaveElm: HTMLButtonElement,
  aButtonCancelElm: HTMLButtonElement,
  aListDtElms: NodeListOf<HTMLElement>,
  aDivIdx3DivElms: NodeListOf<HTMLElement>
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

        const formAnswerRadioElms = document.querySelectorAll(
          '.js-formAnswerRadio'
        );
        const checkedIndex = aCurrentVal.answer == 0 ? 0 : 1;
        (formAnswerRadioElms[checkedIndex] as HTMLInputElement).checked = true;
        // trueOrFalse end

        //selection start
        const formOptionNumberSelectElm = divElms[1].querySelector(
          '.js-formOptionNumberSelect'
        );
        const formOptionInputsDivElm = divElms[1].querySelector(
          '.js-formOptionInputsDiv'
        );
        const detailTypeElm = document.querySelector('.js-detailType');

        setIdx3PartOfQuizDetail(
          aCurrentVal,
          formOptionNumberSelectElm as HTMLSelectElement,
          formOptionInputsDivElm as HTMLElement,
          detailTypeElm as HTMLSelectElement
        );

        formOptionNumberSelectElm?.addEventListener('change', function (e) {
          (formOptionInputsDivElm as HTMLElement).innerHTML =
            getHTMLForOptionInputsOfSelection(
              parseInt((e.currentTarget as HTMLSelectElement).value),
              formOptionInputsDivElm as HTMLElement,
              'quizlist',
              null
            );
          setDisabled(
            detailTypeElm as HTMLSelectElement,
            null,
            formOptionInputsDivElm as HTMLElement,
            null,
            'checkbox',
            'click',
            aCurrentVal
          );
          setDisabled(
            detailTypeElm as HTMLSelectElement,
            null,
            formOptionInputsDivElm as HTMLElement,
            null,
            'inputText',
            'keyup',
            aCurrentVal
          );
          setValidationForQuizDetailOfIdx3(
            formOptionInputsDivElm as HTMLElement,
            'quizList'
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
          typeSelectElm?.addEventListener('change', function (e) {
            const indices =
              (e.currentTarget as HTMLSelectElement).value === 'trueOrFalse'
                ? [0, 1]
                : [1, 0];
            aDivIdx3DivElms[indices[0]].classList.remove('d-none');
            aDivIdx3DivElms[indices[1]].classList.add('d-none');
          });
        }
      }
    }
  });

  // validation for 3 textareas
  const textareaElms = document.querySelectorAll('.js-listDl .js-formTextarea');
  textareaElms.forEach((elm, idx) => {
    elm.addEventListener('keyup', function (e: Event) {
      const targetTextAreaElm = e.currentTarget as HTMLTextAreaElement;
      const dtIdx = (idx + 1) * 2;
      const buttonElm = aListDtElms[dtIdx].querySelector('button');
      if (buttonElm) {
        if (targetTextAreaElm && !targetTextAreaElm.value) {
          buttonElm.disabled = true;
          targetTextAreaElm.classList.add(
            'border',
            'border-danger',
            'border-3'
          );
        } else {
          buttonElm.disabled = false;
          targetTextAreaElm.classList.remove(
            'border',
            'border-danger',
            'border-3'
          );
        }
        const key = !idx ? 'question' : idx === 1 ? 'explanation' : 'notes';
        if (aCurrentVal[key] === targetTextAreaElm.value) {
          buttonElm.disabled = true;
        }
      }
    });
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
  aButtonCancelElm: HTMLButtonElement,
  aListDtElms: NodeListOf<HTMLElement>,
  aDivIdx3DivElms: NodeListOf<HTMLElement>
) {
  let liHtml = '';
  [...aQuizData].forEach(([idx, val]) => {
    liHtml += `<li class="my-3">
                <button class="btn btn-primary btn-sm float-end js-listDetailButton" type="button" data-key="${idx}">詳細</button>
                ${val.question}<br />
                <span>正解率：${getAccuracyRate(val)}</span>
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
          aButtonCancelElm,
          aListDtElms,
          aDivIdx3DivElms
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
