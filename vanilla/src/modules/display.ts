import { Collapse } from 'bootstrap';

const funcForDisplay = (aIndex: number) => {
  const sectionElms = document.querySelectorAll<HTMLElement>('.js-section')!;
  sectionElms.forEach((elm) => {
    elm.classList.add('d-none');
  });
  sectionElms[aIndex].classList.remove('d-none');
};

import type { Inputs } from '../types/inputs.type';
export function setupInitialDisplay(
  quizCategory: string[],
  quizData: Map<number, Inputs>
) {
  const pageIndex = !quizCategory.length ? 3 : !quizData.size ? 2 : 0;
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
