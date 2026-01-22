import { Collapse } from 'bootstrap';
import {
  saveCategoryData,
  addCategoryInput,
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

export function setCategoryInputs(
  quizCategory: Map<number, InputsCategory>,
  quizData: Map<number, Inputs>
) {
  const inputCategoryAreaElm =
    document.querySelector<HTMLElement>('.js-inputCategory');
  const len = quizCategory.size ? quizCategory.size : 3;
  let inputsData = '';
  for (let cnt = 0; cnt < len; ++cnt) {
    const currentData = quizCategory.get(cnt);
    if (currentData) {
      inputsData += `<div class="my-3">
    <input type="text" class="form-control" id="${cnt}" value="${currentData.categoryName || ''}" data-isActive="${currentData.isActive || false}" />
    </div>`;
    }
  }
  if (inputCategoryAreaElm !== null) {
    inputCategoryAreaElm.innerHTML = inputsData;
  }

  saveCategoryData(quizData as Map<number, Inputs>);
  addCategoryInput(inputCategoryAreaElm as HTMLElement);
}
