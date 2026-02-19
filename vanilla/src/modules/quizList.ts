import { setQuizList, setCategoryInputs } from './display';
import { getCategoryOptions } from './form';
import type { Inputs } from '../types/inputs.type';
import type { InputsCategory } from '../types/inputsCategory.type';

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

  listDetailButtonElms.forEach((elm) => {
    elm.addEventListener('click', function (e) {
      aListDivElms[0].classList.add('d-none');
      aListDivElms[1].classList.remove('d-none');

      const listDdElms = document.querySelectorAll('.js-listDd');
      const listEditBtnElms = document.querySelectorAll('.js-listEditBtn');

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
        if (quizQuestionSpanElm) {
          quizQuestionSpanElm.textContent = currentVal.question;
        }

        // edit start
        const setDisabled = (aIsUnderEdit: boolean) => {
          listEditBtnElms.forEach((elm) => {
            (elm as HTMLButtonElement).disabled = aIsUnderEdit ? true : false;
          });
        };

        const setInnerHTMLForEdit = (idx: number) => {
          if (idx === 0) {
            listDdElms[0].innerHTML = isUnderEdit
              ? `<select
                class="form-select"
                aria-label="category"
                id="detailEdit${idx}"
              >` +
                getCategoryOptions(aQuizCategory) +
                '</select>'
              : currentVal.category;
          }
        };
        let isUnderEdit = false;
        let cancelBtnElm: HTMLButtonElement | null = null;
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
                elm.textContent = '編集する';
                setInnerHTMLForEdit(idx);
              });
            } else {
              elm.textContent = '編集する';
              cancelBtnElm?.remove();
              cancelBtnElm = null;
            }
            setInnerHTMLForEdit(idx);
          });
        });
        // edit end
      }

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
