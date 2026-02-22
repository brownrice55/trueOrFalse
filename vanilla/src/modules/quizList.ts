import { setQuizList, setCategoryInputs } from './display';
import {
  getCategoryOptions,
  getTypeOptions,
  getTextArea,
  getPriorityOptions,
} from './common/form';
import {
  labelForQuestionAnswer,
  labelForType,
  labelForPriority,
} from './common/labels';
import type { Inputs } from '../types/inputs.type';
import type { InputsCategory } from '../types/inputsCategory.type';
import type {
  labelForTypeType,
  labelForPriorityType,
} from '../types/labels.type';

const setEventForDisplayDetail = (
  aQuizData: Map<number, Inputs>,
  aQuizCategory: Map<number, InputsCategory>,
  aListDivElms: NodeListOf<HTMLElement>
) => {
  const listDetailButtonElms = document.querySelectorAll(
    '.js-listDetailButton'
  );

  const buttonDeleteDetailElm = document.querySelector(
    '.js-buttonDeleteDetail'
  );

  const quizQuestionSpanElm = document.querySelector('.js-quizQuestionSpan');

  const currentValKeys: (keyof Inputs)[] = [
    'category',
    'type',
    'question',
    'answer',
    'explanation',
    'priority',
    'notes',
    'numberOfCorrectAnswers',
  ];

  const listDdElms = document.querySelectorAll('.js-listDd');
  const listEditBtnElms = document.querySelectorAll('.js-listEditBtn');

  const setInnerHTMLForEdit = (
    aIdx: number,
    aCurrentVal: Inputs,
    aIsUnderEdit: boolean
  ) => {
    const formElements = [
      `<select class="form-select" aria-label="category" id="detailCategory">${getCategoryOptions(aQuizCategory, aCurrentVal.category)}</select>`,
      `<select class="form-select" aria-label="type" id="detailType" value="${aCurrentVal.type}">${getTypeOptions(aCurrentVal.type)}</select>`,
      getTextArea(aCurrentVal.question, 'detailQuestion'),
      '',
      getTextArea(aCurrentVal.explanation, 'detailExplanation'),
      `<select class="form-select" aria-label="priority" id="detailPriority" value="${aCurrentVal.priority}">${getPriorityOptions(aCurrentVal.priority)}</select>`,
      getTextArea(aCurrentVal.notes, 'detailNotes'),
    ];

    const currentValKey = currentValKeys[aIdx];

    if (aIsUnderEdit) {
      listDdElms[aIdx].innerHTML = formElements[aIdx];
    } else {
      if (aIdx === 0 || aIdx === 1 || aIdx === 5) {
        setLablesForIrregular(aIdx, aCurrentVal, currentValKey);
      } else {
        listDdElms[aIdx].innerHTML = String(aCurrentVal[currentValKey]);
      }
    }
  };

  const setInnerHTMLForEditIrregular = (
    aIdx: number,
    aCurrentVal: Inputs,
    aIsUnderEdit: boolean
  ) => {
    type FormElementsIrregularIndex3Type = {
      trueOrFalse: string;
      selection: string;
    };
    if (aIsUnderEdit && aIdx === 3) {
      const formElementsIrregularIndex3: FormElementsIrregularIndex3Type = {
        trueOrFalse: `<div class="form-check form-check-inline my-3">
          <input
            class="form-check-input js-addNewAnswerRadio"
            type="radio"
            name="answer"
            id="answer1"
            value="1"
            checked
          />
          <label class="form-check-label" for="answer1">まる</label>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input js-addNewAnswerRadio"
            type="radio"
            name="answer"
            id="answer2"
            value="2"
          />
          <label class="form-check-label" for="answer2">ばつ</label>
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
          <div class="my-3 js-addNewOptionInputsDiv">
            <div class="input-group mb-3">
              <div class="input-group-text">
                <input
                  id="option1"
                  class="js-addNewOptionsCheckbox form-check-input mt-0"
                  type="checkbox"
                  value=""
                />
              </div>
              <input
                id="option1-2"
                type="text"
                class="js-addNewOptionsInputText form-control"
              />
            </div>
            <div class="input-group mb-3">
              <div class="input-group-text">
                <input
                  id="option2"
                  class="js-addNewOptionsCheckbox form-check-input mt-0"
                  type="checkbox"
                  value=""
                />
              </div>
              <input
                id="option2-2"
                type="text"
                class="js-addNewOptionsInputText form-control"
              />
            </div>
          </div>
        </div>`,
      };

      listDdElms[3].innerHTML = String(
        formElementsIrregularIndex3[
          aCurrentVal.type as keyof FormElementsIrregularIndex3Type
        ]
      );
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

        listDdElms[3].innerHTML =
          aCurrentVal.type === 'trueOrFalse'
            ? labelForQuestionAnswer[aCurrentVal.answer]
            : answerForSelection;
      } else {
        listDdElms[7].innerHTML =
          aCurrentVal.numberOfAnswers && aCurrentVal.numberOfCorrectAnswers
            ? (aCurrentVal.numberOfCorrectAnswers /
                aCurrentVal.numberOfAnswers) *
                100 +
              '%'
            : '0%';
      }
    }
  };

  const setLablesForIrregular = (
    aIdx: number,
    aCurrentVal: Inputs,
    aCurrentValKey: keyof Inputs
  ) => {
    if (aIdx === 0) {
      // category
      const key = aCurrentVal[aCurrentValKey];
      if (typeof key === 'string' && typeof parseInt(key) === 'number') {
        const currentCategory = aQuizCategory.get(parseInt(key, 10));
        if (currentCategory) {
          listDdElms[0].innerHTML = String(currentCategory.categoryName);
        }
      } else {
        listDdElms[0].innerHTML = '指定なし';
      }
    } else if (aIdx === 1) {
      // type
      listDdElms[1].innerHTML = String(
        labelForType[aCurrentVal[aCurrentValKey] as keyof labelForTypeType]
      );
    } else if (aIdx === 5) {
      // question
      listDdElms[5].innerHTML = String(
        labelForPriority[
          String(aCurrentVal[aCurrentValKey]) as keyof labelForPriorityType
        ]
      );
    }
  };

  listDetailButtonElms.forEach((elm) => {
    elm.addEventListener('click', function (e) {
      aListDivElms[0].classList.add('d-none');
      aListDivElms[1].classList.remove('d-none');

      const key = parseInt(
        (e.currentTarget as HTMLButtonElement).dataset.key ?? '0'
      );
      const currentVal: Inputs | undefined = aQuizData.get(key);

      if (currentVal) {
        currentValKeys.forEach((val, idx) => {
          if (idx === 3 || idx === 7) {
            setInnerHTMLForEditIrregular(idx, currentVal, false);
          } else {
            const currentValKey = val;
            if (idx === 0 || idx === 1 || idx === 5) {
              setLablesForIrregular(idx, currentVal, currentValKey);
            } else {
              listDdElms[idx].innerHTML = String(currentVal[currentValKey]);
            }
          }
        });

        if (quizQuestionSpanElm) {
          quizQuestionSpanElm.textContent = currentVal.question;
        }

        let isUnderEdit = false;
        let cancelBtnElm: HTMLButtonElement | null = null;

        const setDisabled = (aIsUnderEdit: boolean) => {
          listEditBtnElms.forEach((elm) => {
            (elm as HTMLButtonElement).disabled = aIsUnderEdit ? true : false;
          });
        };

        listEditBtnElms.forEach((elm, idx) => {
          elm.addEventListener('click', function (e) {
            isUnderEdit = !isUnderEdit;
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
                'ms-2'
              );

              elm?.parentNode?.appendChild(cancelBtnElm);
              cancelBtnElm.addEventListener('click', function () {
                this.remove();
                cancelBtnElm = null;
                isUnderEdit = false;
                setDisabled(isUnderEdit);
                elm.textContent = '編集する';
                if (idx === 3 || idx === 7) {
                  setInnerHTMLForEditIrregular(idx, currentVal, isUnderEdit);
                } else {
                  setInnerHTMLForEdit(idx, currentVal, isUnderEdit);
                }
              });
            } else {
              elm.textContent = '編集する';
              cancelBtnElm?.remove();
              cancelBtnElm = null;
            }
            if (idx === 3 || idx === 7) {
              setInnerHTMLForEditIrregular(idx, currentVal, isUnderEdit);
            } else {
              setInnerHTMLForEdit(idx, currentVal, isUnderEdit);
            }
          });
        });

        buttonDeleteDetailElm?.addEventListener('click', function () {
          aQuizData.delete(key);
          localStorage.setItem('quizData', JSON.stringify([...aQuizData]));

          // reset isActive in the category data
          let activeCategoryKeys: string[] = [];
          aQuizData.forEach((val) => {
            if (val.category !== 'unspecified') {
              activeCategoryKeys.push(val.category);
            }
          });
          const activeCategoryKeysSet = new Set(activeCategoryKeys);
          aQuizCategory.forEach((val, key) => {
            val.isActive = false;
            activeCategoryKeysSet.forEach((val2) => {
              if (key === parseInt(val2)) {
                val.isActive = true;
              }
            });
          });
          localStorage.setItem(
            'quizCategory',
            JSON.stringify([...aQuizCategory])
          );

          setCategoryInputs(aQuizCategory, aQuizData);

          aListDivElms[0].classList.remove('d-none');
          aListDivElms[1].classList.add('d-none');
          setQuizList(aQuizData, aQuizCategory);
        });
      }
    });
  });
};

const setEventForBackToListPage = (aListDivElms: NodeListOf<HTMLElement>) => {
  const buttonBackToListElms = document.querySelectorAll(
    '.js-buttonBackToList'
  );

  buttonBackToListElms.forEach((elm) => {
    elm.addEventListener('click', function () {
      aListDivElms[0].classList.remove('d-none');
      aListDivElms[1].classList.add('d-none');
    });
  });
};

export function displayList(
  aQuizData: Map<number, Inputs>,
  aQuizCategory: Map<number, InputsCategory>,
  aListDivElms: NodeListOf<Element>,
  aListUlElm: HTMLElement
) {
  let liHtml = '';
  [...aQuizData].forEach(([idx, val]) => {
    liHtml += `<li class="my-3">
                <button class="btn btn-primary btn-sm float-end js-listDetailButton" type="button" data-key="${idx}">詳細</button>
                ${val.question}<br />
                <span>正解率：80%</span>
              </li>`;
  });
  aListUlElm.innerHTML = liHtml;
  setEventForDisplayDetail(
    aQuizData,
    aQuizCategory,
    aListDivElms as NodeListOf<HTMLElement>
  );
  setEventForBackToListPage(aListDivElms as NodeListOf<HTMLElement>);
}
