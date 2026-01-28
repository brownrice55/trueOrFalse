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
  aQuizCategory: Map<number, InputsCategory>,
  aQuizData: Map<number, Inputs>
) {
  const pageIndex = !aQuizCategory.size ? 3 : !aQuizData.size ? 2 : 0;
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
  aQuizCategory: Map<number, InputsCategory>
) {
  const len = aQuizCategory.size ? aQuizCategory.size : 3;
  let inputsData = '';
  for (let cnt = 0; cnt < len; ++cnt) {
    const currentData = aQuizCategory.get(cnt);
    inputsData += `<div class="my-3">
    <input type="text" class="form-control" id="input-${cnt}" value="${currentData?.categoryName || ''}" data-is-active="${currentData?.isActive || false}" data-index="${cnt}" />
    </div>`;
  }
  return inputsData;
}

export function setCategoryInputs(
  aQuizCategory: Map<number, InputsCategory>,
  aQuizData: Map<number, Inputs>,
  aButtonSaveElm: HTMLButtonElement,
  aInputCategoryAreaElm: HTMLElement
) {
  if (aInputCategoryAreaElm !== null) {
    aInputCategoryAreaElm.innerHTML = getCategoryInputHTML(aQuizCategory);
  }
  const inputCategoryElms =
    aInputCategoryAreaElm?.querySelectorAll<HTMLInputElement>('input');

  let initialInputValues: string[] = getCategoryInputValues(
    inputCategoryElms as NodeListOf<HTMLInputElement>
  );

  saveCategoryData(
    aQuizData as Map<number, Inputs>,
    aButtonSaveElm as HTMLButtonElement,
    aInputCategoryAreaElm
  );

  setValidation(
    aButtonSaveElm,
    initialInputValues,
    aQuizCategory,
    aInputCategoryAreaElm
  );
}
