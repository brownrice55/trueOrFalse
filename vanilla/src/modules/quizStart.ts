import { getCategoryOptions, getTypeOptions } from './common/form';
import type { InputsCategory } from '../types/inputsCategory.type';

export function setQuizStartForm(
  aQuizCategory: Map<number, InputsCategory>,
  aButtonSaveElm: HTMLButtonElement
) {
  const quizStartFormCategoryElm = document.querySelector(
    '.js-quizStartFormCategory'
  );
  if (quizStartFormCategoryElm) {
    quizStartFormCategoryElm.innerHTML = getCategoryOptions(
      aQuizCategory,
      'unspecified',
      aButtonSaveElm,
      false
    );
  }

  const quizStartFormTypeElm = document.querySelector('.js-quizStartFormType');
  if (quizStartFormTypeElm) {
    quizStartFormTypeElm.innerHTML = getTypeOptions('trueOrFalse', true);
  }
}
