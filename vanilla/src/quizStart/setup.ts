import {
  setQuizStartForm,
  getQuizDataForPractice,
  displayQuizQuestion,
  displayQuizAnswers,
  displayQuizResult,
} from './utils';
import type { Inputs } from '../common/types/inputs.type';
import type { InputsCategory } from '../common/types/inputsCategory.type';
import type { InputsForResult } from '../common/types/inputsForResult.type';

export function setQuizStart(
  aQuizData: Map<number, Inputs>,
  aQuizCategory: Map<number, InputsCategory>,
  aButtonSaveElm: HTMLButtonElement,
  aListUlElm: HTMLElement,
  aListDivElms: NodeListOf<HTMLElement>,
  aCurrentValKeys: (keyof Inputs)[],
  aListDdElms: NodeListOf<HTMLElement>,
  aSectionElms: NodeListOf<HTMLElement>,
  aButtonCancelElm: HTMLButtonElement,
  aListDtElms: NodeListOf<HTMLElement>,
  aDivIdx3DivElms: NodeListOf<HTMLElement>,
  aButtonBackToListElms: NodeListOf<HTMLButtonElement>
) {
  const quizStartFormCategorySelectElm = document.querySelector(
    '.js-quizStartFormCategorySelect'
  );
  const quizStartFormTypeSelectElm = document.querySelector(
    '.js-quizStartFormTypeSelect'
  );
  const quizStartQuestionButtonElms = document.querySelectorAll(
    '.js-quizStartQuestionButtonAreaDiv button'
  );
  const numberOfQuestionsSelectElm = document.querySelector(
    '.js-numberOfQuestionsSelect'
  );
  const prioritySelectElm = document.querySelector('.js-prioritySelect');
  const quizStartFormStartButtonElm = document.querySelector(
    '.js-quizStartFormStartButton'
  );
  const quizStartAlertDivElm = document.querySelector('.js-quizStartAlertDiv');
  const quizStartNotesTextAreaDivElm = document.querySelector(
    '.js-quizStartNotesTextAreaDiv'
  );

  setQuizStartForm(
    aQuizData,
    aQuizCategory,
    aButtonSaveElm,
    quizStartFormCategorySelectElm as HTMLSelectElement,
    quizStartFormTypeSelectElm as HTMLSelectElement,
    numberOfQuestionsSelectElm as HTMLSelectElement,
    prioritySelectElm as HTMLSelectElement,
    quizStartFormStartButtonElm as HTMLButtonElement,
    quizStartAlertDivElm as HTMLElement
  );

  const quizStartQuestionNumberDivElms: NodeListOf<HTMLElement> =
    document.querySelectorAll('.js-quizStartQuestionNumberDiv');
  let quizDataForPractice: Map<number, InputsForResult> | null = null;
  const quizDivElms = document.querySelectorAll('.js-quizDiv');
  let quizIndex: number;
  let currentQuizDataForPractice: InputsForResult | undefined = undefined;
  if (quizStartFormStartButtonElm) {
    quizStartFormStartButtonElm.addEventListener('click', function () {
      quizIndex = 0;
      quizDataForPractice = getQuizDataForPractice(
        aQuizData,
        (quizStartFormCategorySelectElm as HTMLSelectElement).value, //category
        (quizStartFormTypeSelectElm as HTMLSelectElement).value, //type
        (numberOfQuestionsSelectElm as HTMLSelectElement).value, //numberOfQuestions
        (prioritySelectElm as HTMLSelectElement).value //priority
      ) as Map<number, InputsForResult>;

      currentQuizDataForPractice = quizDataForPractice.get(
        quizIndex
      ) as InputsForResult;
      displayQuizQuestion(
        currentQuizDataForPractice as InputsForResult,
        quizStartQuestionNumberDivElms as NodeListOf<HTMLElement>,
        quizIndex as number,
        quizDataForPractice.size as number
      );
      quizDivElms[0].classList.add('d-none');
      quizDivElms[1].classList.remove('d-none');
    });
  }

  if (quizStartQuestionButtonElms) {
    quizStartQuestionButtonElms.forEach((elm, idx) => {
      elm.addEventListener('click', function () {
        // save data: isCorrectAnswer and notes to the practice data / start
        const isCorrectAnswer =
          (quizStartNotesTextAreaDivElm as HTMLElement).dataset
            .iscorrectanswer === 'true';
        if (currentQuizDataForPractice && quizDataForPractice) {
          currentQuizDataForPractice.isCorrectAnswer = isCorrectAnswer;
          currentQuizDataForPractice.notes = (
            quizStartNotesTextAreaDivElm?.childNodes[1] as HTMLTextAreaElement
          ).value;
          const keys = [...quizDataForPractice.keys()];
          quizDataForPractice.set(keys[quizIndex], currentQuizDataForPractice);
          localStorage.setItem(
            'quizDataForPractice',
            JSON.stringify([...quizDataForPractice])
          );
        }
        // save data: isCorrectAnswer and notes to the practice data / end

        // save data: notes to the original data / start
        if (currentQuizDataForPractice) {
          const id = currentQuizDataForPractice.id;
          const originalVal = aQuizData.get(id);
          if (originalVal) {
            originalVal.notes = currentQuizDataForPractice.notes;
            aQuizData.set(id, originalVal);
            localStorage.setItem('quizData', JSON.stringify([...aQuizData]));
          }
        }
        // save data: notes to the original data / end

        if (idx === 1) {
          // when clicking the '次の問題を解く' button
          ++quizIndex;
          currentQuizDataForPractice = quizDataForPractice?.get(quizIndex);
          displayQuizQuestion(
            currentQuizDataForPractice as InputsForResult,
            quizStartQuestionNumberDivElms,
            quizIndex,
            quizDataForPractice?.size as number
          );
          quizDivElms[0].classList.add('d-none');
          quizDivElms[1].classList.remove('d-none');
          quizDivElms[2].classList.add('d-none');
        } else {
          // when clicking the '終了する' button
          // go to the result page
          displayQuizResult(quizIndex);
          quizDivElms[2].classList.add('d-none');
          quizDivElms[3].classList.remove('d-none');
        }
      });
    });
  }

  // display answers
  // when clicking the 'まる' button or the 'ばつ' button for trueOrFalse

  const quizQuestionBtnContDivElms = document.querySelectorAll(
    '.js-quizQuestionBtnContDiv'
  );

  const buttons = quizQuestionBtnContDivElms[0].querySelectorAll('button');
  buttons.forEach((elm) => {
    elm.addEventListener('click', function (e) {
      const targetElm = e.currentTarget as HTMLButtonElement;
      const answerOfTrueOrFalseBtnIdx = parseInt(
        targetElm.dataset.index ?? '0'
      );
      displayQuizAnswers(
        answerOfTrueOrFalseBtnIdx,
        currentQuizDataForPractice as InputsForResult,
        null,
        aQuizData,
        quizIndex,
        quizDataForPractice as Map<number, InputsForResult>,
        quizStartQuestionButtonElms as NodeListOf<HTMLButtonElement>,
        quizStartNotesTextAreaDivElm as HTMLElement,
        aListUlElm,
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
      quizDivElms[1].classList.add('d-none');
      quizDivElms[2].classList.remove('d-none');
    });
  });

  // when clicking the '答えを確認する' button for selection
  const quizQuestionSelectionOptionsDivElm =
    quizQuestionBtnContDivElms[1].querySelector('div');
  const quizQuestionSelectionOptionsButtonElm =
    quizQuestionBtnContDivElms[1].querySelector('button');
  quizQuestionSelectionOptionsButtonElm?.addEventListener('click', function () {
    const checkboxElms =
      quizQuestionSelectionOptionsDivElm?.querySelectorAll('input');
    let values: [boolean, string][] = [];
    checkboxElms?.forEach((elm) => {
      values.push([elm.checked, String(elm.dataset.value)]);
    });
    displayQuizAnswers(
      null,
      currentQuizDataForPractice as InputsForResult,
      values,
      aQuizData,
      quizIndex,
      quizDataForPractice as Map<number, InputsForResult>,
      quizStartQuestionButtonElms as NodeListOf<HTMLButtonElement>,
      quizStartNotesTextAreaDivElm as HTMLElement,
      aListUlElm,
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
    quizDivElms[1].classList.add('d-none');
    quizDivElms[2].classList.remove('d-none');
  });

  // end
  const quizStartEndElm = document.querySelector('.js-quizStartEnd');
  quizStartEndElm?.addEventListener('click', function () {
    quizDivElms[0].classList.remove('d-none');
    quizDivElms[3].classList.add('d-none');
  });
}
