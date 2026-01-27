import { Collapse } from 'bootstrap';
import {
  saveCategoryData,
  setValidation,
  getCategoryInputValues,
} from '../modules/categorySettings';
import type { Inputs } from '../types/inputs.type';
import type { InputsCategory } from '../types/inputsCategory.type';

const funcForDisplay = (aIndex: number) => {
  const sectionElms = document.querySelectorAll<HTMLElement>('.js-section')!;
  sectionElms.forEach((elm) => {
    elm.classList.add('d-none');
  });
  sectionElms[aIndex].classList.remove('d-none');
};

export function setupDisplay(
  quizCategory: Map<number, InputsCategory>,
  quizData: Map<number, Inputs>
) {
  const pageIndex = !quizCategory.size ? 3 : !quizData.size ? 2 : 0;
  funcForDisplay(pageIndex);
}

export function switchPage(aIndex: number) {
  funcForDisplay(aIndex);
}

export function closeGlobalMenu(aGlobalNavElm: HTMLElement) {
  const bsCollapse = new Collapse(aGlobalNavElm, { toggle: false });

  const mediaQueryList = window.matchMedia('(max-width: 992px)');
  const hideMenus = (matches: boolean) => {
    if (matches) {
      document.addEventListener('click', function (e: MouseEvent) {
        const target = e.target;
        if (target instanceof Node) {
          bsCollapse.hide();
        }
      });
    }
  };

  const listener = (e: MediaQueryListEvent) => {
    hideMenus(e.matches);
  };

  mediaQueryList.addEventListener('change', listener);
  hideMenus(mediaQueryList.matches);
}

export function getCategoryInputHTML(
  quizCategory: Map<number, InputsCategory>
) {
  const len = quizCategory.size ? quizCategory.size : 3;
  let inputsData = '';
  for (let cnt = 0; cnt < len; ++cnt) {
    const currentData = quizCategory.get(cnt);
    inputsData += `<div class="my-3">
    <input type="text" class="form-control" id="input-${cnt}" value="${currentData?.categoryName || ''}" data-isActive="${currentData?.isActive || false}" data-index="${cnt}" />
    </div>`;
  }
  return inputsData;
}

export function setCategoryInputs(
  quizCategory: Map<number, InputsCategory>,
  quizData: Map<number, Inputs>,
  buttonSaveElm: HTMLButtonElement,
  inputCategoryAreaElm: HTMLElement
) {
  if (inputCategoryAreaElm !== null) {
    inputCategoryAreaElm.innerHTML = getCategoryInputHTML(quizCategory);
  }

  const inputCategoryElms =
    inputCategoryAreaElm?.querySelectorAll<HTMLInputElement>('input');

  let initialInputValues: string[] = getCategoryInputValues(
    inputCategoryElms as NodeListOf<HTMLInputElement>
  );

  saveCategoryData(
    quizData as Map<number, Inputs>,
    buttonSaveElm as HTMLButtonElement,
    inputCategoryAreaElm
  );

  setValidation(
    buttonSaveElm,
    initialInputValues,
    quizCategory,
    inputCategoryAreaElm
  );
}
