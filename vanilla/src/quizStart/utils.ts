import { displayList, setEventForDisplayDetail } from '../quizList/utils';
import {
  getCategoryOptions,
  getTypeOptions,
  getAnswerOfSelectionForDisplay,
  getNumberOfQuestionsOptionsAndSetValidation,
} from '../common/forms/form';
import { labelForQuestionAnswer } from '../common/labels/labels';
import { getAccuracyRate } from '../common/utils';
import { getDataFromLocalStorage } from '../common/dataManagement';
import type { Inputs } from '../common/types/inputs.type';
import type { InputsCategory } from '../common/types/inputsCategory.type';
import type { InputsForResult } from '../common/types/inputsForResult.type';

export function setQuizStartForm(
  aQuizData: Map<number, Inputs>,
  aQuizCategory: Map<number, InputsCategory>,
  aButtonSaveElm: HTMLButtonElement,
  aQuizStartFormCategorySelectElm: HTMLSelectElement,
  aQuizStartFormTypeSelectElm: HTMLSelectElement,
  aNumberOfQuestionsSelectElm: HTMLSelectElement,
  aPrioritySelectElm: HTMLSelectElement,
  aQuizStartFormStartButtonElm: HTMLButtonElement,
  aQuizStartAlertDivElm: HTMLElement
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

  if (aNumberOfQuestionsSelectElm) {
    aNumberOfQuestionsSelectElm.innerHTML =
      getNumberOfQuestionsOptionsAndSetValidation(
        aQuizData.size,
        aQuizStartFormCategorySelectElm,
        aQuizStartFormTypeSelectElm,
        aNumberOfQuestionsSelectElm,
        aPrioritySelectElm,
        aQuizStartFormStartButtonElm,
        aQuizStartAlertDivElm
      );
  }

  const setSelectForNumberOfQuestions = () => {
    if (
      aQuizStartFormCategorySelectElm.value === 'unspecified' &&
      aQuizStartFormTypeSelectElm.value === 'unspecified'
    ) {
      if (aNumberOfQuestionsSelectElm) {
        aNumberOfQuestionsSelectElm.innerHTML =
          getNumberOfQuestionsOptionsAndSetValidation(
            aQuizData.size,
            aQuizStartFormCategorySelectElm,
            aQuizStartFormTypeSelectElm,
            aNumberOfQuestionsSelectElm,
            aPrioritySelectElm,
            aQuizStartFormStartButtonElm,
            aQuizStartAlertDivElm
          );
      }
    } else {
      const numberOfQuestionsArray = [...aQuizData].filter(
        ([_, val]) =>
          (val.category == aQuizStartFormCategorySelectElm.value &&
            val.type == aQuizStartFormTypeSelectElm.value) ||
          (aQuizStartFormCategorySelectElm.value == 'unspecified' &&
            val.type == aQuizStartFormTypeSelectElm.value) ||
          (val.category == aQuizStartFormCategorySelectElm.value &&
            aQuizStartFormTypeSelectElm.value == 'unspecified')
      );
      if (aNumberOfQuestionsSelectElm) {
        aNumberOfQuestionsSelectElm.innerHTML =
          getNumberOfQuestionsOptionsAndSetValidation(
            numberOfQuestionsArray.length,
            aQuizStartFormCategorySelectElm,
            aQuizStartFormTypeSelectElm,
            aNumberOfQuestionsSelectElm,
            aPrioritySelectElm,
            aQuizStartFormStartButtonElm,
            aQuizStartAlertDivElm
          );
      }
    }
  };

  aQuizStartFormCategorySelectElm.addEventListener('change', function () {
    setSelectForNumberOfQuestions();
  });

  aQuizStartFormTypeSelectElm.addEventListener('change', function () {
    setSelectForNumberOfQuestions();
  });
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

const retrieveNecessaryData = (
  aQuizData: Map<number, Inputs>,
  aCategory: string,
  aType: string,
  aNumberOfQuestions: string,
  aPriority: string
) => {
  const necessaryData: Map<number, InputsForResult> = new Map();
  const keys: number[] = [...aQuizData.keys()];
  const randomIndices: number[] =
    aPriority === 'random' ? getRandomIndexArray(keys.length) : [];

  const data =
    aPriority === 'random'
      ? new Map(aQuizData)
      : new Map(
          [...aQuizData.entries()]
            .sort((a, b) => parseInt(b[1].priority) - parseInt(a[1].priority))
            .map(([_, val], cnt) => [cnt, val])
        );

  let cnt = 0;
  [...data].forEach(([_, val], idx) => {
    const currentVal =
      aPriority === 'random'
        ? (data.get(keys[randomIndices[idx]]) as Inputs)
        : val;
    if (currentVal) {
      if (
        (aCategory === currentVal.category || aCategory === 'unspecified') &&
        (aType === currentVal.type || aType === 'unspecified') &&
        (cnt < parseInt(aNumberOfQuestions) || aNumberOfQuestions === 'all')
      ) {
        const newVal: InputsForResult = {
          id: currentVal.id,
          type: currentVal.type,
          question: currentVal.question,
          answer: currentVal.answer,
          numberOfOptions: currentVal.numberOfOptions,
          options: currentVal.options,
          explanation: currentVal.explanation,
          notes: currentVal.notes,
          isCorrectAnswer: false,
          answerForDisplay:
            currentVal.type === 'trueOrFalse'
              ? labelForQuestionAnswer[currentVal.answer]
              : getAnswerOfSelectionForDisplay(currentVal),
        };
        necessaryData.set(cnt, newVal);
        ++cnt;
      }
    }
  });
  return necessaryData;
};

export function getQuizDataForPractice(
  aQuizData: Map<number, Inputs>,
  aCategory: string,
  aType: string,
  aNumberOfQuestions: string,
  aPriority: string
) {
  return retrieveNecessaryData(
    aQuizData,
    aCategory,
    aType,
    aNumberOfQuestions,
    aPriority
  );
}

const quizStartQuestionElm = document.querySelector('.js-quizStartQuestion');
const quizQuestionBtnContDivElms = document.querySelectorAll(
  '.js-quizQuestionBtnContDiv'
);

const quizQuestionSelectionOptionsDivElm =
  quizQuestionBtnContDivElms[1].querySelector('div');

export function displayQuizQuestion(
  aCurrentQuizDataForPractice: InputsForResult,
  aQuizStartQuestionNumberDivElm: NodeListOf<HTMLElement>,
  aQuizIndex: number,
  aQuizDataForPracticeLength: number
) {
  if (quizStartQuestionElm && aCurrentQuizDataForPractice) {
    quizStartQuestionElm.innerHTML = aCurrentQuizDataForPractice.question;
  }
  if (
    aCurrentQuizDataForPractice &&
    aCurrentQuizDataForPractice.type === 'selection'
  ) {
    let result = '';
    aCurrentQuizDataForPractice.options.forEach(
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
    aCurrentQuizDataForPractice &&
    aCurrentQuizDataForPractice.type === 'trueOrFalse'
      ? [0, 1]
      : [1, 0];
  quizQuestionBtnContDivElms[typeIndices[0]].classList.remove('d-none');
  quizQuestionBtnContDivElms[typeIndices[1]].classList.add('d-none');

  // display the question number
  aQuizStartQuestionNumberDivElm.forEach((elm) => {
    elm.innerHTML = `${aQuizIndex + 1}問目/${aQuizDataForPracticeLength}問`;
  });
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
  aQuizStartQuestionButtonElms: NodeListOf<HTMLButtonElement>,
  aQuizStartNotesTextAreaDivElm: HTMLElement,
  aListUlElm: HTMLElement,
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

  if (aQuizStartNotesTextAreaDivElm) {
    aQuizStartNotesTextAreaDivElm.innerHTML = `
    <textarea class="form-control" id="notes" rows="3">${aCurrentQuizDataForPractice.notes}</textarea>`;
    (aQuizStartNotesTextAreaDivElm as HTMLElement).dataset.iscorrectanswer =
      String(isCorrectAnswer);
  }

  if (aQuizIndex + 1 === aQuizDataForPractice.size) {
    aQuizStartQuestionButtonElms[1].classList.add('d-none');
  } else {
    aQuizStartQuestionButtonElms[1].classList.remove('d-none');
  }

  // save data: areCorrectAnswers to the original data / start
  const id = aCurrentQuizDataForPractice.id;
  const originalVal = aQuizData.get(id);
  if (originalVal) {
    let areCorrectAnswers = originalVal.areCorrectAnswers ?? [];
    areCorrectAnswers.push(isCorrectAnswer);
    originalVal.areCorrectAnswers = areCorrectAnswers;
    aQuizData.set(id, originalVal);
    localStorage.setItem('quizData', JSON.stringify([...aQuizData]));
    displayList(aQuizData, aListUlElm as HTMLElement);
    setEventForDisplayDetail(
      aQuizData,
      aQuizCategory,
      aListDivElms,
      aCurrentValKeys,
      aListDdElms,
      aSectionElms,
      aButtonSaveElm,
      aButtonCancelElm,
      aListDtElms,
      aDivIdx3DivElms,
      aButtonBackToListElms
    );
  }
  // save data: areCorrectAnswers to the original data / end

  if (quizStartAccuracyRateSpanElm && originalVal) {
    quizStartAccuracyRateSpanElm.innerHTML = getAccuracyRate(originalVal);
  }
}

export function displayQuizResult(aQuizIndex: number) {
  const quizDataForPractice = getDataFromLocalStorage('quizDataForPractice');

  let result = '';
  let numberOfCorrectAnswersForPractice = 0;
  quizDataForPractice.forEach((val, idx) => {
    if (idx <= aQuizIndex) {
      result += `<div class="${
        val.isCorrectAnswer ? 'bg-success-subtle' : 'bg-secondary-subtle'
      } mb-4 p-4 pb-3">
              <p>
                問題${idx + 1}（${val.isCorrectAnswer ? '正解' : '不正解'}）<br />
                問題：${val.question}<br />
                答え：${val.answerForDisplay}<br />
                解説：${val.explanation}
                ${val.notes ? '<br />メモ：' + val.notes : ''}
              </p>
            </div>`;
      if (val.isCorrectAnswer) {
        ++numberOfCorrectAnswersForPractice;
      }
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
      Math.round((numberOfCorrectAnswersForPractice / (aQuizIndex + 1)) * 100)
    );
  }
}
