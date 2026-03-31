import {
  getCategoryOptions,
  getTypeOptions,
  getAnswerOfSelectionForDisplay,
} from '../common/forms/form';
import { labelForQuestionAnswer } from '../common/labels/labels';
import { getAccuracyRate } from '../common/utils';
import type { Inputs } from '../types/inputs.type';
import type { InputsCategory } from '../types/inputsCategory.type';

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
  let currentVals: Inputs[] = [];
  keys.forEach((_, idx) => {
    currentVals.push(aQuizData.get(keys[randomIndices[idx]]) as Inputs);
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
  aQuizDataForPractice: Inputs[],
  aQuizIndex: number,
  aQuizDivElms: NodeListOf<HTMLElement>,
  aQuizData: Map<number, Inputs>
) {
  const currentQuzDataForPractice = aQuizDataForPractice[aQuizIndex];
  if (quizStartQuestionElm) {
    quizStartQuestionElm.innerHTML = currentQuzDataForPractice.question;
  }

  if (currentQuzDataForPractice.type === 'selection') {
    let result = '';
    currentQuzDataForPractice.options.forEach((arr, idx) => {
      result += `<div class="form-check form-check-inline mb-3 my-3">
          <input class="form-check-input" type="checkbox" value="" id="quizStartSelectionOption-${idx}" data-value="${arr[1]}">
          <label class="form-check-label" for="quizStartSelectionOption-${idx}">
          ${arr[1]}
          </label>
        </div>`;
    });
    if (quizQuestionSelectionOptionsDivElm) {
      quizQuestionSelectionOptionsDivElm.innerHTML = result;
    }
  }

  const typeIndices =
    currentQuzDataForPractice.type === 'trueOrFalse' ? [0, 1] : [1, 0];
  quizQuestionBtnContDivElms[typeIndices[0]].classList.remove('d-none');
  quizQuestionBtnContDivElms[typeIndices[1]].classList.add('d-none');

  if (currentQuzDataForPractice.type === 'trueOrFalse') {
    const buttons = quizQuestionBtnContDivElms[0].querySelectorAll('button');
    buttons.forEach((elm) => {
      elm.addEventListener('click', function (e) {
        const targetElm = e.currentTarget as HTMLButtonElement;
        const index = parseInt(targetElm.dataset.index ?? '0');
        displayQuizAnswers(index, currentQuzDataForPractice, null, aQuizData);
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

        displayQuizAnswers(null, currentQuzDataForPractice, values, aQuizData);
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
  aIndex: number | null,
  aCurrentQuzDataForPractice: Inputs,
  aVlues: [boolean, string][] | null,
  aQuizData: Map<number, Inputs>
) => {
  const answerResult =
    aCurrentQuzDataForPractice.type === 'trueOrFalse'
      ? labelForQuestionAnswer[aCurrentQuzDataForPractice.answer]
      : getAnswerOfSelectionForDisplay(aCurrentQuzDataForPractice);

  if (quizStartAnswerSpanElm) {
    quizStartAnswerSpanElm.innerHTML = answerResult;
  }

  const isCorrectAnswer =
    aCurrentQuzDataForPractice.type === 'trueOrFalse'
      ? aIndex === aCurrentQuzDataForPractice.answer
      : JSON.stringify(aVlues) ===
        JSON.stringify(aCurrentQuzDataForPractice.options);

  if (quizStartIsCorrectAnswerElm) {
    quizStartIsCorrectAnswerElm.innerHTML = isCorrectAnswer
      ? '正解！'
      : '不正解！';
  }
  if (quizStartExplanationSpanElm) {
    quizStartExplanationSpanElm.innerHTML =
      aCurrentQuzDataForPractice.explanation;
  }

  aCurrentQuzDataForPractice.numberOfAnswers += 1;
  if (isCorrectAnswer) {
    aCurrentQuzDataForPractice.numberOfCorrectAnswers += 1;
  }
  if (quizStartAccuracyRateSpanElm) {
    quizStartAccuracyRateSpanElm.innerHTML = getAccuracyRate(
      aCurrentQuzDataForPractice
    );
  }

  // update numberOfAnswers and numberOfCorrectAnswers to original data
  const id = aCurrentQuzDataForPractice.id;
  const originalVal = aQuizData.get(id);
  if (originalVal) {
    originalVal.numberOfAnswers = aCurrentQuzDataForPractice.numberOfAnswers;
    originalVal.numberOfCorrectAnswers =
      aCurrentQuzDataForPractice.numberOfCorrectAnswers;
    aQuizData.set(id, originalVal);
    localStorage.setItem('quizData', JSON.stringify([...aQuizData]));
  }
};
