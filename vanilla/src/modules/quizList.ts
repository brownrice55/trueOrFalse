import { setQuizList } from './display';
import type { Inputs } from '../types/inputs.type';

const setEventForDisplayDetail = (
  aQuizData: Map<number, Inputs>,
  aListDivElms: NodeListOf<HTMLElement>
) => {
  const listDetailButtonElms = document.querySelectorAll(
    '.js-listDetailButton'
  );

  const buttonDeleteDetailElm = document.querySelector(
    '.js-buttonDeleteDetail'
  );

  listDetailButtonElms.forEach((elm) => {
    elm.addEventListener('click', function (e) {
      aListDivElms[0].classList.add('d-none');
      aListDivElms[1].classList.remove('d-none');

      const listDdElms = document.querySelectorAll('.js-listDd');

      const key = parseInt(
        (e.currentTarget as HTMLButtonElement).dataset.key ?? '0'
      );
      const currentVal = aQuizData.get(key);
      const arrayTextQuestionAnswer = ['まる', 'ばつ'];
      if (currentVal) {
        listDdElms[0].innerHTML = currentVal.category;
        listDdElms[1].innerHTML = currentVal.type;
        listDdElms[2].innerHTML = currentVal.question;
        let answerForSelection = '';
        if (currentVal.type === 'selection') {
          currentVal.options.forEach((arr) => {
            if (arr[0]) {
              if (answerForSelection) {
                answerForSelection += '、';
              }
              answerForSelection += arr[1];
            }
          });
        }
        listDdElms[3].innerHTML =
          currentVal.type === 'trueOrFalse'
            ? arrayTextQuestionAnswer[currentVal.answer]
            : answerForSelection;
        listDdElms[4].innerHTML = currentVal.explanation;
        listDdElms[5].innerHTML = currentVal.priority;
        listDdElms[6].innerHTML = currentVal.notes;
        listDdElms[7].innerHTML =
          currentVal.numberOfAnswers && currentVal.numberOfCorrectAnswers
            ? (currentVal.numberOfCorrectAnswers / currentVal.numberOfAnswers) *
                100 +
              '%'
            : '0%';
      }

      buttonDeleteDetailElm?.addEventListener('click', function () {
        // ***** add modal to confirm to delete
        aQuizData.delete(key);
        localStorage.setItem('quizData', JSON.stringify([...aQuizData]));
        aListDivElms[0].classList.remove('d-none');
        aListDivElms[1].classList.add('d-none');
        setQuizList(aQuizData);
      });
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
  setEventForDisplayDetail(aQuizData, aListDivElms as NodeListOf<HTMLElement>);
  setEventForBackToListPage(aListDivElms as NodeListOf<HTMLElement>);
}
