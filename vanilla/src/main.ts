import './style.scss';
import 'bootstrap';
import { getDataFromLocalStorage } from './modules/dataManagement';
import { addCategoryInput } from './modules/categorySettings';
import {
  setupDisplay,
  switchPage,
  closeGlobalMenu,
  setCategoryInputs,
} from './modules/display';
import type { Inputs } from './types/inputs.type';
import type { InputsCategory } from './types/inputsCategory.type';

document.body.classList.add('loaded');

const quizCategory = getDataFromLocalStorage('quizCategory');
const quizData = getDataFromLocalStorage('quizData');

const globalNavElm = document.querySelector<HTMLElement>('.js-globalNav');
const globalNavLiElms = globalNavElm?.querySelectorAll<HTMLLIElement>('li');

setupDisplay(
  quizCategory as Map<number, InputsCategory>,
  quizData as Map<number, Inputs>
);

globalNavLiElms?.forEach((elm) => {
  elm.addEventListener('click', function (e: MouseEvent) {
    const target = e.currentTarget as HTMLElement;
    const listIndex = Number(target.dataset.index);
    switchPage(listIndex);
  });
});

if (globalNavElm) {
  closeGlobalMenu(globalNavElm);
}

const buttonSaveElm =
  document.querySelector<HTMLButtonElement>('.js-buttonSave');

setCategoryInputs(
  quizCategory as Map<number, InputsCategory>,
  quizData as Map<number, Inputs>,
  buttonSaveElm as HTMLButtonElement
);

addCategoryInput();
