import { setQuizList, setCategoryInputs, switchPage } from './display';
import {
  getCategoryOptions,
  getTypeOptions,
  getTextArea,
  getPriorityOptions,
  getHTMLForOptionInputsOfSelection,
} from './common/form';
import {
  labelForQuestionAnswer,
  labelForType,
  labelForPriority,
} from './common/labels';
import { displayModalForDelete } from './common/modal';
import { resetBtns } from './common/utils';
import { getAccuracyRate } from './common/utils';
import type { Inputs } from '../types/inputs.type';
import type { InputsCategory } from '../types/inputsCategory.type';
import type { modalForDeleteElmsType } from '../types/modalForDeleteElms.type';
import type {
  labelForTypeType,
  labelForPriorityType,
} from '../types/labels.type';

export function setInnerHTMLForEdit(
  aIdx: number,
  aCurrentVal: Inputs,
  aIsUnderEdit: boolean,
  aQuizCategory: Map<number, InputsCategory>,
  aListDdElms: NodeListOf<HTMLElement>,
  aSectionElms: NodeListOf<HTMLElement>,
  aCurrentValKeys: (keyof Inputs)[]
) {
  const formElements = [
    `<select class="form-select" aria-label="category" id="detailCategory">${getCategoryOptions(aQuizCategory, aCurrentVal.category)}</select>`,
    `<select class="form-select" aria-label="type" id="detailType" value="${aCurrentVal.type}">${getTypeOptions(aCurrentVal.type)}</select>`,
    getTextArea(aCurrentVal.question, 'detailQuestion'),
    '',
    getTextArea(aCurrentVal.explanation, 'detailExplanation'),
    `<select class="form-select" aria-label="priority" id="detailPriority" value="${aCurrentVal.priority}">${getPriorityOptions(aCurrentVal.priority)}</select>`,
    getTextArea(aCurrentVal.notes, 'detailNotes'),
  ];

  const currentValKey = aCurrentValKeys[aIdx];

  if (aIsUnderEdit) {
    aListDdElms[aIdx].innerHTML = formElements[aIdx];
    if (!aIdx) {
      const categorySelectElm = aListDdElms[0].querySelector('select');
      categorySelectElm?.addEventListener('change', function (e) {
        const targetValue = (e.currentTarget as HTMLSelectElement).value;
        if (targetValue === 'add') {
          switchPage(3, false, {}, null, aSectionElms);
          const buttonSaveElm =
            document.querySelector<HTMLButtonElement>('.js-buttonSave');
          if (buttonSaveElm) {
            buttonSaveElm.classList.add('js-quizDataIsUnderEdit');
            buttonSaveElm.dataset.key = (
              aListDdElms[0]?.parentNode?.parentNode as HTMLElement
            )?.dataset?.key;
          }
        }
      });
    } else if (aIdx === 1) {
      const typeSelectElm = aListDdElms[1].querySelector('select');
      typeSelectElm?.addEventListener('change', function (e) {
        const targetValue = (e.currentTarget as HTMLSelectElement).value;
        aCurrentVal.type = targetValue;

        setInnerHTMLForEditIrregular(
          3,
          aCurrentVal as Inputs,
          true,
          aListDdElms
        );
      });
    }
  } else {
    if (aIdx === 0 || aIdx === 1 || aIdx === 5) {
      setLablesForIrregular(
        aIdx,
        aCurrentVal,
        currentValKey,
        aListDdElms,
        aQuizCategory
      );
      if (aIdx === 1) {
        setInnerHTMLForEditIrregular(
          3,
          aCurrentVal as Inputs,
          aIsUnderEdit,
          aListDdElms
        );
      }
    } else {
      aListDdElms[aIdx].innerHTML = String(aCurrentVal[currentValKey]);
    }
  }
}

const setInnerHTMLForEditIrregular = (
  aIdx: number,
  aCurrentVal: Inputs,
  aIsUnderEdit: boolean,
  aListDdElms: NodeListOf<HTMLElement>
) => {
  type FormElementsIrregularIndex3Type = {
    trueOrFalse: string;
    selection: string;
  };
  if (aIsUnderEdit && aIdx === 3) {
    const formElementsIrregularIndex3: FormElementsIrregularIndex3Type = {
      trueOrFalse: `<div class="form-check form-check-inline cursor-pointer my-3">
          <input
            class="form-check-input js-addNewAnswerRadio"
            type="radio"
            name="answer"
            id="answer0"
            value="0"
          />
          <label class="form-check-label" for="answer0">まる</label>
        </div>
        <div class="form-check form-check-inline cursor-pointer">
          <input
            class="form-check-input js-addNewAnswerRadio"
            type="radio"
            name="answer"
            id="answer1"
            value="1"
          />
          <label class="form-check-label" for="answer1">ばつ</label>
        </div>`,
      selection: `<div class="my-3">
            <label for="numberOfOptions" class="form-label"
              >選択肢の数</label
            >
            <select
              class="form-select js-addNewOptionNumberSelect"
              aria-label="numberOfOptions"
              id="numberOfOptions"
            >
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
          <p>
            選択肢を入力して、正解の選択肢にチェックを入れてください。
          </p>
          <div class="my-3 js-addNewOptionInputsDiv"></div>
        </div>`,
    };

    aListDdElms[3].innerHTML = String(
      formElementsIrregularIndex3[
        aCurrentVal.type as keyof FormElementsIrregularIndex3Type
      ]
    );

    const addNewAnswerRadioElms = document.querySelectorAll(
      '.js-addNewAnswerRadio'
    );

    const checkedIndex = aCurrentVal.answer == 0 ? 0 : 1;
    (addNewAnswerRadioElms[checkedIndex] as HTMLInputElement).checked = true;

    addNewAnswerRadioElms.forEach((elm) => {
      elm.addEventListener('click', function (e) {
        const targetElm = e.currentTarget as HTMLInputElement;
        targetElm.checked = true;
        aCurrentVal.answer = parseInt(targetElm.value, 10);
      });
    });

    const addNewOptionNumberSelectElm = document.querySelector(
      '.js-addNewOptionNumberSelect'
    );
    if (addNewOptionNumberSelectElm) {
      (addNewOptionNumberSelectElm as HTMLSelectElement).value = String(
        aCurrentVal.numberOfOptions
      );
    }

    const addNewOptionInputsDivElm = document.querySelector(
      '.js-addNewOptionInputsDiv'
    );

    if (addNewOptionInputsDivElm) {
      (addNewOptionInputsDivElm as HTMLElement).innerHTML =
        getHTMLForOptionInputsOfSelection(
          aCurrentVal.numberOfOptions,
          false,
          addNewOptionInputsDivElm as HTMLElement
        );
    }

    addNewOptionNumberSelectElm?.addEventListener('change', function (e) {
      aCurrentVal.numberOfOptions = parseInt(
        (e.currentTarget as HTMLSelectElement).value,
        10
      );
      (addNewOptionInputsDivElm as HTMLElement).innerHTML =
        getHTMLForOptionInputsOfSelection(
          aCurrentVal.numberOfOptions,
          true,
          addNewOptionInputsDivElm as HTMLElement
        );
    });
  } else {
    if (aIdx === 3) {
      let answerForSelection = '';
      if (aCurrentVal.type === 'selection') {
        aCurrentVal.options.forEach((arr) => {
          if (arr[0]) {
            if (answerForSelection) {
              answerForSelection += '、';
            }
            answerForSelection += arr[1];
          }
        });
      }

      aListDdElms[3].innerHTML =
        aCurrentVal.type === 'trueOrFalse'
          ? labelForQuestionAnswer[aCurrentVal.answer]
          : answerForSelection;
    } else {
      aListDdElms[7].innerHTML = String(getAccuracyRate(aCurrentVal));
    }
  }
};

const setLablesForIrregular = (
  aIdx: number,
  aCurrentVal: Inputs,
  aCurrentValKey: keyof Inputs,
  aListDdElms: NodeListOf<HTMLElement>,
  aQuizCategory: Map<number, InputsCategory>
) => {
  if (aIdx === 0) {
    // category
    const key = aCurrentVal[aCurrentValKey];
    if (aCurrentVal[aCurrentValKey] === 'unspecified') {
      aListDdElms[0].innerHTML = '指定しない';
      aListDdElms[0].dataset.text = '指定しない';
    } else if (
      typeof key === 'string' &&
      typeof parseInt(key, 10) === 'number'
    ) {
      const currentCategory = aQuizCategory.get(parseInt(key, 10));
      if (currentCategory) {
        aListDdElms[0].innerHTML = String(currentCategory.categoryName);
        aListDdElms[0].dataset.text = String(currentCategory.categoryName);
      }
    }
  } else if (aIdx === 1) {
    // type
    aListDdElms[1].innerHTML = String(
      labelForType[aCurrentVal[aCurrentValKey] as keyof labelForTypeType]
    );
  } else if (aIdx === 5) {
    // question
    aListDdElms[5].innerHTML = String(
      labelForPriority[
        String(aCurrentVal[aCurrentValKey]) as keyof labelForPriorityType
      ]
    );
  }
};

const saveEachItem = <K extends keyof Inputs>(
  aIdx: number,
  aCurrentVal: Inputs,
  aCurrentValKey: K,
  aListDdElms: NodeListOf<HTMLElement>
): Inputs => {
  const key = aCurrentValKey;
  if (!aIdx || aIdx === 1 || aIdx === 5) {
    const selectElm = aListDdElms[aIdx].querySelector(
      'select'
    ) as HTMLSelectElement | null;
    if (selectElm && typeof aCurrentVal[key] === 'string') {
      (aCurrentVal as any)[key] = (selectElm as HTMLSelectElement).value;
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
    if (textareaElm && typeof aCurrentVal[key] === 'string') {
      (aCurrentVal as any)[key] = textareaElm.value;
    }
  }
  return aCurrentVal;
};

const setEventForDisplayDetail = (
  aQuizData: Map<number, Inputs>,
  aQuizCategory: Map<number, InputsCategory>,
  aListDivElms: NodeListOf<HTMLElement>,
  aModalForDeleteElms: modalForDeleteElmsType,
  aListDdElms: NodeListOf<HTMLElement>,
  aSectionElms: NodeListOf<HTMLElement>,
  aCurrentValKeys: (keyof Inputs)[]
) => {
  const listDetailButtonElms = document.querySelectorAll(
    '.js-listDetailButton'
  );

  const listEditBtnElms = document.querySelectorAll('.js-listEditBtn');

  listDetailButtonElms.forEach((elm) => {
    elm.addEventListener('click', function (e) {
      aListDivElms[0].classList.add('d-none');
      aListDivElms[1].classList.remove('d-none');

      const key = parseInt(
        (e.currentTarget as HTMLButtonElement).dataset.key ?? '0',
        10
      );
      let currentVal: Inputs | undefined = aQuizData.get(key);
      aListDivElms[1].dataset.key = String(key);

      if (currentVal) {
        displayDetail(
          key,
          currentVal,
          aCurrentValKeys,
          listEditBtnElms as NodeListOf<HTMLButtonElement>,
          aListDdElms,
          aQuizData,
          aQuizCategory,
          aModalForDeleteElms,
          aSectionElms,
          false
        );
      }
    });
  });
};

const setDisabled = (aIsUnderEdit: boolean) => {
  const listEditBtnElms = document.querySelectorAll('.js-listEditBtn');
  listEditBtnElms.forEach((elm) => {
    (elm as HTMLButtonElement).disabled = aIsUnderEdit ? true : false;
  });
};

export function displayDetail(
  key: number,
  currentVal: Inputs,
  aCurrentValKeys: (keyof Inputs)[],
  listEditBtnElms: NodeListOf<HTMLButtonElement>,
  aListDdElms: NodeListOf<HTMLElement>,
  aQuizData: Map<number, Inputs>,
  aQuizCategory: Map<number, InputsCategory>,
  aModalForDeleteElms: modalForDeleteElmsType,
  aSectionElms: NodeListOf<HTMLElement>,
  aIsUnderEdit: boolean
) {
  aCurrentValKeys.forEach((val, idx: number) => {
    if (idx === 3 || idx === 7) {
      setInnerHTMLForEditIrregular(
        idx,
        currentVal as Inputs,
        false,
        aListDdElms
      );
    } else {
      const currentValKey = val;
      if (idx === 0 || idx === 1 || idx === 5) {
        setLablesForIrregular(
          idx,
          currentVal as Inputs,
          currentValKey,
          aListDdElms,
          aQuizCategory
        );
      } else {
        aListDdElms[idx].innerHTML = String(
          (currentVal as Inputs)[currentValKey]
        );
      }
    }
  });

  let isUnderEdit = aIsUnderEdit;
  let cancelBtnElm: HTMLButtonElement | null = null;

  listEditBtnElms.forEach((elm, idx) => {
    if (
      (elm?.parentNode?.parentNode?.parentNode as HTMLElement).dataset.add !==
      'true'
    ) {
      elm.addEventListener('click', function (e) {
        isUnderEdit = !isUnderEdit;
        if (elm.dataset.adjustment === 'true') {
          isUnderEdit = true;
          listEditBtnElms.forEach((elm2) => {
            elm2.dataset.adjustment = 'false';
          });
        }
        setDisabled(isUnderEdit);

        const targetBtnElm = e.currentTarget;
        if (isUnderEdit) {
          elm.textContent = '上書きする';

          if (targetBtnElm) {
            (targetBtnElm as HTMLButtonElement).disabled = false;
          }

          const cancelBtnElms = document.querySelectorAll('.btn-secondary');
          if (cancelBtnElms) {
            cancelBtnElms.forEach((elm) => {
              if (elm) {
                elm.remove();
              }
            });
          }

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
            this.remove();
            cancelBtnElm = null;
            resetQuizDetail(
              elm,
              idx,
              currentVal,
              aQuizCategory,
              aListDdElms,
              aSectionElms,
              aCurrentValKeys,
              listEditBtnElms
            );
          });
        } else {
          currentVal = saveEachItem(
            idx,
            currentVal as Inputs,
            aCurrentValKeys[idx],
            aListDdElms
          );
          aQuizData.set(key, currentVal);
          localStorage.setItem('quizData', JSON.stringify([...aQuizData]));
          if (!idx) {
            resetIsActiveInTheCategoryData(
              aQuizData,
              aQuizCategory,
              aModalForDeleteElms,
              cancelBtnElm as HTMLButtonElement,
              aSectionElms,
              aCurrentValKeys
            );
          }
          if (idx === 2) {
            setQuizList(
              aQuizData,
              aQuizCategory,
              aModalForDeleteElms,
              cancelBtnElm as HTMLButtonElement,
              aSectionElms,
              aCurrentValKeys
            );
          }

          elm.textContent = '編集する';
          cancelBtnElm?.remove();
          cancelBtnElm = null;
        }
        if (idx === 3 || idx === 7) {
          setInnerHTMLForEditIrregular(
            idx,
            currentVal as Inputs,
            isUnderEdit,
            aListDdElms
          );
        } else {
          setInnerHTMLForEdit(
            idx,
            currentVal as Inputs,
            isUnderEdit,
            aQuizCategory,
            aListDdElms,
            aSectionElms,
            aCurrentValKeys
          );
        }
        (elm.parentNode?.parentNode?.parentNode as HTMLElement).dataset.add =
          String(true);
      });
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
  setDisabled(isUnderEdit);
  aElm.textContent = '編集する';

  if (aIdx === 3 || aIdx === 7) {
    setInnerHTMLForEditIrregular(
      aIdx,
      aCurrentVal as Inputs,
      isUnderEdit,
      aListDdElms
    );
  } else {
    setInnerHTMLForEdit(
      aIdx,
      aCurrentVal as Inputs,
      isUnderEdit,
      aQuizCategory,
      aListDdElms,
      aSectionElms,
      aCurrentValKeys
    );
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
      resetBtns(false);
    });
  });
};

const setEventForDeleteQuiz = (
  aQuizData: Map<number, Inputs>,
  aQuizCategory: Map<number, InputsCategory>,
  aModalForDeleteElms: modalForDeleteElmsType,
  aListDivElms: NodeListOf<HTMLElement>,
  aListDdElms: NodeListOf<HTMLElement>,
  aButtonCancelElm: HTMLButtonElement,
  aSectionElms: NodeListOf<HTMLElement>,
  aCurrentValKeys: (keyof Inputs)[]
) => {
  const buttonDeleteQuizElm = document.querySelector('.js-buttonDeleteQuiz');

  buttonDeleteQuizElm?.addEventListener('click', function () {
    displayModalForDelete(
      aQuizData,
      aQuizCategory,
      null,
      aModalForDeleteElms,
      aListDivElms,
      aListDdElms,
      aButtonCancelElm,
      aSectionElms,
      aCurrentValKeys
    );
  });
};

export function displayList(
  aQuizData: Map<number, Inputs>,
  aQuizCategory: Map<number, InputsCategory>,
  aListDivElms: NodeListOf<Element>,
  aListUlElm: HTMLElement,
  aModalForDeleteElms: modalForDeleteElmsType,
  aButtonCancelElm: HTMLButtonElement,
  aSectionElms: NodeListOf<HTMLElement>,
  aCurrentValKeys: (keyof Inputs)[]
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

  setEventForDisplayDetail(
    aQuizData,
    aQuizCategory,
    aListDivElms as NodeListOf<HTMLElement>,
    aModalForDeleteElms,
    listDdElms as NodeListOf<HTMLElement>,
    aSectionElms,
    aCurrentValKeys as (keyof Inputs)[]
  );

  setEventForBackToListPage(aListDivElms as NodeListOf<HTMLElement>);

  setEventForDeleteQuiz(
    aQuizData,
    aQuizCategory,
    aModalForDeleteElms as modalForDeleteElmsType,
    aListDivElms as NodeListOf<HTMLElement>,
    listDdElms as NodeListOf<HTMLElement>,
    aButtonCancelElm as HTMLButtonElement,
    aSectionElms as NodeListOf<HTMLElement>,
    aCurrentValKeys
  );
}

export function resetIsActiveInTheCategoryData(
  aQuizData: Map<number, Inputs>,
  aQuizCategory: Map<number, InputsCategory>,
  aModalForDeleteElms: modalForDeleteElmsType,
  aButtonCancelElm: HTMLButtonElement,
  aSectionElms: NodeListOf<HTMLElement>,
  aCurrentValKeys: (keyof Inputs)[]
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
    aCurrentValKeys
  );
}
