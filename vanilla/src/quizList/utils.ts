import {
  getCategoryInputHTML,
  editOrDeleteCategoryNamesAndSetValidationForInput,
} from '../categorySettings/utils';
import { getDataFromLocalStorage } from '../common/dataManagement';
import {
  getHTMLForOptionInputsOfSelection,
  getEachValueForDivIndex0,
  setDivIndex1FormForQuizDetailIdx0Category,
  getFormElements,
} from '../common/forms/form';
import { setDisabled, getInputValues } from '../common/forms/validation';
import { getAccuracyRate } from '../common/utils';
import type { Inputs } from '../common/types/inputs.type';
import type { InputsCategory } from '../common/types/inputsCategory.type';
import type { FormElementsIrregularIndex3Type } from '../common/types/formElementsIrregularIndex3.type';
import type { modalForDeleteElmsType } from '../common/types/modalForDeleteElms.type';

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

const setValidationForIdx3SelectionPartOfQuizDetail = (
  aNumberOfOptions: number,
  aFormOptionInputsDivElm: HTMLElement,
  aType: string,
  aCurrentVal: Inputs | null,
  aDetailTypeElm: HTMLSelectElement | null,
  aListDtIndex: number
) => {
  (aFormOptionInputsDivElm as HTMLElement).innerHTML =
    getHTMLForOptionInputsOfSelection(
      aNumberOfOptions,
      aFormOptionInputsDivElm as HTMLElement,
      aType,
      aCurrentVal
    );
  setDisabled(
    aDetailTypeElm as HTMLSelectElement,
    null,
    aFormOptionInputsDivElm as HTMLElement,
    null,
    'checkbox',
    'click',
    aCurrentVal,
    aListDtIndex
  );
  setDisabled(
    aDetailTypeElm as HTMLSelectElement,
    null,
    aFormOptionInputsDivElm as HTMLElement,
    null,
    'inputText',
    'keyup',
    aCurrentVal,
    aListDtIndex
  );
};

export function setIdx3SelectionPartOfQuizDetailAndValidation(
  aCurrentVal: Inputs,
  aFormOptionNumberSelectElm: HTMLSelectElement,
  aFormOptionInputsDivElm: HTMLElement,
  aDetailTypeElm: HTMLSelectElement,
  aListDtIndex: number
) {
  const numberOfOptions = aCurrentVal.numberOfOptions
    ? aCurrentVal.numberOfOptions
    : 2;

  if (aFormOptionNumberSelectElm) {
    (aFormOptionNumberSelectElm as HTMLSelectElement).value =
      String(numberOfOptions);
  }

  if (aFormOptionInputsDivElm) {
    setValidationForIdx3SelectionPartOfQuizDetail(
      numberOfOptions,
      aFormOptionInputsDivElm as HTMLElement,
      'quizlist',
      aCurrentVal,
      aDetailTypeElm,
      aListDtIndex
    );
  }
}

export function setEventForDisplayDetail(
  aQuizData: Map<number, Inputs>,
  aQuizCategory: Map<number, InputsCategory>,
  aListDivElms: NodeListOf<HTMLElement>,
  aCurrentValKeys: (keyof Inputs)[],
  aListDdElms: NodeListOf<HTMLElement>,
  aSectionElms: NodeListOf<HTMLElement>,
  aButtonSaveElm: HTMLButtonElement,
  aButtonCancelElm: HTMLButtonElement,
  aListDtElms: NodeListOf<HTMLElement>,
  aDivIdx3DivElms: NodeListOf<HTMLElement>,
  aButtonBackToListElms: NodeListOf<HTMLButtonElement>
) {
  const listDetailButtonElms = document.querySelectorAll(
    '.js-listDetailButton'
  );

  listDetailButtonElms.forEach((elm) => {
    elm.addEventListener('click', function (e) {
      const quizCategory =
        aButtonSaveElm.dataset.iscategorynameupdated === 'true'
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
          aListDdElms as NodeListOf<HTMLButtonElement>,
          quizCategory,
          aSectionElms,
          aButtonSaveElm,
          aButtonCancelElm,
          aListDtElms,
          aDivIdx3DivElms,
          aListDivElms
        );
      }
    });
  });

  aButtonBackToListElms.forEach((elm) => {
    if (elm.classList.contains('js-questionIsUpdated')) {
      elm.classList.remove('js-questionIsUpdated');
    }
  });
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
  aDivIdx3DivElms: NodeListOf<HTMLElement>,
  aListDivElms: NodeListOf<HTMLElement>
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

  let detailTypeElm: HTMLSelectElement | null = null;

  aListDdElms.forEach((_, idx: number) => {
    const divElms =
      idx !== 3
        ? aListDdElms[idx].querySelectorAll('div')
        : aListDdElms[3].querySelectorAll(':scope > div');

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
        aDivIdx3DivElms[0].innerHTML =
          formElementsIrregularIndex3['trueOrFalse'];
        aDivIdx3DivElms[1].innerHTML = formElementsIrregularIndex3['selection'];

        // trueOrFalse start
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

        detailTypeElm = document.querySelector<HTMLSelectElement>(
          '.js-listDl .js-detailType'
        );
        setIdx3SelectionPartOfQuizDetailAndValidation(
          aCurrentVal,
          formOptionNumberSelectElm as HTMLSelectElement,
          formOptionInputsDivElm as HTMLElement,
          detailTypeElm as HTMLSelectElement,
          idx
        );

        formOptionNumberSelectElm?.addEventListener('change', function (e) {
          setValidationForIdx3SelectionPartOfQuizDetail(
            parseInt((e.currentTarget as HTMLSelectElement).value),
            formOptionInputsDivElm as HTMLElement,
            'quizlist',
            null,
            detailTypeElm,
            idx
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
            divElms[1] as HTMLElement,
            aButtonSaveElm,
            aButtonCancelElm,
            aListDivElms
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

  // display the result of practice
  let result = '<div class="d-flex flex-row mb-3 justify-content-center">';
  aCurrentVal.areCorrectAnswers.forEach((val, idx) => {
    result += `<div class="p-1 border">${val ? '正解' : '不正解'}</div>`;
    if (idx % 10 === 9) {
      result +=
        '</div><div class="d-flex flex-row mb-3 justify-content-center">';
    }
  });
  result += '</div>';
  const areCorrectAnswersDivElm = document.querySelector(
    '.js-areCorrectAnswersDiv'
  );
  if (areCorrectAnswersDivElm) {
    areCorrectAnswersDivElm.innerHTML = result;
  }

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

  // validation for 2 selects

  aListDdElms[0].addEventListener('change', function (e) {
    const targetSelectElm = e.target as HTMLSelectElement;
    const buttonElm = aListDtElms[0].querySelector('button');
    if (buttonElm) {
      buttonElm.disabled = aCurrentVal.category === targetSelectElm.value;
    }
  });

  const prioritySelectForQuizDetailElm = aListDdElms[5].querySelector('select');
  prioritySelectForQuizDetailElm?.addEventListener('change', function (e) {
    const targetSelectElm = e.currentTarget as HTMLSelectElement;
    const buttonElm = aListDtElms[5].querySelector('button');
    if (buttonElm) {
      buttonElm.disabled = aCurrentVal.priority === targetSelectElm.value;
    }
  });

  // validation for idx1 & idx3
  // idx1

  const editButton1Elm = aListDtElms[1].querySelector('button');
  const editButton3Elm = aListDtElms[3].querySelector('button');
  let targetSelectElm = null;
  let isTypeChanged = false;
  detailTypeElm = document.querySelector<HTMLSelectElement>(
    '.js-listDl .js-detailType'
  );
  if (detailTypeElm !== null) {
    detailTypeElm.addEventListener('change', function (e: Event) {
      resetIdx3Form(aCurrentVal, 1);
      targetSelectElm = e.currentTarget as HTMLSelectElement;
      if (editButton1Elm) {
        isTypeChanged = aCurrentVal.type !== targetSelectElm.value;
        editButton1Elm.disabled = !isTypeChanged;
      }
    });
  }

  // idx3
  const formAnswerRadioElms = document.querySelectorAll(
    '.js-listDl .js-formAnswerRadio'
  );
  formAnswerRadioElms.forEach((elm) => {
    elm.addEventListener('click', function (e) {
      if (!isTypeChanged) {
        const targetEditBtnElm =
          editButton1Elm?.textContent === '上書きする'
            ? editButton1Elm
            : editButton3Elm;
        const targetRadioElm = e.currentTarget as HTMLInputElement;
        if (targetEditBtnElm) {
          targetEditBtnElm.disabled =
            aCurrentVal.answer === parseInt(targetRadioElm.value);
        }
      }
    });
  });
}

export function displayList(
  aQuizData: Map<number, Inputs>,
  aListUlElm: HTMLElement
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
}

export function resetIsActiveInTheCategoryData(
  aQuizData: Map<number, Inputs>,
  aQuizCategory: Map<number, InputsCategory>,
  aButtonSaveElm: HTMLButtonElement,
  aInputCategoryAreaElm: HTMLElement,
  aButtonAddInputElm: HTMLButtonElement,
  aButtonCancelElm: HTMLButtonElement,
  aModalForDeleteElms: modalForDeleteElmsType,
  aBsModal: bootstrap.Modal,
  aSectionElms: NodeListOf<HTMLElement>,
  aListDivElms: NodeListOf<HTMLElement>,
  aListUlElm: HTMLElement,
  aCurrentValKeys: (keyof Inputs)[],
  aListDdElms: NodeListOf<HTMLElement>,
  aListDtElms: NodeListOf<HTMLElement>,
  aDivIdx3DivElms: NodeListOf<HTMLElement>,
  aButtonBackToListElms: NodeListOf<HTMLButtonElement>
) {
  let activeCategoryKeys: string[] = [];
  aQuizData.forEach((val: Inputs) => {
    if (val.category !== 'unspecified') {
      activeCategoryKeys.push(val.category);
    }
  });
  const quizCategory =
    aButtonSaveElm.dataset.iscategorynameupdated === 'true'
      ? getDataFromLocalStorage('quizCategory')
      : aQuizCategory;
  const activeCategoryKeysSet = new Set(activeCategoryKeys);
  quizCategory.forEach((val, key) => {
    val.isActive = false;
    activeCategoryKeysSet.forEach((val2) => {
      if (key === parseInt(val2, 10)) {
        val.isActive = true;
      }
    });
  });
  localStorage.setItem('quizCategory', JSON.stringify([...quizCategory]));
  // reset category inputs : start
  if (aInputCategoryAreaElm !== null) {
    aInputCategoryAreaElm.innerHTML = getCategoryInputHTML(quizCategory);
  }
  const inputCategoryElms: NodeListOf<HTMLInputElement> =
    aInputCategoryAreaElm?.querySelectorAll('input');
  const initialInputValues: string[] = getInputValues(
    inputCategoryElms as NodeListOf<HTMLInputElement>,
    true
  );
  editOrDeleteCategoryNamesAndSetValidationForInput(
    aQuizData,
    quizCategory,
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
}

export function hideOrShowDivElms(
  aIdx: number,
  aDivElms: NodeListOf<HTMLElement>,
  aDivIdx3Elms: NodeListOf<HTMLElement>,
  aIsUnderEdit: boolean,
  aCurrentValType: string,
  aDivIdx3DivElms: NodeListOf<HTMLElement>
) {
  const indices = aIsUnderEdit ? [1, 0] : [0, 1];
  aDivElms[indices[0]].classList.remove('d-none');
  aDivElms[indices[1]].classList.add('d-none');
  if (
    (aDivIdx3Elms && aDivIdx3DivElms && aIdx === 1) ||
    (aDivIdx3Elms && aDivIdx3DivElms && aIdx === 3)
  ) {
    aDivIdx3Elms[indices[0]].classList.remove('d-none');
    aDivIdx3Elms[indices[1]].classList.add('d-none');
    const typeIndices = aCurrentValType === 'trueOrFalse' ? [0, 1] : [1, 0];
    aDivIdx3DivElms[typeIndices[0]].classList.remove('d-none');
    aDivIdx3DivElms[typeIndices[1]].classList.add('d-none');
  }
}

export function resetIdx3Form(aCurrentVal: Inputs, aListDtIndex: number) {
  // trueOrFalse
  const formAnswerRadioElms = document.querySelectorAll('.js-formAnswerRadio');
  const checkedIndex = aCurrentVal.answer === 0 ? 0 : 1;
  (formAnswerRadioElms[checkedIndex] as HTMLInputElement).checked = true;

  // selection
  const formOptionNumberSelectElm = document.querySelector(
    '.js-listDl  .js-formOptionNumberSelect'
  );
  const formOptionInputsDivElm = document.querySelector(
    '.js-listDl  .js-formOptionInputsDiv'
  );
  const detailTypeElm = document.querySelector('.js-listDl  .js-detailType');
  setIdx3SelectionPartOfQuizDetailAndValidation(
    aCurrentVal,
    formOptionNumberSelectElm as HTMLSelectElement,
    formOptionInputsDivElm as HTMLElement,
    detailTypeElm as HTMLSelectElement,
    aListDtIndex
  );
}

export function editQuizData(
  aQuizData: Map<number, Inputs>,
  aQuizCategory: Map<number, InputsCategory>,
  aListEditBtnElms: NodeListOf<HTMLButtonElement>,
  aListDlElm: HTMLElement,
  aListDdElms: NodeListOf<HTMLElement>,
  aCurrentValKeys: (keyof Inputs)[],
  aButtonSaveElm: HTMLButtonElement,
  aDivIdx3Elms: NodeListOf<HTMLElement>,
  aDivIdx3DivElms: NodeListOf<HTMLElement>,
  aInputCategoryAreaElm: HTMLElement,
  aButtonAddInputElm: HTMLButtonElement,
  aButtonCancelElm: HTMLButtonElement,
  aModalForDeleteElms: modalForDeleteElmsType,
  aBsModal: bootstrap.Modal,
  aSectionElms: NodeListOf<HTMLElement>,
  aButtonBackToListElms: NodeListOf<HTMLButtonElement>,
  aListDivElms: NodeListOf<HTMLElement>,
  aListUlElm: HTMLElement,
  aListDtElms: NodeListOf<HTMLElement>
) {
  let quizCategory = aQuizCategory;
  let isUnderEdit = false;
  let cancelBtnElm: HTMLButtonElement | null = null;
  let currentVal: Inputs | undefined;

  aListEditBtnElms.forEach((elm, idx) => {
    const divElms =
      idx !== 3
        ? aListDdElms[idx].querySelectorAll('div')
        : aListDdElms[3].querySelectorAll(':scope > div');
    if (
      (elm?.parentNode?.parentNode?.parentNode as HTMLElement).dataset.add !==
      'true'
    ) {
      elm.addEventListener('click', function () {
        const key = parseInt(
          (aListDlElm.parentNode as HTMLElement).dataset.key ?? '1000'
        );
        currentVal = aQuizData.get(key);
        isUnderEdit = !isUnderEdit;
        if (elm.dataset.adjustment === 'true') {
          isUnderEdit = true;
          aListEditBtnElms.forEach((elm2) => {
            elm2.dataset.adjustment = 'false';
          });
        }
        setDisabledForListEditBtns(isUnderEdit);

        if (isUnderEdit) {
          if (idx === 1 || idx === 3) {
            resetIdx3Form(currentVal as Inputs, idx);
          }
          hideOrShowDivElms(
            idx,
            divElms as NodeListOf<HTMLElement>,
            aDivIdx3Elms as NodeListOf<HTMLElement>,
            isUnderEdit,
            currentVal!.type,
            aDivIdx3DivElms as NodeListOf<HTMLElement>
          );
          elm.textContent = '上書きする';
          elm.disabled = true;

          cancelBtnElm = document.createElement('button');
          cancelBtnElm.textContent = 'キャンセル';
          cancelBtnElm.classList.add(
            'btn',
            'btn-secondary',
            'btn-sm',
            'ms-2',
            'js-quizDetailEditCancelBtn'
          );

          elm?.parentNode?.appendChild(cancelBtnElm);
          cancelBtnElm.addEventListener('click', function () {
            isUnderEdit = false;
            this.remove();
            cancelBtnElm = null;
            hideOrShowDivElms(
              idx,
              divElms as NodeListOf<HTMLElement>,
              aDivIdx3Elms as NodeListOf<HTMLElement>,
              isUnderEdit,
              currentVal!.type,
              aDivIdx3DivElms as NodeListOf<HTMLElement>
            );

            elm.textContent = '編集する';
            setDisabledForListEditBtns(isUnderEdit);
            if (idx === 0 || idx === 1 || idx === 5) {
              const selectElm = divElms[1].querySelector('select');
              if (
                selectElm &&
                currentVal &&
                selectElm.value !== currentVal[aCurrentValKeys[idx]]
              ) {
                // restore to the original value
                const optionElms = selectElm?.querySelectorAll('option');
                optionElms.forEach((elm) => {
                  elm.selected = false;
                  if (
                    currentVal &&
                    elm.value === currentVal[aCurrentValKeys[idx]]
                  ) {
                    elm.selected = true;
                  }
                });
              }
            } else if (idx !== 3) {
              const textareaElm = divElms[1].querySelector('textarea');
              if (textareaElm && currentVal) {
                if (textareaElm.value !== currentVal[aCurrentValKeys[idx]]) {
                  textareaElm.value = String(currentVal[aCurrentValKeys[idx]]);
                }
              }
            }
          });
        } else if (currentVal) {
          // when clicking save button
          // save a new value
          quizCategory =
            aButtonSaveElm.dataset.iscategorynameupdated === 'true'
              ? getDataFromLocalStorage('quizCategory')
              : aQuizCategory;
          if (idx === 2) {
            aButtonBackToListElms.forEach((elm) => {
              elm.classList.add('js-questionIsUpdated');
            });
          }
          if (idx === 1 || idx === 3) {
            if (currentVal.type === 'trueOrFalse') {
              const formAnswerRadioElms = document.querySelectorAll(
                '.js-listDl .js-formAnswerRadio'
              );
              const checkedIndex =
                (formAnswerRadioElms[0] as HTMLInputElement).checked === true
                  ? 0
                  : 1;
              (formAnswerRadioElms[checkedIndex] as HTMLInputElement).checked =
                true;
              currentVal.answer = checkedIndex; //update
              currentVal.numberOfOptions = 2; //default
              currentVal.options = [
                [false, ''],
                [false, ''],
              ]; //default
            } else {
              const formOptionNumberSelectElm = document.querySelector(
                '.js-listDl .js-formOptionNumberSelect'
              );
              currentVal.numberOfOptions = parseInt(
                (formOptionNumberSelectElm as HTMLSelectElement).value
              ); //update

              const checkboxElms = document.querySelectorAll(
                '.js-listDl .js-formOptionsCheckbox'
              );
              const inputTextElms = document.querySelectorAll(
                '.js-listDl .js-formOptionsInputText'
              );
              let array: [boolean, string][] = [];
              checkboxElms.forEach((elm, idx: number) => {
                array.push([
                  (elm as HTMLInputElement).checked,
                  (inputTextElms[idx] as HTMLInputElement).value,
                ]);
              });
              currentVal.options = array; //update
              currentVal.answer = 0; //default
            }
          }

          if (idx !== 3) {
            currentVal = getUpdatedCurrentVal(
              idx,
              currentVal as Inputs,
              aCurrentValKeys[idx],
              aListDdElms
            );
          }
          aQuizData.set(key, currentVal);
          localStorage.setItem('quizData', JSON.stringify([...aQuizData]));
          if (!idx) {
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
          }

          // display an updated value
          divElms[0].innerHTML = getEachValueForDivIndex0(
            idx,
            currentVal,
            aCurrentValKeys,
            aListDdElms,
            quizCategory
          );
          hideOrShowDivElms(
            idx,
            divElms as NodeListOf<HTMLElement>,
            aDivIdx3Elms as NodeListOf<HTMLElement>,
            isUnderEdit,
            currentVal!.type,
            aDivIdx3DivElms as NodeListOf<HTMLElement>
          );

          // set buttons
          elm.textContent = '編集する';
          cancelBtnElm?.remove();
          cancelBtnElm = null;
        }

        (elm.parentNode?.parentNode?.parentNode as HTMLElement).dataset.add =
          String(true);
      });
    }
  });
}
