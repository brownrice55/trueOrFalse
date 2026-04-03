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
    const currentVal = aQuizData.get(keys[randomIndices[idx]]) as Inputs;
    const newVal: InputsForResult = {
      id: 0,
      type: '',
      question: '',
      answer: 0,
      numberOfOptions: 0,
      options: [[false, '']],
      explanation: '',
      notes: '',
      isCorrectAnswer: false,
      answerForDisplay: '',
    };
    if (currentVal) {
      newVal.id = currentVal.id;
      newVal.question = currentVal.question;
      newVal.type = currentVal.type;
      newVal.answer = currentVal.answer;
      newVal.numberOfOptions = currentVal.numberOfOptions;
      newVal.options = currentVal.options;
      newVal.answerForDisplay =
        currentVal.type === 'trueOrFalse'
          ? labelForQuestionAnswer[currentVal.answer]
          : getAnswerOfSelectionForDisplay(currentVal);
      newVal.explanation = currentVal.explanation;
      newVal.notes = currentVal.notes;
      newVal.isCorrectAnswer = false;
      currentVals.set(idx, newVal);
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

export function displayQuizQuestion(
  currentQuizDataForPractice: InputsForResult
) {
  if (quizStartQuestionElm && currentQuizDataForPractice) {
    quizStartQuestionElm.innerHTML = currentQuizDataForPractice.question;
  }

  if (
    currentQuizDataForPractice &&
    currentQuizDataForPractice.type === 'selection'
  ) {
    let result = '';
    currentQuizDataForPractice.options.forEach(
      (arr: [boolean, string], idx: number) => {
        result += `<div class="form-check form-check-inline mb-3 my-3">
          <input class="form-check-input" type="checkbox" value="" id="quizStartSelectionOption-${idx}" data-value="${arr[1]}">
          <label class="form-check-label cursor-pointer" for="quizStartSelectionOption-${idx}">
          ${arr[1]}
          </label>
        </div>`;
      }
    );
    if (quizQuestionSelectionOptionsDivElm) {
      quizQuestionSelectionOptionsDivElm.innerHTML = result;
    }
  }

  const typeIndices =
    currentQuizDataForPractice &&
    currentQuizDataForPractice.type === 'trueOrFalse'
      ? [0, 1]
      : [1, 0];
  quizQuestionBtnContDivElms[typeIndices[0]].classList.remove('d-none');
  quizQuestionBtnContDivElms[typeIndices[1]].classList.add('d-none');
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

export function displayQuizAnswers(
  aAnswerOfTrueOrFalseBtnIdx: number | null,
  aCurrentQuizDataForPractice: InputsForResult,
  aValues: [boolean, string][] | null,
  aQuizData: Map<number, Inputs>,
  aQuizIndex: number,
  aQuizDataForPractice: Map<number, InputsForResult>,
  aQuizStartQuestionButtonElms: NodeListOf<HTMLButtonElement>
) {
  if (quizStartAnswerSpanElm) {
    quizStartAnswerSpanElm.innerHTML =
      aCurrentQuizDataForPractice.answerForDisplay;
  }

  const isCorrectAnswer =
    aCurrentQuizDataForPractice.type === 'trueOrFalse'
      ? aAnswerOfTrueOrFalseBtnIdx === aCurrentQuizDataForPractice.answer
      : JSON.stringify(aValues) ===
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
    if (isCorrectAnswer) {
      originalVal.numberOfCorrectAnswers += 1;
    }
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
}

export function displayQuizResult() {
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
                ${val.answerForDisplay}<br />
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
