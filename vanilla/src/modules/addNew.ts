import type { InputsCategory } from '../types/inputsCategory.type';
import type { Inputs } from '../types/inputs.type';

export function setCategoryOptions(
  aQuizCategory: Map<number, InputsCategory>,
  aAddNewCategoryElm: HTMLElement
) {
  let optionHTML = `<option selected>選択してください</option>`;
  [...aQuizCategory].forEach(([idx, obj]) => {
    optionHTML += `<option value="${idx}">${obj.categoryName}</option>`;
  });
  optionHTML += `<option value="add">カテゴリーを追加する</option>`;

  aAddNewCategoryElm.innerHTML = optionHTML;
}

export function switchType(
  aAddNewTypeSelectElm: HTMLElement,
  aAddNewTypeDivElms: NodeListOf<HTMLElement>
) {
  aAddNewTypeSelectElm.addEventListener('change', function (e) {
    const type = (e.currentTarget as HTMLInputElement).value;
    const indices: number[] = type === 'trueOrFalse' ? [0, 1] : [1, 0];
    aAddNewTypeDivElms[indices[0]].classList.remove('d-none');
    aAddNewTypeDivElms[indices[1]].classList.add('d-none');
    // ******** need form validation
  });
}

const getHTMLForOptionInputs = (aNumber: number) => {
  let html = '';
  Array(aNumber)
    .fill('')
    .forEach((_, idx) => {
      html += `<div class="input-group mb-3">
                <div class="input-group-text">
                  <input id="option${idx + 1}" 
                    class="form-check-input mt-0"
                    type="checkbox"
                    value=""
                  />
                </div>
                <input id="option${idx + 1}-2"  type="text" class="form-control" />
              </div>`;
    });
  return html;
};

export function setOptionInputs(
  aAddNewOptionNumberSelectElm: HTMLSelectElement,
  aAddNewOptionInputsDivElm: HTMLElement
) {
  aAddNewOptionNumberSelectElm.addEventListener('change', function (e) {
    const number = parseInt((e.currentTarget as HTMLSelectElement).value);
    aAddNewOptionInputsDivElm.innerHTML = getHTMLForOptionInputs(number);
  });
}

export function saveQuizData(
  aQuizData: Map<number, Inputs>,
  aButtonAddNewElm: HTMLButtonElement,
  aAddNewCategoryElm: HTMLSelectElement,
  aAddNewTypeSelectElm: HTMLSelectElement,
  aAddNewTextAreaElms: NodeListOf<HTMLTextAreaElement>,
  aAddNewPrioritySelectElm: HTMLSelectElement,
  aAddNewAnswerRadioElms: NodeListOf<HTMLInputElement>,
  aAddNewOptionNumberSelectElm: HTMLSelectElement
) {
  aButtonAddNewElm.addEventListener('click', function () {
    const newValue: Inputs = {
      category: '',
      type: '',
      question: '',
      answer: 0,
      numberOfOptions: 0,
      options: [[false, '']],
      explanation: '',
      priority: '',
    };
    newValue.category = aAddNewCategoryElm.value;
    newValue.type = aAddNewTypeSelectElm.value;
    newValue.question = aAddNewTextAreaElms[0].value;
    newValue.explanation = aAddNewTextAreaElms[1].value;
    newValue.priority = aAddNewPrioritySelectElm.value;
    newValue.answer = aAddNewAnswerRadioElms[0].checked ? 1 : 2;
    newValue.numberOfOptions = parseInt(aAddNewOptionNumberSelectElm.value);

    const keysArray: number[] = aQuizData.size
      ? Array.from(aQuizData.keys())
      : [];
    const newId: number = aQuizData.size
      ? keysArray[keysArray.length - 1] + 1
      : 1;

    aQuizData.set(newId, newValue);
  });
}
