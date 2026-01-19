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
