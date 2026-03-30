import {
  getCategoryOptions,
  getTypeOptions,
  getAnswerOfSelectionForDisplay,
} from './common/form';
import { labelForQuestionAnswer } from './common/labels';
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

export function displayQuizQuestion(
  aQuizDataForPractice: Inputs[],
  aQuizIndex: number,
  aQuizDivElms: NodeListOf<HTMLElement>
) {
  const currentQuzDataForPractice = aQuizDataForPractice[aQuizIndex];
  const quizStartQuestionElm = document.querySelector('.js-quizStartQuestion');
  if (quizStartQuestionElm) {
    quizStartQuestionElm.innerHTML = currentQuzDataForPractice.question;
  }

  const quizQuestionBtnContDivElms = document.querySelectorAll(
    '.js-quizQuestionBtnContDiv'
  );

  if (currentQuzDataForPractice.type === 'selection') {
    let result = `<div class="text-center">`;
    let cnt = 1;
    currentQuzDataForPractice.options.forEach((arr, idx) => {
      if (cnt % 3) {
        result += `<button class="btn btn-primary px-4 py-2 me-3" data-index="${idx}">${arr[1]}</button>`;
      } else {
        result += `<button class="btn btn-primary px-4 py-2" data-index="${idx}">${arr[1]}</button>`;
        result += `</div>`;
        if (currentQuzDataForPractice.options.length > idx + 1) {
          result += `<div class="text-center mt-3">`;
        }
      }
      ++cnt;
    });
    quizQuestionBtnContDivElms[1].innerHTML = result;
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
        displayQuizAnswers(index, currentQuzDataForPractice);
        aQuizDivElms[1].classList.add('d-none');
        aQuizDivElms[2].classList.remove('d-none');
      });
    });
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
const displayQuizAnswers = (
  aIndex: number,
  aCurrentQuzDataForPractice: Inputs
) => {
  const answerResult =
    aCurrentQuzDataForPractice.type === 'trueOrFalse'
      ? labelForQuestionAnswer[aCurrentQuzDataForPractice.answer]
      : getAnswerOfSelectionForDisplay(aCurrentQuzDataForPractice);

  if (quizStartAnswerSpanElm) {
    quizStartAnswerSpanElm.innerHTML = answerResult;
  }

  let isCorrectAnswer = false;
  if (aCurrentQuzDataForPractice.type === 'trueOrFalse') {
    isCorrectAnswer = aIndex === aCurrentQuzDataForPractice.answer;
  } else {
    // checkbox*******
  }
  if (quizStartIsCorrectAnswerElm) {
    quizStartIsCorrectAnswerElm.innerHTML = isCorrectAnswer
      ? '正解！'
      : '不正解！';
  }
  if (quizStartExplanationSpanElm) {
    quizStartExplanationSpanElm.innerHTML =
      aCurrentQuzDataForPractice.explanation;
  }

  //   numberOfAnswers

  // numberOfCorrectAnswers
};
