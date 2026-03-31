import {
  getCategoryOptions,
  getTypeOptions,
  getAnswerOfSelectionForDisplay,
} from '../common/forms/form';
import { labelForQuestionAnswer } from '../common/labels/labels';
import { getAccuracyRate } from '../common/utils';
import { getDataFromLocalStorage } from '../common/dataManagement';
import type { Inputs } from '../types/inputs.type';
import type { InputsCategory } from '../types/inputsCategory.type';
import type { InputsForResult } from '../types/inputsForResult.type';

export function setQuizStartForm(
  aQuizCategory: Map<number, InputsCategory>,
  aButtonSaveElm: HTMLButtonElement,
  aQuizStartFormCategorySelectElm: HTMLElement,
  aQuizStartFormTypeSelectElm: HTMLElement
) {
  if (aQuizStartFormCategorySelectElm) {
    aQuizStartFormCategorySelectElm.innerHTML = getCategoryOptions(
      aQuizCategory,
      'unspecified',
      aButtonSaveElm,
      false
    );
  }

  if (aQuizStartFormTypeSelectElm) {
    aQuizStartFormTypeSelectElm.innerHTML = getTypeOptions('trueOrFalse', true);
  }
}

const getRandomIndexArray = function (aLength: number) {
  let len = aLength;
  let array = [];
  for (let cnt = 0; cnt < len; ++cnt) {
    array[cnt] = cnt;
  }
  for (let cnt = len - 1; cnt > 0; --cnt) {
    const random = Math.floor(Math.random() * (cnt + 1));
    [array[cnt], array[random]] = [array[random], array[cnt]];
  }
  return array;
};

const getCurrentVals = (aQuizData: Map<number, Inputs>) => {
  const keys = [...aQuizData.keys()];
  const randomIndices = getRandomIndexArray(keys.length);
  let currentVals: Map<number, InputsForResult> = new Map();
  keys.forEach((_, idx) => {
    const currentVal = aQuizData.get(
      keys[randomIndices[idx]]
    ) as InputsForResult;
    if (currentVal) {
      currentVal.isCorrectAnswer = false;
      currentVals.set(idx, currentVal);
    }
  });
  return currentVals;
};

export function getQuizDataForPractice(
  aQuizData: Map<number, Inputs>,
  aType: string,
  aPriority: string
) {
  let currentVals;
  if (aType === 'TrueOrFalse') {
  } else if (aType === 'selection') {
  } else {
    if (aPriority === 'random') {
      currentVals = getCurrentVals(aQuizData);
    }
  }
  currentVals = getCurrentVals(aQuizData); //temp
  return currentVals;
}

const quizStartQuestionElm = document.querySelector('.js-quizStartQuestion');
const quizQuestionBtnContDivElms = document.querySelectorAll(
  '.js-quizQuestionBtnContDiv'
);

const quizQuestionSelectionOptionsDivElm =
  quizQuestionBtnContDivElms[1].querySelector('div');
const quizQuestionSelectionOptionsButtonElm =
  quizQuestionBtnContDivElms[1].querySelector('button');

export function displayQuizQuestion(
  aQuizDataForPractice: Map<number, InputsForResult>,
  aQuizIndex: number,
  aQuizDivElms: NodeListOf<HTMLElement>,
  aQuizData: Map<number, Inputs>,
  aQuizStartQuestionButtonElms: NodeListOf<HTMLButtonElement>
) {
  const currentQuzDataForPractice = aQuizDataForPractice.get(aQuizIndex);
  if (quizStartQuestionElm && currentQuzDataForPractice) {
    quizStartQuestionElm.innerHTML = currentQuzDataForPractice.question;
  }

  if (
    currentQuzDataForPractice &&
    currentQuzDataForPractice.type === 'selection'
  ) {
    let result = '';
    currentQuzDataForPractice.options.forEach((arr, idx) => {
      result += `<div class="form-check form-check-inline mb-3 my-3">
          <input class="form-check-input" type="checkbox" value="" id="quizStartSelectionOption-${idx}" data-value="${arr[1]}">
          <label class="form-check-label cursor-pointer" for="quizStartSelectionOption-${idx}">
          ${arr[1]}
          </label>
        </div>`;
    });
    if (quizQuestionSelectionOptionsDivElm) {
      quizQuestionSelectionOptionsDivElm.innerHTML = result;
    }
  }

  const typeIndices =
    currentQuzDataForPractice &&
    currentQuzDataForPractice.type === 'trueOrFalse'
      ? [0, 1]
      : [1, 0];
  quizQuestionBtnContDivElms[typeIndices[0]].classList.remove('d-none');
  quizQuestionBtnContDivElms[typeIndices[1]].classList.add('d-none');

  if (
    currentQuzDataForPractice &&
    currentQuzDataForPractice.type === 'trueOrFalse'
  ) {
    const buttons = quizQuestionBtnContDivElms[0].querySelectorAll('button');
    buttons.forEach((elm) => {
      elm.addEventListener('click', function (e) {
        const targetElm = e.currentTarget as HTMLButtonElement;
        const answerOfTrueOrFalseBtnIdx = parseInt(
          targetElm.dataset.index ?? '0'
        );
        displayQuizAnswers(
          answerOfTrueOrFalseBtnIdx,
          currentQuzDataForPractice,
          null,
          aQuizData,
          aQuizIndex,
          aQuizDataForPractice,
          aQuizStartQuestionButtonElms
        );
        aQuizDivElms[1].classList.add('d-none');
        aQuizDivElms[2].classList.remove('d-none');
      });
    });
  } else {
    quizQuestionSelectionOptionsButtonElm?.addEventListener(
      'click',
      function () {
        const checkboxElms =
          quizQuestionSelectionOptionsDivElm?.querySelectorAll('input');
        let values: [boolean, string][] = [];
        checkboxElms?.forEach((elm) => {
          values.push([elm.checked, String(elm.dataset.value)]);
        });

        displayQuizAnswers(
          null,
          currentQuzDataForPractice as InputsForResult,
          values,
          aQuizData,
          aQuizIndex,
          aQuizDataForPractice,
          aQuizStartQuestionButtonElms
        );
        aQuizDivElms[1].classList.add('d-none');
        aQuizDivElms[2].classList.remove('d-none');
      }
    );
  }
}

const quizStartAnswerSpanElm = document.querySelector(
  '.js-quizStartAnswerSpan'
);
const quizStartIsCorrectAnswerElm = document.querySelector(
  '.js-quizStartIsCorrectAnswer'
);
const quizStartExplanationSpanElm = document.querySelector(
  '.js-quizStartExplanationSpan'
);
const quizStartAccuracyRateSpanElm = document.querySelector(
  '.js-quizStartAccuracyRateSpan'
);

const displayQuizAnswers = (
  aAnswerOfTrueOrFalseBtnIdx: number | null,
  aCurrentQuizDataForPractice: InputsForResult,
  aVlues: [boolean, string][] | null,
  aQuizData: Map<number, Inputs>,
  aQuizIndex: number,
  aQuizDataForPractice: Map<number, InputsForResult>,
  aQuizStartQuestionButtonElms: NodeListOf<HTMLButtonElement>
) => {
  const answerResult =
    aCurrentQuizDataForPractice.type === 'trueOrFalse'
      ? labelForQuestionAnswer[aCurrentQuizDataForPractice.answer]
      : getAnswerOfSelectionForDisplay(aCurrentQuizDataForPractice);

  if (quizStartAnswerSpanElm) {
    quizStartAnswerSpanElm.innerHTML = answerResult;
  }

  const isCorrectAnswer =
    aCurrentQuizDataForPractice.type === 'trueOrFalse'
      ? aAnswerOfTrueOrFalseBtnIdx === aCurrentQuizDataForPractice.answer
      : JSON.stringify(aVlues) ===
        JSON.stringify(aCurrentQuizDataForPractice.options);

  if (quizStartIsCorrectAnswerElm) {
    quizStartIsCorrectAnswerElm.innerHTML = isCorrectAnswer
      ? '正解！'
      : '不正解！';
  }
  if (quizStartExplanationSpanElm) {
    quizStartExplanationSpanElm.innerHTML =
      aCurrentQuizDataForPractice.explanation;
  }

  if (aQuizIndex + 1 === aQuizDataForPractice.size) {
    aQuizStartQuestionButtonElms[1].classList.add('d-none');
  } else {
    aQuizStartQuestionButtonElms[1].classList.remove('d-none');
  }
  aCurrentQuizDataForPractice.isCorrectAnswer = isCorrectAnswer;

  // update numberOfAnswers and numberOfCorrectAnswers to original data
  const id = aCurrentQuizDataForPractice.id;
  const originalVal = aQuizData.get(id);
  if (originalVal) {
    originalVal.numberOfAnswers += 1;
    originalVal.numberOfCorrectAnswers += 1;
    aQuizData.set(id, originalVal);
    localStorage.setItem('quizData', JSON.stringify([...aQuizData]));

    if (quizStartAccuracyRateSpanElm) {
      quizStartAccuracyRateSpanElm.innerHTML = getAccuracyRate(originalVal);
    }

    localStorage.setItem(
      'quizDataForPractice',
      JSON.stringify([...aQuizDataForPractice])
    );
  }
};

export function displayResult() {
  const quizDataForPractice = getDataFromLocalStorage('quizDataForPractice');

  let result = '';
  let numberOfCorrectAnswers = 0;
  quizDataForPractice.forEach((val, idx) => {
    result += `<div class="${
      val.isCorrectAnswer ? 'bg-success-subtle' : 'bg-secondary-subtle'
    } mb-4 p-4 pb-3">
              <p>
                問題${idx + 1}（${val.isCorrectAnswer ? '正解' : '不正解'}）<br />
                ${val.question}<br />
                ${val.answer}<br />
                ${val.explanation}
                ${val.notes ? '<br />' + val.notes : ''}
              </p>
            </div>`;
    if (val.isCorrectAnswer) {
      ++numberOfCorrectAnswers;
    }
  });
  const quizStartResultElm = document.querySelector('.js-quizStartResult');
  if (quizStartResultElm) {
    quizStartResultElm.innerHTML = result;
  }

  const quizStartAccuracyRateResultSpanElm = document.querySelector(
    '.js-quizStartAccuracyRateResultSpan'
  );
  if (quizStartAccuracyRateResultSpanElm) {
    quizStartAccuracyRateResultSpanElm.innerHTML = String(
      Math.round((numberOfCorrectAnswers / quizDataForPractice.size) * 100)
    );
  }
}
