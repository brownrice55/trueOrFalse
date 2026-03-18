import { setCategoryInputs } from './display';
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
import { showModalForDelete } from './common/modal';
import {
  resetEditQuizBtns,
  goToCategoryToSetNewCategory,
} from './common/utils';
import { getAccuracyRate } from './common/utils';
import type { Inputs } from '../types/inputs.type';
import type { InputsCategory } from '../types/inputsCategory.type';
import type { modalForDeleteElmsType } from '../types/modalForDeleteElms.type';
import type {
  labelForTypeType,
  labelForPriorityType,
} from '../types/labels.type';
import type { ListenerForShowModalForDeleteType } from '../types/listenerForShowModalForDelete.type';

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
          goToCategoryToSetNewCategory(aSectionElms, 'quizList');
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

export function setInnerHTMLForEditIrregular(
  aIdx: number,
  aCurrentVal: Inputs,
  aIsUnderEdit: boolean,
  aListDdElms: NodeListOf<HTMLElement>
) {
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
}

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
  aQuizCategory: Map<number, InputsCategory>
) {
  aCurrentValKeys.forEach((val, idx: number) => {
    if (idx === 3 || idx === 7) {
      setInnerHTMLForEditIrregular(
        idx,
        aCurrentVal as Inputs,
        false,
        aListDdElms
      );
    } else {
      const aCurrentValKey = val;
      if (idx === 0 || idx === 1 || idx === 5) {
        setLablesForIrregular(
          idx,
          aCurrentVal as Inputs,
          aCurrentValKey,
          aListDdElms,
          aQuizCategory
        );
      } else {
        aListDdElms[idx].innerHTML = String(
          (aCurrentVal as Inputs)[aCurrentValKey]
        );
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
  aBsModal: bootstrap.Modal
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
          aQuizCategory
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
  aCurrentValKeys: (keyof Inputs)[],
  aBsModal: bootstrap.Modal
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
    aCurrentValKeys,
    aBsModal
  );
}
